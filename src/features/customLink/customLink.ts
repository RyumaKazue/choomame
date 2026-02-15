import { getBucket } from "@extend-chrome/storage";
import {  CustomLinkCollectionBucket, CustomLinkItemBucket, customLinkFetchJsonSchema, initialCustomLinkUrls, customLinkCollectionSchema, CustomLinkItem } from "./customLinkSchema";
import JSON5 from "json5";

export const customLinkCollectionBucket = getBucket<CustomLinkCollectionBucket>("customLinkCollections")
export const customLinkItemBucket = getBucket<CustomLinkItemBucket>("customLinkItems")

export const fetchJsonFromUrl = async (url: string): Promise<customLinkFetchJsonSchema> => {
    const text: string = await (await fetch(url)).text();
    const json = JSON5.parse<customLinkFetchJsonSchema>(text);

    const result = customLinkCollectionSchema.safeParse(json);

    if(!result.success){
        const messages = result.error.issues.map(issue => ({
            property: issue.path.join("."),
            message: issue.message,
            code: issue.code,
        }));

        throw new Error(`Failed to parse custom link collection from ${url}: ${JSON.stringify(messages)}`);
    }

    return result.data;
};

export const customLinkCollectionOnInstalled = async () => {
    const keys = await customLinkCollectionBucket.getKeys();

    if (keys.length !== 0) {
        return;
    }
    for (const initialCustomLinkUrl of initialCustomLinkUrls) {
        const data = await fetchJsonFromUrl(initialCustomLinkUrl);
        await customLinkCollectionBucket.set({
            [data.id]: {
                id: data.id,
                name: data.name,
                url: initialCustomLinkUrl
            }
        });
    }
};

export const customCollectionItemsOnInstalled = async () => {
    const collections = await customLinkCollectionBucket.get();
    for( const collection of Object.values(collections) ){   
        const result = await fetchJsonFromUrl(collection.url);

        for( const item of result.items ){
            const itemId = `${collection.id}/${item.id}`;
            item.id = itemId;
            await customLinkItemBucket.set({
                [item.id]: item
            });
        }
    }
};

export const updateCustomLinkCollectionOnAlarm = async () => {
    const collections = await customLinkCollectionBucket.get();
    const itemBucket = await customLinkItemBucket.get();

    for( const collection of Object.values(collections) ){
        const url = collection.url;
        const data = await fetchJsonFromUrl(url);
        // コレクションに属しているアイテムを抽出
        let assignToCollection_Items: CustomLinkItemBucket = {};
        for( const [id, item] of Object.entries(itemBucket)){
            if( id.startsWith(collection.id) ){
                assignToCollection_Items[id] = item;
            }
        }

        const latestItems = data.items;

        let afterItemBucket: CustomLinkItemBucket = {};
        for( const item of latestItems ){
            const id = `${collection.id}/${item.id}`;
            afterItemBucket[id] = {
                ...item,
                id
            }
        }

        const afterIdSet = new Set( Object.keys(afterItemBucket) );
        const beforeIds = Object.keys(assignToCollection_Items);

        // どちらにも存在するID
        const sameIds = new Set(
            beforeIds.filter((beforeId) => afterIdSet.has(beforeId))
        )

        // 最新のアイテムにのみ存在するID
        const afterOnlyBucket: CustomLinkItemBucket = {};
        afterIdSet.forEach( (afterId) => {
            if( !sameIds.has(afterId) ){
                afterOnlyBucket[afterId] = afterItemBucket[afterId];
            }
        });

        // 最新のアイテムに存在しないID
        const beforeOnlyIds = beforeIds.filter((beforeId) => !sameIds.has(beforeId));

        // 追加分を保存
        await customLinkItemBucket.set(afterOnlyBucket);

        // 削除分を削除
        await customLinkItemBucket.remove(beforeOnlyIds);

        // 最新のものに更新
        for( const id of sameIds ){
            const updateItem: CustomLinkItem = {
                ...afterItemBucket[id],
                enabled: assignToCollection_Items[id].enabled
            };
            await customLinkItemBucket.set(
                {
                    [updateItem.id]: updateItem
                }
            )
        }
    }
};

export function toMatchWithDelimiter(match: string): RegExp {
  return new RegExp("(^|\\s)(" + match + ")(\\s|$)", "i");
}
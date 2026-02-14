import { getBucket } from "@extend-chrome/storage";
import {  CustomLinkCollectionBucket, CustomLinkItemBucket, customLinkFetchJsonSchema, initialCustomLinkUrls, customLinkCollectionSchema, CustomLinkItem } from "./customLinkSchema";
import JSON5 from "json5";

export const customLinkCollectionBucket = getBucket<CustomLinkCollectionBucket>("customLinkCollections")
export const customLinkItemBucket = getBucket<CustomLinkItemBucket>("customLinkItems")

export const customLinkCollectionOnInstalled = async () => {
    const keys = await customLinkCollectionBucket.getKeys();

    if (keys.length !== 0) {
        return;
    }
    for (const initialCustomLinkUrl of initialCustomLinkUrls) {
        const text: string = await (await fetch(initialCustomLinkUrl)).text();
        const object = JSON5.parse<customLinkFetchJsonSchema>(text);

        const data = customLinkCollectionSchema.parse(object);
        customLinkCollectionBucket.set({
            [data.id]: {
                id: data.id,
                name: data.name,
                url: initialCustomLinkUrl
            }
        });
    }
};

export const customCollectionItemsOnInstalled = async () => {
    if( (await customLinkCollectionBucket.getKeys()).length !== 0 ){
        return;
    }

    const collections = await customLinkCollectionBucket.get();
    for( const value of Object.values(collections) ){   
        const url = value.url;
        const text: string = await (await fetch(url)).text();
        const result = JSON5.parse<customLinkFetchJsonSchema>(text);

        for( const item of result.items ){
            const itemId = `${value.id}/${item.id}`;
            item.id = itemId;
            customLinkCollectionBucket.set({
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
        const text: string = await (await fetch(url)).text();
        const object = JSON5.parse<customLinkFetchJsonSchema>(text);

        const result = customLinkCollectionSchema.safeParse(object);

        if(!result.success){
            console.error(`Failed to parse custom link collection from ${url}:`, result.error);
            continue;
        }

        const data = result.data;
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
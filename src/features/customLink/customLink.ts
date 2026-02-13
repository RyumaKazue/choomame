import { getBucket } from "@extend-chrome/storage";
import {  CustomLinkCollectionBucket, CustomLinkItemBucket, customLinkFetchJsonSchema, initialCustomLinkUrls, customLinkCollectionSchema } from "./customLinkSchema";
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

    //test
    const data = await customLinkItemBucket.get();
    console.log(data);
};
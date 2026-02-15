import { customLinkCollectionBucket, customLinkItemBucket } from "../customLink/customLink";

export const collectionBucketClear = async () => {
    await customLinkCollectionBucket.clear();
};

export const itemBucketClear = async () => {
    await customLinkItemBucket.clear();
};

export const hasCollectionBucket = async () => {
    const hasCollection = (await customLinkCollectionBucket.getKeys()).length > 0;

    if(!hasCollection){
        throw new Error("Collection bucket is empty");
    }
}

export const hasItemBucket = async () => {
    const hasItem = (await customLinkItemBucket.getKeys()).length > 0;

    if(!hasItem){
        throw new Error("Item bucket is empty");
    }
}
 
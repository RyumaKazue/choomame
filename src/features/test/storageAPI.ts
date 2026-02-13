import { customLinkCollectionBucket, customLinkItemBucket } from "../customLink/customLink";

export const collectionBucketClear = async () => {
    customLinkCollectionBucket.clear();
};

export const itemBucketClear = async () => {
    customLinkItemBucket.clear();
};
import { getBucket } from "@extend-chrome/storage";
import { customLinkCollectionBucket, initialCustomLinkUrls } from "./customLinkSchema";

export const customLinkCollectionOnInstalled = async () => {
    const bucket: customLinkCollectionBucket = await getBucket("customLinkCollection").get();
    if (Object.keys(bucket).length !== 0) {
        return;
    }

    for (const initialCustomLinkUrl of initialCustomLinkUrls) {
        const text: string = await (await fetch(initialCustomLinkUrl)).text();

        const result = JSON5.parse<>(text);
    }
};
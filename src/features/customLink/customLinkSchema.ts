import { z } from "zod";

const messageStringMinMax = ( min: number, max:number ) => {
    return z.string().refine( (value) => {
        value.length > min && value.length < max
    });
};

const customLinkItemSchema = z.object( {
    id: z.string(),
    group: z.string(),
    match: z.string(),
    name: messageStringMinMax(10, 100),
    url: messageStringMinMax(10, 200),
    enabled: z.boolean().default(true),
});

export const customLinkCollectionSchema = z.object({
    id: z.string(),
    name: messageStringMinMax(10, 100),
    items: z.array(customLinkItemSchema),
});



export type CustomLinkCollection = {
    id: string;
    name: string;
    url: string;
}

export type CustomLinkItem = z.infer<typeof customLinkItemSchema>;

export type customLinkFetchJsonSchema = z.infer<typeof customLinkCollectionSchema>;

export type CustomLinkCollectionBucket = Record<string, CustomLinkCollection>;
export type CustomLinkItemBucket = Record<string, CustomLinkItem>

export let initialCustomLinkUrls = [
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/developer.json5",
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/aws.json5",
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/google-cloud.json5",
];
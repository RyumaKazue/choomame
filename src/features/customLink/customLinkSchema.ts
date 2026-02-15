import { z } from "zod";

const messageStringMinMax = ( min: number, max:number ) => {
    return z
        .string()
        .min(min, { message: `Must be at least ${min} characters` })
        .max(max, { message: `Must be at most ${max} characters` });
};

const customLinkItemSchema = z.object( {
    id: z.string({ message: "id must be a string" }),
    group: z.string({message: "Group is required"}),
    match: z.string({ message: "match must be a string" }),
    name: messageStringMinMax(1, 100),
    url: messageStringMinMax(1, 200),
    enabled: z.boolean().default(true),
});

export const customLinkCollectionSchema = z.object({
    id: z.string(),
    name: messageStringMinMax(1, 100),
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

export type CustomLinkItemBucket = Record<string, CustomLinkItem>;

export let initialCustomLinkUrls = [
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/developer.json5",
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/aws.json5",
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/google-cloud.json5",
];
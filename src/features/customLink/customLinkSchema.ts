export type CustomLinkCollection = {
    id: string;
    name: string;
    url: string;
}

export type customLinkCollectionBucket = Record<string, CustomLinkCollection>;

export let initialCustomLinkUrls = [
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/developer.json5",
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/aws.json5",
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/google-cloud.json5",
];
import { getBucket } from "@extend-chrome/storage";
import { Language, LanguagesBucket, languageUnitOrder, initialLanguagesStorage, convertLanguagesToBucket } from "./languagesSchema";

const languagesBucket = getBucket<LanguagesBucket>("languages");

export const languagesOnInstalled = async () => {
    const bucket = await languagesBucket.get();
    if(Object.keys(bucket).length === 0){
        await languagesBucket.set(convertLanguagesToBucket(initialLanguagesStorage));
    }
};

export const getLanguages = async (): Promise<LanguagesBucket> => {
    const bucket = await languagesBucket.get();
    return bucket;
};

export const sort_languages = (a: Language, b: Language): number => {
    const a_order = languageUnitOrder[a.unit];
    const b_order = languageUnitOrder[b.unit];

    if(a_order < b_order) {
        return -1;
    }else if(a_order > b_order){
        return 1;
    }

    return 0;
};
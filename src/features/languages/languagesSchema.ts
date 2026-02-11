export type LanguagesUnit = 
| "Any"
| "en"
| "ja"

export type Language = {
    languageId: string;
    unit: LanguagesUnit;
};

export type LanguagesBucket = Record<string, Language>;

export const languageUnitOrder: Record<LanguagesUnit, number> = {
    Any: 0,
    ja: 1,
    en: 2,
};

export const convertLanguagesToBucket = (languages: Language[]): LanguagesBucket => {
    let bucket: LanguagesBucket = {};
    for (const language of languages){
        bucket[language.languageId] = language;
    }
    return bucket;
};

export const initialLanguagesStorage: Language[] = [
    {
        languageId: "Any",
        unit: "Any"
    },
    
    {
        languageId: "lang_en",
        unit: "en"
    },

    {
        languageId: "lang_ja",
        unit: "ja"
    }
]
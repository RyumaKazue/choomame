import { useState, useEffect } from "react";
import { Param } from "../param/param";
import { getLink } from "../common/getLink";
import { Language } from "./languagesSchema";
import { getLanguages, sort_languages } from "./languages";
import { Stack, Button } from "@mui/material";

type Props = {
    param: Param;
};

export const LanguageLink: React.FC<Props> = ({ param }) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    useEffect(() => {
        (async () => {
            setLanguages(
                Object.values( await getLanguages()).sort((a, b) => sort_languages(a, b))
            );
        })();
    }, []);
    
    return (
        <Stack 
        useFlexGap 
        direction="row" 
        spacing={1} 
        flexWrap="wrap" 
        justifyContent="flex-start" 
        alignItems="center"
        sx={{ p: 2, width: '100%' }}>
            {languages.map((language) => {
                return (
                    <Button 
                        key={language.languageId}
                        variant="contained"
                        size="small"
                        href={getLink(param, undefined,language)}>
                            {language.unit}
                    </Button>
                )
            })}
        </Stack>
    );
};
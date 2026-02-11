import { Time } from "../times/timesSchema";
import { Param, ParamTbs } from "../param/param";
import { Language } from "../languages/languagesSchema";


export const getLink = (param: Param, time?: Time, language?: Language): string => {
    const new_params = new URLSearchParams();
    new_params.set("q", param.q);

    console.log("param.tbs:", JSON.stringify(param.tbs));
    let new_tbs: ParamTbs = {};
    Object.assign(new_tbs, param.tbs);

    if (time !== undefined) {
        delete new_tbs.qdr;
        if (time.timeId !== "Any") {
            let new_qdr: string;
            if (time.number === 1) {
                new_qdr = time.timeId.charAt(0);
            } else {
                new_qdr = time.timeId;
            }
            new_tbs.qdr = new_qdr;
        }
    }

    delete new_tbs.cdr;
    delete new_tbs.cd_min;
    delete new_tbs.cd_max;

    if (Object.keys(new_tbs).length > 0) {
        new_params.set("tbs",
            Object.entries(new_tbs)
                .map(array => {
                    return array.join(":");
                }).join(",")
        );
    }

    if (language !== undefined) {
        if (language.unit !== "Any") {
            new_params.set("lr", language.languageId);
        }
    }

    const url = new URL(param.url);
    url.search = new_params.toString();

    return url.toString().replace("&tbs=qdr%3A", "&tbs=qdr:");
};
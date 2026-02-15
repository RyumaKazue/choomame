export type ParamTbs = Record<string, string>;

export type Param = {
    url: string;
    q: string;
    tbs: ParamTbs;
    lr: string;
    tbm: string;
    sidesearch: boolean;
}


export const getParam = (): Param => {
    const url = new URL(location.href);
    const a = url.searchParams.get("tbs");
    let tbs: ParamTbs = {};
    a?.split(",").forEach(pair => {
        const [key, value] = pair.split(":");
        tbs[key] = value;
    });

    const param: Param = {
        url: url.href,
        q: url.searchParams.get("q") || "",
        tbs: tbs,
        lr: url.searchParams.get("lr") || "",
        tbm: url.searchParams.get("tbm") || "",
        sidesearch: url.searchParams.get("sidesearch") === "1",
    };

    console.log("param:", JSON.stringify(param));

    return param;
}


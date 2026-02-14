import {useState, useEffect} from "react";
import { customLinkItemBucket } from "./customLink";
import { CustomLinkItemBucket } from "./customLinkSchema";
import { Link } from "@mui/material";

type Props = {
    paramQuery: string;
}

export const CustomLinkItemLink: React.FC<Props> = ( {paramQuery}) => {
    const [itemsByGroup, setItemsByGroup] = useState<Record<string, JSX.Element[]>>({});
    const [bucket, setBucket] = useState<CustomLinkItemBucket>({});

    useEffect(() => {
        (async () => {
            const bucket = await customLinkItemBucket.get();
            setBucket(bucket);
        })();
    }, []);

    useEffect(() => {
        const groupItems: Record<string, JSX.Element[]> = {};

        for(const item of Object.values(bucket)){
            if(!item.enabled){
                continue;
            }

            const query = new RegExp(item.match);
            if(!query.test(paramQuery)){
                continue;
            }

            const keyword = encodeURIComponent(
                paramQuery.replace(query, " ").trim()
            );

            groupItems[item.group] = groupItems[item.group] ?? [];

            // item.urlが%sを含む場合
            if(/%s/.test(item.url)){
                groupItems[item.group].push(
                    <Link
                    href={item.url.replace(/%s/, keyword)}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                        {item.name}
                    </Link>
                )
            }else{
                groupItems[item.group].push(
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.name}
                    </Link>
                )
            }
        }
        setItemsByGroup(groupItems);

    }, [bucket, paramQuery]);

    return(
        <div>
            {paramQuery}
        </div>
    );
};
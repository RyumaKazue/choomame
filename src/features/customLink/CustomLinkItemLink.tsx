import { useState, useEffect } from "react";
import { customLinkItemBucket, toMatchWithDelimiter } from "./customLink";
import { CustomLinkItemBucket } from "./customLinkSchema";
import { Link, Stack, Card, CardContent } from "@mui/material";

type Props = {
    paramQuery: string;
}

export const CustomLinkItemLink: React.FC<Props> = ({ paramQuery }) => {
    const [itemsByGroup, setItemsByGroup] = useState<Record<string, React.JSX.Element[]>>({});
    const [bucket, setBucket] = useState<CustomLinkItemBucket>({});

    useEffect(() => {
        console.log("CustomLinkItemLink mounted");
        (async () => {
            const bucket = await customLinkItemBucket.get();
            setBucket(bucket);
        })();
    }, []);

    useEffect(() => {
        const groupItems: Record<string, React.JSX.Element[]> = {};

        for (const item of Object.values(bucket)) {
            console.log("item:", JSON.stringify(item));
            if (!item.enabled) {
                continue;
            }

            const query = toMatchWithDelimiter(item.match);
            if (!query.test(paramQuery)) {
                continue;
            }

            const keyword = encodeURIComponent(
                paramQuery.replace(query, " ").trim()
            );

            groupItems[item.group] = groupItems[item.group] ?? [];

            // item.urlが%sを含む場合
            if (/%s/.test(item.url)) {
                groupItems[item.group].push(
                    <Link
                        href={item.url.replace("%s", keyword)}
                        key={item.id}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {item.name}
                    </Link>
                )
            } else {
                groupItems[item.group].push(
                    <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.name}
                        </Link>

                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                            only
                        </Link>
                    </Stack>

                )
            }
        }
        setItemsByGroup(groupItems);

    }, [bucket, paramQuery]);

    return (
        <Stack useFlexGap sx={{ width: "100%", flexWrap: "wrap" }} direction="row" alignItems="flex-start" spacing={1}>
            {Object.entries(itemsByGroup).map(
                ([group, elements]) => {
                    return (
                        <Card key={group} variant="outlined" sx={{ p: 1 }}>
                            <CardContent>
                                <Stack direction="column">
                                    {group}
                                    {elements}
                                </Stack>
                            </CardContent>
                        </Card>
                    )
                }
            )}
        </Stack>
    );
};
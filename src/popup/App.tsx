import { TextField, Stack, Link, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAsync } from "react-use";
import { CustomLinkItemBucket } from "../features/customLink/customLinkSchema";
import { customLinkItemBucket } from "../features/customLink/customLink";

export const App: React.FC = () => {
    const [query, setQuery] = useState("");
    const [bucket, setBucket] = useState<CustomLinkItemBucket>({});
    const {value: itemGroups} = useAsync(async () => {
        const groupItems: Record<string, React.JSX.Element[]> = {};

        for (const item of Object.values(bucket)) {
            if (!item.enabled) {
                continue;
            }

            const regex = new RegExp("(\\s|^)" + item.match + "(\\s|$)");
            if (!regex.test(query)) {
                continue;
            }

            groupItems[item.group] = groupItems[item.group] ?? [];
            if (item.url.includes("%s")) {
                const keyword = encodeURIComponent(
                    query.replace(regex, " ").trim()
                );
                groupItems[item.group].push(
                    <Link href={item.url.replace("%s", keyword)} target="_blank">{item.name}</Link>
                )

            } else {
                groupItems[item.group].push(
                    <Stack direction="row" spacing={1} justifyContent="flex-start">
                        <Link href={item.url} target="_blank">{item.name}</Link>
                    </Stack>
                )
            }


        }

        return groupItems;
    }, [query]);


    useEffect(() => {
        (async () => {
            const bucket = await customLinkItemBucket.get();
            setBucket(bucket);
        })();
    }, []);


    return (
        <div style={{ width: 320, padding: 12 }}>
            <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="検索キーワードを入力"
                onChange={(event) => {
                    setQuery(event.target.value);

                }}
            />

            <Stack direction="column" spacing={1} sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
                {Object.entries(itemGroups ?? {}).map(([group, elements]) => (
                    <Stack key={group} direction="column" border={1} borderColor="divider" justifyContent="flex-start" p={1}>
                        <Typography variant="subtitle2" sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
                            {group}
                        </Typography>
                        {elements}
                    </Stack>
                ))}
            </Stack>
        </div>
    )
};
import {useState, useEffect} from "react";
import { CustomLinkItemBucket } from "../features/customLink/customLinkSchema";
import { customLinkItemBucket } from "../features/customLink/customLink";
import { Stack, Typography, Checkbox } from "@mui/material";

export const App: React.FC = () => {
    const [bucket, setBucket] = useState<CustomLinkItemBucket>({});
    const [updateFlg, setUpdateFlg] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            if(updateFlg === null || updateFlg === true){
                const bucket = await customLinkItemBucket.get();
                setBucket(bucket);
                setUpdateFlg(false);
            }
        })();

    }, [updateFlg]);

    return (
        <Stack direction="column" spacing={1} alignItems="center">
            {Object.values(bucket).map((item) => (
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1} key={item.id}>
                    <Typography>{item.name}</Typography>
                    <Typography>{item.url}</Typography>
                    <Typography>{item.match}</Typography>
                    <Typography>{item.group}</Typography>
                    <Checkbox checked={item.enabled} onChange={
                        async (event) => {
                            const enabled = event.target.checked;
                            await customLinkItemBucket.set({
                                [item.id]: {
                                    ...item,
                                    enabled: enabled
                                }
                            });
                            setUpdateFlg(true);
                        }} 
                        />
                </Stack>
            ))}
        </Stack>
    )
};
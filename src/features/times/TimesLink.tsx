import { Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Time } from "./timesSchema";
import { getTimes, sort_times } from "./times";
import { Param } from "../param/param";
import { getLink } from "../common/getLink";

type Props = {
    param: Param;
}
export const TimesLink: React.FC<Props> = ({ param }) => {
    const [times, setTimes] = useState<Time[]>([]);

    useEffect(() => {
        (async () => {
            setTimes(
                Object.values(await getTimes()).sort((a, b) => sort_times(a, b))
            );
        })();

    }, [param]);

    return (
        <Stack
            useFlexGap
            sx={{ flexWrap: 'wrap', p: 2 }}
            width="100%"
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
        >

            {times.map((time) => {
                return (
                    <Button
                        key={time.timeId}
                        variant="contained"
                        size="small"
                        href={getLink(param, time, undefined)}
                    >
                        {time.timeId}
                    </Button>
                )
            })}
        </Stack>
    );
}
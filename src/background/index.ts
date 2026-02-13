import { timesOnInstalled } from "../features/times/times";
import { languagesOnInstalled } from "../features/languages/languages";
import { customLinkCollectionOnInstalled } from "../features/customLink/customLink";
import { collectionBucketClear, itemBucketClear } from "../features/test/storageAPI";

chrome.runtime.onInstalled.addListener(async (detail) => {
    console.log("onInstalled detail:", detail);
    if (detail.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        await timesOnInstalled();
        await languagesOnInstalled();
        await customLinkCollectionOnInstalled();
    }

    //開発時のみ使用
    else if (detail.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        await collectionBucketClear();
        await itemBucketClear();

        await timesOnInstalled();
        await languagesOnInstalled();
        await customLinkCollectionOnInstalled();
    }

    chrome.alarms.create("updateCheck", {
        periodInMinutes: 1440, // 24時間に1回
    });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "updateCheck") {
        await updateCustomLinkCollectionOnAlarm();
    }
});


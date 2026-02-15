import { timesOnInstalled } from "../features/times/times";
import { languagesOnInstalled } from "../features/languages/languages";
import { customLinkCollectionOnInstalled, customCollectionItemsOnInstalled, updateCustomLinkCollectionOnAlarm} from "../features/customLink/customLink";
import { collectionBucketClear, itemBucketClear, hasCollectionBucket, hasItemBucket } from "../features/test/storageAPI";

chrome.runtime.onInstalled.addListener(async (detail) => {
    console.log("onInstalled detail:", detail);
    if (detail.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        await timesOnInstalled();
        await languagesOnInstalled();
        await customLinkCollectionOnInstalled();
        await customCollectionItemsOnInstalled();
    }

    //開発時のみ使用
    else if (detail.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        //　開発中は更新後にストレージをクリア
        console.log("Extension updated, clearing storage for development...");
        await collectionBucketClear();
        await itemBucketClear();

        await timesOnInstalled();
        await languagesOnInstalled();
        await customLinkCollectionOnInstalled();
        await customCollectionItemsOnInstalled();

        await hasCollectionBucket();
        await hasItemBucket();
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


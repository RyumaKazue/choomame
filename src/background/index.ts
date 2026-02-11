import { timesOnInstalled } from "../features/times/times";
import { languagesOnInstalled } from "../features/languages/languages";
import { customLinkCollectionOnInstalled } from "../features/customLink/customLink";

chrome.runtime.onInstalled.addListener(async (detail) => {
    console.log("onInstalled detail:", detail);
    if( detail.reason === chrome.runtime.OnInstalledReason.INSTALL ){
        await timesOnInstalled();
        await languagesOnInstalled();
        await customLinkCollectionOnInstalled();
    }

    //開発時のみ使用
    else if( detail.reason === chrome.runtime.OnInstalledReason.UPDATE ){
        await timesOnInstalled();
        await languagesOnInstalled();
        await customLinkCollectionOnInstalled();
    }
});
import { FetchSysInfoResponse, SysInfo } from "../types";
import Axios from "axios";

addEventListener("message", (e) => {
    if(e.data.type == "getSysInfo") {
        setInterval(async () => {
            var sysInfo = await getSysInfo(e.data.apiUrl);
            postMessage(sysInfo);
        }, 1000);
    }
});

async function getSysInfo(apiUrl: string): Promise<SysInfo> {
    var sysInfoData = (await Axios.get(apiUrl +"/fetchSysInfo") as FetchSysInfoResponse).data;

    return sysInfoData;
}

import languages from "./lang";
import LocalStorage from "./client/utils/localStorage";
import PluginLoader from "./plugin/PluginLoader";
import { langStorageKey, langStorageType } from "./client/global";

// Init language list
var langList = [];
for(let key in languages) {
    langList.push(key);
}
document.querySelector("html")?.setAttribute("data-languages", JSON.stringify(langList));

// Init language
var currentLang = LocalStorage.getItem<langStorageType>(langStorageKey);
if(!currentLang) LocalStorage.setItem(langStorageKey, { language: window.navigator.language });

const lang = currentLang?.language ?? "";

document.body.setAttribute("data-lang", lang);

export default class Utils {
    /**
     * Get multi-language texts
     */
    public static $(strId: string): string {
        if(!languages[lang]) return ""; // If doesn't support the current lang, then return

        const pluginI18nList = PluginLoader.get().pluginI18nList;
        var str: string = "";

        if(Object.keys(languages[lang]).includes(strId)) {
            str = (languages as any)[lang][strId];
        } else {
            for(let i = 0; i < pluginI18nList.length; i++) {
                if(Object.keys((pluginI18nList[i] as any)[lang]).includes(strId)) {
                    str = pluginI18nList[i][lang][strId];
                }
            }
        }

        return str;
    }

    public static setLanguage(l: string): void {
        LocalStorage.setItem(langStorageKey, { language: l });
    }

    public static getLanguage(): string {
        return LocalStorage.getItem<langStorageType>(langStorageKey)?.language ?? "";
    }

    public static getLanguages(): string[] {
        var html = document.querySelector("html");
        if(!html) return [];

        return JSON.parse(html.getAttribute("data-languages") ?? "") as string[];
    }

    /** @see https://blog.csdn.net/LUxxxX/article/details/90177682 */
    public static formatFloat(num: number, n: number): string | boolean {   
        var f = parseFloat(num.toString());
        if(isNaN(f)) return false;
        f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
        var s = f.toString();
        var rs = s.indexOf('.');
        if(rs < 0) {
            rs = s.length;
            s += '.'; 
        }
        while(s.length <= rs + n) {
            s += '0';
        }
        return s;
    }

    public static itemMoveToFirst<T extends any[]>(key: number, arr: T): T {
        var str = arr.splice(key, 1);
        arr.push(str[0]);
        return arr;
    }

    public static getElem(id: string): HTMLElement {
        var elem = document.getElementById(id);
        if(!elem) return document.body;
        return elem;
    }

    public static formatTester(formats: string[], test: string): boolean {
        for(let i = 0; i < formats.length; i++) {
            if(test == formats[i]) {
                return true;
            }
        }
        return false;
    }

    public static sleep(time: number): Promise<{}> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    public static setCookie(key: string, value: string): void {
        document.cookie = key +"="+ value +"; path=/";
    }

    public static getCookie(key: string): string {
        var cookieArr = document.cookie.split(";");

        for(let i = 0; i < cookieArr.length; i++) {
            var item = cookieArr[i].trim().split("=");
            var itemKey = item[0], itemValue = item[1];
            if(itemKey == key) {
                return itemValue;
            }
        }

        return "";
    }

    /** @see https://unpkg.com/browse/nriot-utils@0.1.2/src/index.ts (line 22) */
    public static isObjectEqual<T = any>(obj1: T, obj2: T): boolean {
        var isEqual = true;
    
        for(let i in obj1) {
            if(typeof obj1[i] === "object" && typeof obj2[i] === "object") {
                if(!Utils.isObjectEqual(obj1[i] as any, obj2[i] as any)) isEqual = false;
                continue;
            }
    
            if(obj1[i] != obj2[i]) isEqual = false;
        }
        
        return isEqual;
    }

    public static arrayDeduplicate<T extends any[] = any[]>(arr: T): T {
        for(let i = 0; i < arr.length; i++) {
            var current = arr[i];
            for(let j = 0; j < arr.length; j++) {
                if(arr[j] === current && j !== i) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }
}

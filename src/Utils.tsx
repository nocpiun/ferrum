export default class Utils {
    // Consider https://blog.csdn.net/LUxxxX/article/details/90177682 (Anyway, this method is useless now)
    public static fomatFloat(num: number, n: number): string | boolean {   
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

    public static itemMoveToFirst(key: number, arr: any[]): any[] {
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
}

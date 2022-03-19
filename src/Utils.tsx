export default class Utils {
    /**
     * From: https://blog.csdn.net/LUxxxX/article/details/90177682
     */
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
}

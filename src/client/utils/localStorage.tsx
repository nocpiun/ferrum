export default class LocalStorage {
    public static getItem<T>(key: string): T | null {
        var value = window.localStorage.getItem(key);
        if(value) return JSON.parse(value) as T;

        return null;
    }

    public static setItem<T>(key: string, value: T): void {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    public static removeItem(key: string): void {
        window.localStorage.removeItem(key);
    }

    public static clear(): void {
        window.localStorage.clear();
    }
}

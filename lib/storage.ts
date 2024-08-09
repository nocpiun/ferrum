class Storage {
    private readonly localStorage = window.localStorage;
    
    public getItem(key: string, defaultValue: string): string {
        var result = this.localStorage.getItem(key);

        if(result) return result;
        this.setItem(key, defaultValue);
        
        return defaultValue;
    }

    public setItem(key: string, value: string) {
        this.localStorage.setItem(key, value);
    }

    public remove(key: string) {
        this.localStorage.removeItem(key);
    }

    public has(key: string): boolean {
        return this.localStorage.getItem(key) !== null;
    }
}

export const storage = (
    typeof window === "undefined" ? null : new Storage()
) as unknown as Storage;

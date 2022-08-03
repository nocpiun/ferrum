const rs = " ";

interface LoggerContent {
    as?: string
    value: any
}

export default class Logger {
    private static getTimeLabel(): string {
        const time = new Date();
        const hour = time.getHours() < 10 ? "0"+ time.getHours() : time.getHours();
        const minute = time.getMinutes() < 10 ? "0"+ time.getMinutes() : time.getMinutes();
        const second = time.getSeconds() < 10 ? "0"+ time.getSeconds() : time.getSeconds();

        return `${hour}:${minute}:${second}`;
    }

    private static getStyles(color: string): string[] {
        return [
            "background-color: #00a0d8; border-radius: 5px; padding: 1px 4px; color: white;",
            rs,
            "background-color: #9475cc; border-radius: 5px; padding: 1px 4px; color: white;",
            rs,
            "background-color: "+ color +"; border-radius: 5px; padding: 1px 4px; color: white;",
            rs,
        ];
    }

    public static log(content: LoggerContent, ...items: any): void {
        console.log(`%c${content.as ?? "Ferrum"}%c %c${this.getTimeLabel()}%c %clog%c ${content.value}`, ...this.getStyles("#1fa648"), ...items);
    }

    public static warn(content: LoggerContent, ...items: any): void {
        console.log(`%c${content.as ?? "Ferrum"}%c %c${this.getTimeLabel()}%c %cwarn%c ${content.value}`, ...this.getStyles("#eaa10a"), ...items);
    }

    public static error(content: LoggerContent, ...items: any): void {
        console.log(`%c${content.as ?? "Ferrum"}%c %c${this.getTimeLabel()}%c %cerror%c ${content.value}`, ...this.getStyles("#dc3545"), ...items);
    }
}

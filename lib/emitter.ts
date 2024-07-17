import { EventEmitter } from "node:events";

export default class Emitter extends EventEmitter {
    private static instance: Emitter;

    private constructor() {
        super();
        this.setMaxListeners(Infinity);
    }

    public static get(): Emitter {
        if(!this.instance) this.instance = new Emitter();

        return this.instance;
    }
}

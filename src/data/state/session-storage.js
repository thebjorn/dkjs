

import {LocalStorage} from "./local-storage";

export class SessionStorage extends LocalStorage {
    constructor(engine) {
        super(engine || window.sessionStorage);
        this.name = 'SessionStorage';
    }
}

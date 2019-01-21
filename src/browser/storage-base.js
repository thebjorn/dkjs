// @flow


class Storage {
    constructor() {
        // this.values:any = {};
    }
    
    get_item<T>(key: string, defaultValue: T): T { return defaultValue; }
    set_item<T>(key: string, value: T): void  {}
    has_key(key: string): boolean { return false; }
    
    // save_widget(w) {}
    // restore_widget(w) {}

}

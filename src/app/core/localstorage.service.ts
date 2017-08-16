import { Injectable } from '@angular/core';

@Injectable()
export class Localstorage {
    public localStorage: any;

    constructor() {
        if (!localStorage) {
            throw new Error('Current browser does not support Local Storage');
        }
        this.localStorage = localStorage;
    }

    public hasKey(key: string) {
        return !!this.localStorage[key];
    }

    public get (key: string, maxage?:number) {
        let item = this.localStorage[key] || false;
        if (!item) {
            return {};
        }

        try {
            item = JSON.parse(item);
        } catch (err) {
            // Invalid JSON, don't  use it
            return {};
        }

        if (item.__created !== undefined && maxage !== undefined) {
            var maxTime = Date.now() - (maxage * 1000);
            // Data is too old
            if (item.__created < maxTime) {
                // Log that we refuse to use old data
                console.info('getLocalstorage: Refusing to use data for "' + key + "\" since it's too old.");
                // Don't use this data, it's too old!
                return null;
            }
        }

        return item.data;
    }

    public set (key: string, value: any): void {
        this.localStorage[key] = JSON.stringify({
            'data': value,
            '__created': new Date().getTime()
        });
    }

    public remove (key: string): any {
        this.localStorage.removeItem(key);
    }
}

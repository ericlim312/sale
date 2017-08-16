import {Injectable} from '@angular/core';

@Injectable()

export class Debounce {
    // Save our timeout variable here
    private timeout;
    // Do a debounce
    do(func: Function, wait: number, immediate?: boolean) {
        // Set vars
        var obj = this, args = arguments;
        // Should call function right now?
        var callNow = immediate && !this.timeout;
        // Remove current timeout
        clearTimeout(this.timeout);
        // Set current timeout
        this.timeout = setTimeout(() => {
            // Reset timeout
            this.timeout = null;
            // Should not call right now
            if (!immediate) {
                func.apply(obj, args);
            }
        }, wait);
        // Call function right now!
        if (callNow) {
            func.apply(obj, args);
        }
    }
}

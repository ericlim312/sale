import {Component} from '@angular/core';
import {UnsubscriberComponent} from '../../core';
import {LogService} from './log.service';

@Component({
    selector: 'feed-log',
    styles: [
        '.error { background: #ffdaeb }'
    ],
    template: require('./log.component.html')
})
export class FeedLogComponent extends UnsubscriberComponent {
    public logs;
    public start;

    constructor(
        private _log: LogService
    ) {
        super();

        let d = new Date();

        // Subtract 2 days
        d.setDate(d.getDate()-2);

        this.start = d.toLocaleString();
    }

    next(token) {
        this._log.next(this.start, token);
    }

    load() {
        this._log.get(this.start, undefined);
    }

    ngOnInit() {
        this.subscriptions.push(
            this._log.log$.subscribe(logs => {
                this.logs = logs;
            }));

        this.load();
    }
}

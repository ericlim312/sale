import {Component, OnInit, ElementRef} from '@angular/core';
import {UnsubscriberComponent} from '../../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {FileUploader} from '../../core/file/all';
import {DataService} from '../../core/data.service';
import {StatusesService} from '../../settings';

@Component({
    providers: [DataService],
    template: require('./bookkeeping.component.html')
})
export class ExportOrdersBookkeepingComponent extends UnsubscriberComponent implements OnInit {
    public payload = { 
        type: 'active',
        mode: 'interval',
        start: null,
        end: null,
        deleted: true,
        status: null
    };

    public uploading = false;

    public statuses;
    public selectedStatus;

    constructor(
        private _dataService: DataService,
        private _statusesService: StatusesService,
        private _element: ElementRef
    ) {
        super();
    }

    ngOnInit() {
        let start = new Date();
        start.setMonth(start.getMonth() - 1);
        this.payload.start = this._formatDate(start);

        this.payload.end = this._formatDate(new Date());

        this.subscriptions.push(this._statusesService.statuses$.subscribe(statuses => {
            this.statuses = statuses;
            this.selectedStatus = statuses && statuses[0];
        }));
        this._statusesService.get();
    }

    upload() {
        this.payload.status = this.payload.type === 'status' ? this.selectedStatus : null;

        this.uploading = true;
        this._dataService.post('v3/xlsx/accounting', this.payload)
            .map(response => response.json().data)
            .subscribe(data => {
                this.uploading = false;

                let iframe = document.createElement('iframe');
                iframe.src = this._dataService.getHost() + 'v3/download?key=' + this._dataService.key + '&token=' + this._dataService.token + '&type=accounting&file=' + data.name;
                iframe.style.display = 'none';
                this._element.nativeElement.appendChild(iframe);

                setTimeout(() => {
                    iframe.remove();
                }, 60000);

            }, () => this.uploading = false);
    }

    private _formatDate(input: Date) {
        let month: any = input.getMonth()+1;
        if (month < 10) {
            month = `0${month}`;
        }

        let date: any = input.getDate();
        if (date < 10) {
            date = `0${date}`;
        }

        return `${input.getFullYear()}-${month}-${date}`;
    }
}

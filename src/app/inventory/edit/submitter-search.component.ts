import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {DataService} from '../../core/data.service';
import {Debounce} from '../../core/debounce.service';
import {Localstorage} from '../../core';

@Component({
    selector: 'submitter-search',
    template: require('./submitter-search.component.html'),
    providers: [Debounce]
})
export class SubmitterSearchComponent implements OnInit {
    @Input('submitter') submitter;
    @Output('select') select = new EventEmitter();
    public query: string = '';
    public submitters: any[];
    public showList: boolean;
    public searching: boolean = false;
    public notFound: boolean = false;
    public name: string;
    public error: string[] = [];
    public errorClass: string = '';

    constructor(private _dataService: DataService, private _analytics: Angulartics2GoogleAnalytics, private debounce: Debounce, private _localStorage: Localstorage) {}

    _raw(text: string): string {
        let e = document.createElement('div');
        e.innerHTML = text;
        return e.childNodes[0].nodeValue;
    }

    search(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.debounce.do(() => {
            // We are now searching
            this.searching = true;
            // Send search request to API
            this._dataService.post('/v4/agent/search', {query: this.query})
            // Map data so we can work with it directly
            .map(res => res.json().data)
            // Request done
            .subscribe(data => {
                // Reset errors
                this.error = [];
                this.errorClass = '';
                // No longer searching
                this.searching = false;
                // Set submitter data
                this.submitters = data;
                // Got a list of submitters, atleast 1 submitter, and query is not empty
                if (data.length == 0 && this.query.length > 0 && this.query != '') {
                    this.notFound = true;
                    this.error.push('SUBMITTER_NOT_FOUND');
                    this.errorClass = 'alert-warning';
                } else {
                    this.notFound = false;
                }
            }, err => {
                console.error(err);
                this.error.push(err);
            });
        }, 250);
        return false;
    }

    selectSubmitter(submitter: any) {
        console.log(submitter);
        // Reset event
        this.select.next(null);
        // Set text to show
        this.query = this._raw(submitter.name + ' &lt;' + submitter.email + '&gt;');
        // Send submitter id to EventEmitter
        this.select.next(submitter.id);
        // Save data to Localstorage
        this._localStorage.set('inventory.submitter', JSON.stringify(submitter));
    }

    show() {
        // Show list immedietly
        this.showList = true;
    }

    hide() {
        // Hide after 200ms have passed
        this.debounce.do(() => this.showList = false, 200);
    }

    create() {
        // No error so far
        let error = false;
        // Reset class error
        this.error = [];
        this.errorClass = '';
        console.log(this.query);
        console.log(this.name);
        // Check valid email
        if (!(/.+@.+/.test(this.query))) {
            this.error.push('INVALID_SUBMITTER_EMAIL');
            this.errorClass = 'alert-warning';
            error = true;
        }
        // Check have a valid name, atleast one space
        if(!(/\S+ [\S\s]+/.test(this.name))) {
            this.error.push('INVALID_SUBMITTER_NAME');
            this.errorClass = 'alert-danger';
            error = true;
        }
        // We got an error
        if (error) {
            return;
        }
        // Create new submitter
        this._dataService.post('/v4/agent/submitters', {name: this.name, email: this.query})
        // Remap response data
        .map(res => res.json().data)
        // When request is done
        .subscribe(data => {
            // Reset event
            this.select.next(null);
            // Set data to show
            this.query = this._raw(this.name + ' &lt;' + this.query + '&gt;');
            // Send submitter id to EventEmitter
            this.select.next(data.id);
            // Submitter is found, kinda
            this.notFound = false;
            // Save data to Localstorage
            this._localStorage.set('inventory.submitter', JSON.stringify(data));
        }, err => {
            // Could not create submitter
            this.error.push(err);
            this.errorClass = 'alert-warning';
        });
    }

    ngOnInit() {
        // Have a submitter
        if (this.submitter !== null) {
            // Have a valid submitter id
            if (this.submitter.id > 0) {
                // Set initial submitter name
                if (this.submitter.name != '' && this.submitter.email != '') {
                    this.query = this._raw(this.submitter.name + ' &lt;' + this.submitter.email + '&gt;');
                }
            }
        }
        if (this.query == '' || this.query == null) {
            // Get submitter from localstorage
            let submitter = JSON.parse(this._localStorage.get('inventory.submitter'));
            // Got submitter
            if (submitter !== null && submitter.id > 0) {
                // have a name and email for submitter
                if (submitter.name != '' && submitter.email != '') {
                    // Set submitter
                    this.select.next(submitter.id);
                    // Set string to show
                    this.query = this._raw(submitter.name + ' &lt;' + submitter.email + '&gt;');
                    // Set product data
                    this.submitter = submitter;
                }
            }
        }
    }
}

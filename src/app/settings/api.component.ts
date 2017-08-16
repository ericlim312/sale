import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {TranslatePipe} from '../core';
import {AlertService} from '../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../core';
import {ApiService} from './api.service';

@Component({
    selector: 'api-overview',
    template: require('./api.component.html')
})
export class ApiComponent extends UnsubscriberComponent implements OnInit {
    public keys;

    constructor(
        private _alertService: AlertService,
        private _apiService: ApiService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._apiService.key$.subscribe(keys => {
            this.keys = keys;
        }));

        this._apiService.get()
    }

    onCreate() {
        this._apiService.create();
    }

    onDelete(key) {
        this._alertService.confirm(
            this._translate.translate('DELETE_API_KEY_TITLE'),
            this._translate.translate('DELETE_API_KEY_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._apiService.delete(key.id)
                    .catch(error => {
                        this._alertService.alert(
                            this._translate.translate('OOPS'),
                            'An unexpected error occurred',
                            this._translate.translate('BTN_CLOSE'),
                            this._modal,
                            this._viewContainer
                        );
                    });
            });
        });
    }
}

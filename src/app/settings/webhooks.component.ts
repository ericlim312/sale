import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {TranslatePipe} from '../core';
import {AlertService} from '../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../core';
import {WebhooksService} from './webhooks.service';

@Component({
    selector: 'webhooks',
    template: require('./webhooks.component.html')
})
export class WebhooksComponent extends UnsubscriberComponent implements OnInit {
    public webhooks;
    public createNew;

    public events;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _webhooksService: WebhooksService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._webhooksService.webhooks$.subscribe(webhooks => {
            this.webhooks = webhooks;
        }));
        this._webhooksService.get();

        this._webhooksService.getEvents().then(events => {
            this.events = events; 
        });

        this._initCreateNew();
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._webhooksService.create(data)
            .then(() => {
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    onDelete(id) {
        this._alertService.confirm(
            this._translate.translate('DELETE_WEBHOOK_TITLE'),
            this._translate.translate('DELETE_WEBHOOK_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._webhooksService.delete(id)
                    .catch(error => this._showUnexpectedError());
            }).catch(() => {});
        });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            webhook: 'orderNew',
            type: 'json'
        };
    }

    private _showUnexpectedError() {
        this._alertService.alert(
            this._translate.translate('OOPS'),
            'An unexpected error occurred',
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

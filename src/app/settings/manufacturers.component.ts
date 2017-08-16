import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {TranslatePipe} from '../core';
import {AlertService} from '../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../core';
import {ManufacturersService} from './manufacturers.service';

@Component({
    selector: 'settings-brands',
    template: require('./manufacturers.component.html')
})
export class ManufacturersComponent extends UnsubscriberComponent implements OnInit {
    public manufacturers;
    public createNew;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _manufacturersService: ManufacturersService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._manufacturersService.manufacturer$.subscribe(manufacturers => {
            this.manufacturers = manufacturers;
        }));

        this._manufacturersService.get();

        this._initCreateNew();
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._manufacturersService.create(data)
            .then(() => {
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    onDelete(manufacturer) {
        this._alertService.confirm(
            this._translate.translate('DELETE_MANUFACTURER_TITLE'),
            this._translate.translate('DELETE_MANUFACTURER_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._manufacturersService.delete(manufacturer.id)
                    .catch(error => this._showUnexpectedError());
            });
        });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            name: ''
        }
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

import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {TranslatePipe} from '../core';
import {AlertService} from '../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {ProductBrandService} from './product-brand.service';
import {UnsubscriberComponent} from '../core';

@Component({
    selector: 'settings-brands',
    template: require('./brands.component.html')
})
export class SettingsBrandsComponent extends UnsubscriberComponent implements OnInit {
    public brands;

    public createNew;

    constructor(
        private _alertService: AlertService,
        private _brandService: ProductBrandService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._brandService.brand$.subscribe(brands => {
            this.brands = brands;
        }));

        this._brandService.get()
        this._initCreateNew();
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            name: null
        }
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._brandService.create(data.name)
            .then(() => this._initCreateNew())
            .catch(error => this._showUnexpectedError(error));
    }

    onDelete(brand) {
        this._alertService.confirm(
            this._translate.translate('DELETE_BRAND_TITLE'),
            this._translate.translate('DELETE_BRAND_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._brandService.delete(brand.brand_id)
                    .catch(error => this._showUnexpectedError(error));
            });
        });
    }

    private _showUnexpectedError(error) {
        let message;

        if (error.message.indexOf('That brand already exist') !== -1) {
            message = this._translate.translate('BRAND_ALREADY_EXISTS_ERROR');
        } else {
            message = this._translate.translate('UNEXPECTED_ERROR');
        }

        this._alertService.alert(
            this._translate.translate('OOPS'),
            message,
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

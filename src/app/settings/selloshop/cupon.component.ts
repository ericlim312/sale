import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {SelloshopCouponService} from './coupon.service';

@Component({
    selector: 'cupons',
    template: require('./cupon.component.html')
})
export class SelloshopCuponsComponent extends UnsubscriberComponent implements OnInit {
    public coupons;
    public createNew;

    constructor(
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _selloshopCouponService: SelloshopCouponService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        this.subscriptions.push(this._selloshopCouponService.coupon$.subscribe(coupons => {
            this.coupons = coupons;
        }));

        this._selloshopCouponService.get(this.integrationId);

        this._initCreateNew();
    }

    addCoupon(data, valid) {
        if (!valid) {
            return;
        }

        this._selloshopCouponService.create(this.integrationId, data)
            .then(() => this._initCreateNew())
            .catch(error => this._showUnexpectedError());
    }

    onDelete(coupon) {
        this._alertService.confirm(
            this._translate.translate('DELETE_CUPON_TITLE'),
            this._translate.translate('DELETE_CUPON_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._selloshopCouponService.delete(this.integrationId, coupon.code)
                    .catch(error => this._showUnexpectedError());
            });
        });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            code: this._generateRandomCode(),
            value: '',
            type: 'static',
            min_order: '',
            max_uses: 'unlimited',
            num_uses: 0
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

    private _generateRandomCode() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10).toUpperCase();
    }
}

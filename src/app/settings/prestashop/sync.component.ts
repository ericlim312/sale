import {Component, ViewContainerRef} from '@angular/core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {DataService} from '../../core/data.service';
import {AlertService} from '../../core';

@Component({
    selector: 'prestashop-sync',
    template: require('./sync.component.html')
})
export class PrestashopSyncComponent {
    public loadingLanguages: boolean;
    public loadingTaxes: boolean;
    public loadingCountries: boolean;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _route: ActivatedRoute,
        private _dataService: DataService,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef

    ) {}

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    updateLanguages() {
        this.loadingLanguages = true;

        this._dataService.get(`v3/integration/prestashop/${this.integrationId}/language/update`).toPromise()
            .then(() => {
                this.loadingLanguages = false;
            })
            .catch(() => this._showError());
    }

    updateTaxes() {
        this.loadingTaxes = true;

        this._dataService.get(`v3/integration/prestashop/${this.integrationId}/tax/update`).toPromise()
            .then(() => {
                this.loadingTaxes = false;
            })
            .catch(() => this._showError());
    }

    updateCountries() {

        console.log('updateCountries')
        this.loadingCountries = true;

        this._dataService.get(`v3/integration/prestashop/${this.integrationId}/country/update`).toPromise()
            .then(() => {
                this.loadingCountries = false;
            })
            .catch(() => this._showError());
    }

    private _showError() {
        this._alertService.alert(
            this._translate.translate('OOPS'),
            'An unexpected error occurred',
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {TranslatePipe} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {PropertyService} from '../property.service';
import {CountryService} from '../../core';
import {AccountService} from '../../account/account.service';

@Component({
    selector: 'properties',
    template: require('./properties.component.html')
})
export class PropertyComponent extends UnsubscriberComponent implements OnInit {
    @Input('product') product;
    @Input('integrations') integrations;
    public properties = [];
    public selectedProperties = [];
    public countries = [];
    public account;

    constructor(
        private _accountService: AccountService,
        private _analytics: Angulartics2GoogleAnalytics,
        private _translate: TranslatePipe,
        private _propService: PropertyService,
        private _countries: CountryService
    ) {
        super();
    }

    selectProperty(selected) {
        // Find that property and add it to selected
        for (let n in this.properties) {
            // Remove the property from the select box
            if (this.properties[n].name === selected) {
                this.selectedProperties.push(this.properties[n]);
                this.properties.splice(parseInt(n), 1);
                return;
            }
        }

        console.warn("No property found to select: " + selected);
    }

    remove(property) {
        this.selectedProperties.splice(this.selectedProperties.indexOf(property), 1);
        this.updateProperty(property, '');

    }

    updateProperty(property, value) {
        // This happens for bulkedit
        if (!this.product.hasOwnProperty('properties')) {
            this.product.properties = {};
        }
        if (!this.product.properties.hasOwnProperty(property.type)) {
            this.product.properties[property.type] = {};
        }
        if (!this.product.properties[property.type].hasOwnProperty(property.name)) {
            this.product.properties[property.type][property.name] = {
                current: ''
            };
        }

        this.product.properties[property.type][property.name].current = value;
    }

    updateAddon(property, value) {
        this.product.properties[property.type][property.name].addon.current = value;
    }

    ngOnInit() {
        this.countries = this._countries.getAll();

        this.subscriptions.push(
            this._propService.property$.subscribe(properties => {
                this.selectedProperties = [];

                // Sort by name
                properties.sort(function(a, b) {
                    return a.name > b.name;
                });

                this.properties = properties;

                // Make a copy for us to loop (needed since we'll remove items from it)
                const props = this.properties.slice();

                // Add properties that has values
                for (let prop of props) {
                    if (prop.required === "1" || (prop.current !== null && prop.current !== '""')) {
                        this.selectProperty(prop.name);
                    }
                }
            }));
        this._propService.get(this.product.id, this.product.categories);

        this.subscriptions.push(
            this._accountService.account$.subscribe(account => this.account = account));
        this._accountService.getAccount();
    }
}

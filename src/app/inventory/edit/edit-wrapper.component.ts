import {Component, Input, Output, OnInit, EventEmitter, Renderer} from '@angular/core';
import {Observable} from 'rxjs';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {InventoryService} from '../inventory.service';
import {UnsubscriberComponent}  from '../../core';
import {TranslatePipe} from '../../core';
import {IntegrationService} from '../../integration/integration.service';
import {AccountService} from '../../account/account.service';
import {Localstorage} from '../../core';

@Component({
    selector: 'inventory-edit-wrapper',
    providers: [],
    template: require('./edit-wrapper.component.html')
})
export class InventoryEditWrapperComponent extends UnsubscriberComponent implements OnInit {
    @Input('productId') productId;
    @Input('dialogType') dialogType;
    @Input('restrictHeight') restrictHeight;
    @Output('saved') submitEvent = new EventEmitter();
    @Output('cancel') cancelEvent = new EventEmitter();
    public product;
    public originalProduct;
    public integrations;
    public dialogHeight;
    public account;
    public affixActive = false;
    public showInventory = 'block';
    public inventoryClass = 'fa-minus-circle';
    public languages;
    public activeSection = 'text';
    private _scroll$;
    private _scrollObservable;
    private _scrollSections;
    private _suppressScrollEvent;

    constructor(
        private _inventoryService: InventoryService,
        private _integrationService: IntegrationService,
        private _accountService: AccountService,
        private _translate: TranslatePipe,
        private renderer: Renderer,
        private _analytics: Angulartics2GoogleAnalytics,
        private _localstorage: Localstorage
    ) {
        super();

        let topOffset = 100;
        this._scroll$ = new Observable(o => {
            this._scrollObservable = o;
        });

        this.subscriptions.push(
            this._scroll$.subscribe(scroll => {
                // If we don't have fetched scroll sections, do so now
                if (!this._scrollSections) {
                    this._scrollSections = {
                        details: document.querySelector('.details-section'),
                        shipping: document.querySelector('.edit-section-shipping'),
                        price: document.querySelector('.edit-section-price'),
                        category: document.querySelector('.category-section'),
                        inventory: document.querySelector('.inventory-section'),
                        myitem: document.querySelector('.section-myitem'),
                        text: document.querySelector('.edit-section-text')
                    };
                }

                // Start with the section at bottom
                if(scroll.top > this._scrollSections.details.offsetTop) {
                    this.activeSection = 'details'
                } else if (scroll.top > this._scrollSections.shipping.offsetTop) {
                    this.activeSection = 'shipping'
                } else if (scroll.top > this._scrollSections.price.offsetTop) {
                    this.activeSection = 'price'
                } else if (scroll.top > this._scrollSections.category.offsetTop) {
                    this.activeSection = 'category'
                } else if (scroll.top > this._scrollSections.inventory.offsetTop) {
                    this.activeSection = 'inventory'
                } else if (scroll.top > this._scrollSections.myitem.offsetTop) {
                    this.activeSection = 'myitem'
                } else if (scroll.top > this._scrollSections.text.offsetTop) {
                    this.activeSection = 'text'
                }
            }));
    }

    onScrollMain(e) {
        if (this._suppressScrollEvent) {
            this._suppressScrollEvent = false;
            return;
        }
        const visibleZone = 400;
        this._scrollObservable.next({ top: e.target.scrollTop + visibleZone });
    }

    hideInventory() {
        if(this.showInventory == 'none') {
            this.inventoryClass = 'fa-minus-circle';
            this.showInventory = 'block';
            this._localstorage.set('inventory.showInventory', 'block');
        } else {
            this.inventoryClass = 'fa-plus-circle';
            this.showInventory = 'none';
            this._localstorage.set('inventory.showInventory', 'none');
        }
    }

    onLanguageChange(e) {
        // Skip it if it's an event
        if (!Array.isArray(e)) {
            console.log("not array");
            return;
        }

        // If bulkedit, add standard texts for each language
        if (this.dialogType === 'bulkedit') {
            if (!this.product.hasOwnProperty('texts')) {
                this.product.texts = {
                    99: {}
                };
            }

            for (let lang of e) {
                this.product.texts[99][lang.code] = {};
            }

            // Make a copy of 'product'
            // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
            this.originalProduct = JSON.parse(JSON.stringify(this.product));
        }

        this.languages = e;
    }

    onChangeCategory(category) {
        this.product.category = category;
    }

    onChangeSubmitter(submitter) {
        this.product.submitter_id = submitter;
    }

    onContentChanged(text, blah) {
    }

    setActiveSection(section) {
        this.activeSection = section;
    }

    scrollTo(targetId) {
        let target = document.getElementById(targetId);
        let listItem;

        // If we are in the edit modal or as a single page
        if (this.restrictHeight) {
            listItem = document.querySelector('.inventory-edit .main');
        } else {
            listItem = document.querySelector('body');
        }

        if (target === null) {
            console.warn('Cannot scroll, no such element: #' + targetId);
        } else {
            target.scrollIntoView();
        }

        this._suppressScrollEvent = true;
    }

    getChanges(prev, now) {
        var changes = {}, prop, pc;
        for (prop in now) {
            if (!prev || !prev.hasOwnProperty(prop) || prev[prop] !== now[prop]) {
                if (typeof now[prop] == "object") {
                    // Recursion alert!
                    let c = this.getChanges(prev.hasOwnProperty(prop) ? prev[prop] : false, now[prop]);

                    if(c) {
                        changes[prop] = c;
                    }
                } else {
                    changes[prop] = now[prop];
                }
            }
        }
        for (prop in changes) {
            return changes;
        }

        return false; // false when unchanged
    }

    convertTraderaShipping(product) {
        // Convert Tradera shipping data
        for (let integration in product.shipping) {
            // If it has "posten", then it's Tradera. Calculate primary and secondary
            if (product.shipping[integration].hasOwnProperty('posten')) {
                // Reset values
                product.shipping[integration].posten = null;
                product.shipping[integration].dhl = null;
                product.shipping[integration].schenker = null;
                product.shipping[integration].bussgods = null;
                product.shipping[integration].other = null;

                // Set primary and secondary value
                product.shipping[integration][product.shipping[integration].primary.type] = product.shipping[integration].primary.cost;

                if (product.shipping[integration].secondary.type !== '') {
                    product.shipping[integration][product.shipping[integration].secondary.type] = product.shipping[integration].secondary.cost;
                }
            }
        }
    }

    onSubmit() {
        // If bulk, calc the difference
        if (this.dialogType === 'bulkedit') {
            let diff = this.getChanges(this.originalProduct, this.product);
            this.convertTraderaShipping(diff);

            this._inventoryService.bulkeditProduct(this.productId, diff)
                .subscribe(result => {
                    this.submitEvent.next(this.product);
                    console.info('Products saved');
                });

            this.submitEvent.next(this.product);
        } else {
            this._inventoryService.editProduct(this.product.id, this.product)
                .subscribe(result => {
                    this.submitEvent.next(this.product);
                    console.info('Product saved');
                });

            this.submitEvent.next(this.product);
        }
    }

    onCancel() {
        this.cancelEvent.next(this.product);
    }

    ngOnInit() {
        // Show inventory data?
        let show = this.showInventory = this._localstorage.get('inventory.showInventory');
        // Show inventory
        if (show == 'none') {
            this.inventoryClass = 'fa-plus-circle';
        } else { // Hide inventory
            this.inventoryClass = 'fa-minus-circle';
        }

        if (this.restrictHeight) {
            this.dialogHeight = (window.innerHeight - 200) + 'px';
        } else {
            this.dialogHeight = 'auto';
        }

        if (this.dialogType === 'bulkedit') {
            // If bulkedit, we don't have a product object. Fake one to contain our changes
            this.product = {
                integrations: {},
                categories: {},
                texts: {
                    99: {}
                },
                prices: {}
            };

            // Make a copy of 'product'
            // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
            this.originalProduct = JSON.parse(JSON.stringify(this.product));
        } else {
            // Load product
            this.subscriptions.push(
                this._inventoryService.getProduct(this.productId).subscribe(product => {
                    this.product = product;

                    for (let integration in this.product.shipping) {
                        // If it has "pickup", then it's Tradera. Calculate primary and secondary
                        if (this.product.shipping[integration].hasOwnProperty('pickup')) {
                            let primary = null;
                            let secondary = null;

                            for (let key in this.product.shipping[integration]) {
                                if (this.product.shipping[integration][key] !== null && ['integration_id', 'product_id', 'pickup'].indexOf(key) === -1) {
                                    // If we don't have a primary value, use this
                                    if (primary === null) {
                                        primary = {
                                            type: key,
                                            cost: this.product.shipping[integration][key]
                                        };
                                    } else if (secondary === null) {
                                        secondary = {
                                            type: key,
                                            cost: this.product.shipping[integration][key]
                                        };
                                    }
                                }

                                this.product.shipping[integration].primary = primary === null ? {type: null, cost: null} : primary;
                                // Use '' as type to set it as "dont use"
                                this.product.shipping[integration].secondary = secondary === null ? {type: '', cost: null} : secondary;
                            }
                        }
                    }
                }));
        }

        // Load integrations
        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integration => {
                this.integrations = integration;

                // Add integrations to product if bulkedit (mock data)
                if (this.dialogType === 'bulkedit') {
                    for (let ig of this.integrations) {
                        this.product.integrations[ig.id] = ig;
                        this.product.categories[ig.id] = [{}];
                        this.product.prices[ig.id] = {};
                        this.product.texts[ig.id] = {};
                    }
                }
            }));
        this._integrationService.get();

        this.subscriptions.push(
            this._accountService.account$.subscribe(account => this.account = account));
        this._accountService.getAccount();
    }
}

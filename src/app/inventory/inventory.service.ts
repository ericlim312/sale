import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { Injectable }         from '@angular/core';
import { Response }           from '@angular/http';
import { Observable }         from 'rxjs/Observable';

import { DataService }        from '../core/data.service';
import { Localstorage }       from '../core';

import { IntegrationService } from '../integration/integration.service';

interface InventoryServiceState {
    dataStore;
    loading: boolean;
}

@Injectable()
export class InventoryService {
    public inventory$: Observable<any>;
    public loading$: Observable<any>;
    public empty$: Observable<any>;
    public currentFolder: number;
    private _state$: Observable<InventoryServiceState>;
    private _stateObserver;
    private _dataStore;
    private _integrations;
    private _integrationService;
    private _getInProgress = {};

    constructor(
        private _data: DataService,
        private _localstorage: Localstorage,
         _integrationService: IntegrationService
    ) {
        this._state$ = new Observable<InventoryServiceState>(observer => this._stateObserver = observer).share();
        this.inventory$ = this._state$.map(state => state.dataStore);
        this.loading$ = this._state$.map(state => state.loading);
        this.empty$ = this._state$.map(state =>
            this._isEmpty(
                state.dataStore.inventory,
                state.dataStore.currentFilters,
                state.dataStore.search));

        this._dataStore = {
          inventory: {},
          search: [],
          currentTotal: 0,
          currentLimit: 0,
          currentPage: 1,
          currentFolder: 0,
          currentFilters: [],
          currentSort: '',
          currentSortDir: '',
          currentSearch: ''
        };

        // We need to fetch integrations
        this._integrationService = _integrationService;
        this._integrationService.integration$.subscribe(integrations => this._integrations = integrations);
    }

    refresh() {
        this._stateObserver.next({ dataStore: this._dataStore, loading: false });
    }

    getLink(obj) {
        let page = obj.hasOwnProperty('page') ? obj.page : this._dataStore.currentPage;
        let folder = obj.hasOwnProperty('folder') ? obj.folder : this._dataStore.currentFolder;
        let sort = obj.hasOwnProperty('sort') ? obj.sort : this._dataStore.currentSort;
        let sortDir = obj.hasOwnProperty('sortDir') ? obj.sortDir : this._dataStore.currentSortDir;
        let search = obj.hasOwnProperty('search') ? obj.search : this._dataStore.currentSearch;

        let link = '/inventory/list?' +
            (page != '' ? 'page=' + page + '&' : '') +
            (folder != '' ? 'folder=' + folder + '&' : '') +
            (sort != '' ? 'sort=' + sort + '&' : '' ) +
            (sortDir != '' ? 'sortDir=' + sortDir + '&' : '') +
            (search != '' ? 'search=' + search : '');

        let filters = obj.filters || this._dataStore.currentFilters;
        if (filters && filters.length) {
            link += '&' + filters.join('&');
        }

        return link;
    };

    get storedParams() {
        return this._localstorage.get('inventory-params') || {};
    }

    set storedParams(value) {
        this._localstorage.set('inventory-params', value);
    }

    getInventory (folderId?, page?, sort?, sortDir?, search?, filters?) {
        let storedParams = this.storedParams;

        sort = sort || this._dataStore.currentSort || storedParams.sort;
        sortDir = sortDir || this._dataStore.currentSortDir || storedParams.sortDir;

        if (sort) {
            this._dataStore.currentSort = sort;
            storedParams.sort = sort;
        }

        if (sortDir) {
            this._dataStore.currentSortDir = sortDir;
            storedParams.sortDir = sortDir;
        }

        if (folderId !== null) {
            this.currentFolder = folderId;
            this._dataStore.currentFolder = folderId;
        } else {
            folderId = this._dataStore.currentFolder;
        }
        if (page === null) {
            page = this._dataStore.currentPage;
        } else {
            this._dataStore.currentPage = page;
        }
        if (search === null) {
            search = this._dataStore.currentSearch;
        } else {
            this._dataStore.currentSearch = search;
        }
        if (filters === null) {
            filters = this._dataStore.currentFilters;
        } else {
            this._dataStore.currentFilters = filters;
        }

        this.storedParams = storedParams;

        // If get() is already running by someone else, don't run it again
        // The exception for this is when we're doing a search, then we should always query api
        if (search != '' || !this._getInProgress.hasOwnProperty(folderId) || !this._getInProgress[folderId]) {
            // If we have a search, reset folderId
            if (search.length !== 0) {
                folderId = '';
            } else {
                this._getInProgress[folderId] = true;
            }

            let params = [];
            if (folderId !== '' && folderId !== undefined) {
                params.push("folder=" + folderId);
            }
            if (page !== '' && page !== undefined) {
                params.push("page=" + page);
            }
            if (sort !== '' && sort !== undefined) {
                params.push("sort=" + sort);
            }
            // Only send sortDir if it's desc. Asc is the default
            if (sortDir !== '' && sortDir !== undefined) {
                params.push("sortDir=" + sortDir);
            }
            if(search !== '' && search !== undefined) {
                params.push("search=" + search);
            }

            if (filters !== undefined) {
                for (let filter of filters) {
                    params.push(filter);
                }
            }

            setTimeout(() => {
                this._stateObserver.next({ dataStore: this._dataStore, loading: true });
            });

            return this._data.get('v4/inventory?' + params.join('&'))
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    if (search.length === 0) {
                        // Reset search
                        delete this._dataStore.search;
                        this._dataStore.inventory[folderId] = data;
                        this._dataStore.currentTotal = data.total;
                        this._dataStore.currentLimit = data.limit;
                        this._dataStore.currentPage = page;
                        this.refresh();
                        this._getInProgress[folderId] = false;
                    } else {
                        this._dataStore.search = data;
                        this._dataStore.currentTotal = data.total;
                        this._dataStore.currentLimit = data.limit;
                        this._dataStore.currentPage = page;
                        this.refresh();
                    }
                }, error => console.error('Unable to fetch inventory', error))
            ;
        }
    }

    setGroup (productId, groupId) {
        // ProductId is always a string
        productId = "" + productId;

        // Does a group with that id exist? If so, add product to that group
        let foundGroups = this._findGroupInInventory(groupId);
        let grpObj = {
            group_id: groupId,
            products: []
        };

        let matches = this._findProductInInventory(productId, true);
        for (let group of matches) {
            // If not false
            if (group) {
                for (let product of group.products) {
                    if (product.id === productId) {
                        // If not false
                        if (foundGroups[0]) {
                            for (let g of foundGroups) {
                                g.products.push(product);
                            }
                        } else {
                            grpObj.products.push(product);
                        }

                        // Remove product from old group
                        group.products.splice(group.products.indexOf(product), 1);
                    }
                }
            }
        }

        // Add a new group to inventory of we didn't find a group
        if (!foundGroups[0]) {
            this._insertGroupAfter(grpObj, productId, this.currentFolder);
        }

        // Broadcast new data
        this.refresh();
    }

    getProduct (id) {
        return this._data.get('v4/products/' + id)
            .map((res) => {
                let data = res.json().data;
                // Typecast to boolean
                data.automatic_price_adjust = data.automatic_price_adjust === '1' ? true : false;
                return data;
            });
    }

    getMultipleProducts (ids) {
        return this._data.get('v4/products?ids=' + ids.join(','))
            .map((res) => {
                let data = res.json().data;

                for (let pid in data) {
                    // Typecast to boolean
                    data[pid].automatic_price_adjust = data[pid].automatic_price_adjust === '1' ? true : false;
                }

                return data;
            });
    }

    addProduct (data) {
        return this._data.post('v4/products', data)
            .map((res) => {
                let response = res.json().data.data;
                this._addToInventoryData(response, undefined, data.folder);
                return response;
            });
    }

    addProductFromAdnic (data) {
        // Append current folder to the data
        data.folder = this._dataStore.currentFolder;
        return this._data.post('v4/products/adnic', data)
            .map((res) => {
                let response = res.json().data.products;
                for (let n in response) {
                    this._addToInventoryData(response[n], undefined, data.folder);
                }
            });
    }

    editProduct (productId, data) {
        data.id = productId;

        return this._data.put('v4/products/' + productId, data)
            .map((res) => {
                this._updateInventory(data);
                //let response = res.json().data.data;
                //this._addToInventoryData(response, undefined, data.folder);
                //return response;
            });
    }

    bulkeditProduct (productIds, data) {
        return this._data.post('v4/products/bulkedit', {
                products: productIds,
                data: data
            })
            .map((res) => {
                for (let id of productIds) {
                    data.id = id;
                    this._updateInventory(data);
                }
                //let response = res.json().data.data;
                //this._addToInventoryData(response, undefined, data.folder);
                //return response;
            });
    }

    deleteProducts(products) {
        // Remove the products from cache
        let folder = this._dataStore.inventory[this.currentFolder] || this._dataStore.search;

        for (let n in folder.data) {
            for (let p in folder.data[n].products) {
                let product = folder.data[n].products[p];

                // Should this product be removed?
                for (let i in products) {
                    if (products[i] === product.id) {
                        // It should be removed
                        folder.data[n].products.splice(p, 1);
                    }
                }
            }
        }

        // Now make the request (optimistic)
        return this._data.post('v3/products/delete', { products: products });
    }

    copyProducts(products, preserveGroup = false) {
        return this._data.post('v3/products/copy', { products: products, preserveGroup: preserveGroup })
            .map(res => {
                let data = res.json().data;

                // Loop ids, find the products in cache and copy the data
                for (let n in data.ids) {
                    let copyId = data.ids[n].copy;
                    let originalId = data.ids[n].original;
                    let groupId = data.ids[n].group_id;

                    // Find the original product in inventory
                    let original = this._findProductInInventory(originalId)[0];
                    original.checked = false;

                    // Make a clone of the object
                    let copy = Object.assign({}, this._findProductInInventory(originalId)[0]);
                    if (Object.keys(copy).length === 0) {
                        console.error('Unable to fetch original product ' + originalId + '. Unable to add to inventory list');
                    } else {
                        // Change the id to the new id
                        copy.id = copyId;
                        copy.group_id = groupId;

                        for (let i in this._integrations) {
                            let key = this._integrations[i].market_id + '_' + this._integrations[i].id + '_active';
                            if (copy.hasOwnProperty(key) && copy[key]) {
                                copy[key].active = 0;
                            } else {
                                copy[key] = {
                                    active: false
                                };
                            }
                        }

                        console.warn('TODO: when copying product, we need to remove image if the image wasn\'t copied');

                        this._addProductToGroup(copy, copy.group_id, this.currentFolder);
                    }
                }

                return data.ids;
            });
    }

    setState(productId, integration, active) {
        // Return a promise
        return new Promise((resolve, reject) => {
            let payload = {
                'integrations': {}
            };
            payload.integrations[integration] = {
                active: active
            };

            // If we want to deactivate, just do it!
            if (!active) {
                this.editProduct(productId, payload).subscribe(res => console.info('Product saved: ' + productId));
                resolve();
                return;
            };

            // Fetch the product
            this.getProduct(productId).subscribe(product => {
                // Change integration status
                product.integrations[integration].active = active;
                try {
                    this.validate(product, {type: 'activate', integration: integration});
                    // Validation passed. Now update the product!
                    // No need to wait for this to finish
                    this.editProduct(product.id, payload).subscribe(res => console.info('Product saved: ' + product.id));
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    validate(product, target) {
        let errors = [];

        // If we want to activate a product, look for stuff that is related to it
        if (target.type === 'activate') {
            let integration = this._integrationService.getIntegration(target.integration);
            let market = parseInt(integration.market_id);

            // Tax must not be 0 on CDON/Fyndiq
            if ((market === 6 || market === 10) && parseInt(product.tax) === 0) {
                errors.push('ERROR_INVALID_TAX_0');
            }

            // Must have at least one image
            if (product.images.length === 0) {
                errors.push('ERROR_NO_IMAGES');
            }

            // Name must not be empty
            for (let lang in product.texts[target.integation]) {
                if (product.texts[target.integration][lang].name === '') {
                    errors.push('ERROR_NO_NAME');
                }
                if (product.texts[target.integration][lang].description === '') {
                    errors.push('ERROR_NO_DESCRIPTION');
                }
            }

            // We must have a category
            if (market !== 6 && parseInt(integration.version) !== 1) {
                if (product.categories[target.integration][0].category_id == null || product.categories[target.integration][0].category_id < 1) {
                    errors.push('ERROR_NO_CATEGORY');
                }
            }

            // Tradera store price
            if (market === 1 && product.prices[target.integration].store < 1) {
                errors.push('ERROR_NO_TRADERA_STORE_PRICE');
            }

            // Fyndiq store price
            if (market === 6 && product.prices[target.integration].sv.store < 1) {
                errors.push('ERROR_NO_FYNDIQ_PRICE');
            }

            // CDON SE price
            if (market === 10 && product.prices[target.integration].SE.store < 1) {
                errors.push('ERROR_NO_CDON_PRICE');
            }

            // Amazon
            if (market === 13) {
                let country = {
                    'uk': 'England',
                    'de': 'Tyskland',
                    'fr': 'Frankrike',
                    'es': 'Spanien',
                    'it': 'Italien'
                };

                for (let lang in product.prices[target.integration]) {
                    if (product.prices[target.integration][lang].store === '' || product.prices[target.integration][lang].store <= 0) {
                        errors.push('ERROR_NO_AMAZON_PRICE_' + lang.toUpperCase());
                    }
                }

                // Manufacturer must be set
                if (product.manufacturer === '') {
                    errors.push('ERROR_NO_MANUFACTURER');
                }
                if (product.manufacturer_no === '') {
                    errors.push('ERROR_NO_MANUFACTURER_NO');
                }

                // Color property must be set
                let n, colorSet = false;
                for (n in product.properties.general) {
                    if (n.toLowerCase() === 'color' && product.properties.general[n] !== '') {
                        colorSet = true;
                    }
                }

                if (!colorSet) {
                    errors.push('ERROR_NO_COLOR_SET');
                }
            }
        }

        // If we have errors, throw them
        if (errors.length > 0) {
            throw {
                productName: product.texts[99].sv.name,
                productId: product.id,
                errors: errors
            };
        }
    }

    private _findProductInInventory(productId, returnFullGroup?) {
        // If no inventory is loaded, return
        if (!this._dataStore.inventory.hasOwnProperty(this._dataStore.currentFolder) && this._dataStore.search.length === 0) {
            console.log("No inventory loaded");
            return [false];
        }

        // ProductId is always a string
        productId = "" + productId;

        let inventory = [];
        let search = [];
        let found = [];

        // If we have folder data
        if (this._dataStore.inventory.hasOwnProperty(this._dataStore.currentFolder)) {
            inventory = this._dataStore.inventory[this._dataStore.currentFolder].data;
        }

        // If we have search data
        if (this._dataStore.search !== undefined && this._dataStore.search.hasOwnProperty('data')) {
            search = this._dataStore.search.data;
        }

        // Try to find in search cache
        for (let n in search) {
            for (let product of search[n].products) {
                if (product.id == productId) {
                    found.push(returnFullGroup ? search[n] : product);
                }
            }
        }

        for (let n in inventory) {
            for (let p in inventory[n].products) {
                let product = inventory[n].products[p];

                // If this is our product, return it!
                if (product.id == productId) {
                    found.push(returnFullGroup ? inventory[n] : product);
                }
            }
        }

        if (found.length === 0) {
            return [false];
        } else {
            return found;
        }
    }

    private _findGroupInInventory(groupId) {
        // If no inventory is loaded, return
        if (!this._dataStore.inventory.hasOwnProperty(this._dataStore.currentFolder) && this._dataStore.search.length === 0) {
            return [false];
        }

        let inventory = [];
        let search = [];
        let found = [];

        // If we have folder data
        if (this._dataStore.inventory.hasOwnProperty(this._dataStore.currentFolder)) {
            inventory = this._dataStore.inventory[this._dataStore.currentFolder].data;
        }

        // If we have search data
        if (this._dataStore.search !== undefined && this._dataStore.search.hasOwnProperty('data')) {
            search = this._dataStore.search.data;
        }

        // Try to find in search cache
        for (let n in search) {
            if (search[n].group_id === groupId) {
                found.push(search[n]);
            }
        }

        for (let n in inventory) {
            if (inventory[n].group_id === groupId) {
                found.push(inventory[n]);
            }
        }

        if (found.length === 0) {
            return [false];
        } else {
            return found;
        }
    }

    private _updateProperty(inventory, product, propName: string) {
        if (product.hasOwnProperty(propName)) {
            inventory[propName] = product[propName];
        }
    }

    private _updateInventory(product) {
        // If folder isn't our current folder and we aren't searching, just remove the product from data it will be fetched again once we browse the new folder
        if (product.folder_id && product.folder_id != this._dataStore.currentFolder && this._dataStore.currentSearch == '') {
            console.log("Folder has changed, moving product");

            // Remove the products from cache
            let folder = this._dataStore.inventory[this.currentFolder] || this._dataStore.search;

            for (let n in folder.data) {
                for (let p in folder.data[n].products) {
                    if (folder.data[n].products[p].id == product.id) {
                        folder.data[n].products.splice(p, 1);
                    }
                }
            }

            return;
        }

        // Find products in cache
        let inventoryProducts = this._findProductInInventory('' + product.id + ''); // Typecast to string

        // Update every found product
        for (let inventoryProduct of inventoryProducts) {
            // If we can't find product, nothing else to do
            if (!inventoryProduct) {
                console.warn('Could not find product ' + product.id + ' in cache, nothing to update', product);
                return;
            }

            // Set '__saved' flag to indicate that the product has been saved
            // Reset after 5 seconds
            inventoryProduct.__saved = true;
            setTimeout(() => {
                inventoryProduct.__saved = false;
            }, 5000);

            this._updateProperty(inventoryProduct, product, 'quantity');
            this._updateProperty(inventoryProduct, product, 'private_name');
            this._updateProperty(inventoryProduct, product, 'private_reference');
            this._updateProperty(inventoryProduct, product, 'stock_location');

            for (let n in this._integrations) {
                let mid = parseInt(this._integrations[n].market_id);
                let iid = parseInt(this._integrations[n].id);

                if (mid === 1) {
                    if (product.hasOwnProperty('prices')) {
                        inventoryProduct[mid + '_' + iid + '_store'] = product.prices[iid].store;
                        inventoryProduct[mid + '_' + iid + '_auction_start'] = product.prices[iid].auction.start;
                        inventoryProduct[mid + '_' + iid + '_buynow'] = product.prices[iid].auction.buynow;
                        inventoryProduct[mid + '_' + iid + '_reserve'] = product.prices[iid].auction.reserve;
                    }
                    if (product.hasOwnProperty('shipping')) {
                        inventoryProduct[mid + '_' + iid + '_shipping_posten'] = product.shipping[iid].posten;
                        inventoryProduct[mid + '_' + iid + '_shipping_dhl'] = product.shipping[iid].dhl;
                        inventoryProduct[mid + '_' + iid + '_shipping_schenker'] = product.shipping[iid].schenker;
                        inventoryProduct[mid + '_' + iid + '_shipping_other'] = product.shipping[iid].other;
                        inventoryProduct[mid + '_' + iid + '_shipping_bussgods'] = product.shipping[iid].bussgods;
                    }
                } else if (mid === 5 && product.hasOwnProperty('prices')) {
                    inventoryProduct[mid + '_' + iid + '_price'] = product.prices[iid].store;
                } else if ((mid === 6 || mid === 11) && product.hasOwnProperty('prices')) {
                    inventoryProduct[mid + '_' + iid + '_price'] = product.prices[iid].sv.store;
                } else if (mid === 10 && product.hasOwnProperty('prices')) {
                    // Flatten price from object to array
                    let keys = Object.keys(product.prices[iid]);
                    let d = [];
                    for (let key of keys) {
                        let price = product.prices[iid][key];
                        price.lang = key;

                        d.push(price);
                    }
                    inventoryProduct[mid + '_' + iid + '_price'] = d;
                } else if (mid === 13 && product.hasOwnProperty('prices')) {
                    // Flatten price from object to array
                    let keys = Object.keys(product.prices[iid]);
                    let d = [];
                    for (let key of keys) {
                        let price = product.prices[iid][key];
                        price.lang = key;

                        d.push(price);
                    }
                    inventoryProduct[mid + '_' + iid + '_price'] = d;
                }

                // texts.
                if (product.hasOwnProperty('texts')) {
                    for (let lang in product.texts[iid]) {
                        // If link, use standard text
                        if (product.texts[iid][lang].type === 'link') {
                            inventoryProduct[mid + '_' + iid + '_name'] = product.texts[99].sv.name;
                        } else {
                            inventoryProduct[mid + '_' + iid + '_name'] = product.texts[iid][lang].name;
                        }
                    }
                }
                if (product.hasOwnProperty('images')) {
                     // Show the cover image
                    for (let n in product.images) {
                        if (product.images[n].cover) {
                            inventoryProduct.image = product.images[n].url_small;
                        }
                    }
                }
            }
        }
    }

    // Add to inventory from full product data or inventoryRowData
    private _addToInventoryData(fullData, inventoryRowData, folderId) {
        let productData;

        if (inventoryRowData === undefined) {
             productData = {
                id: fullData.id,
                private_name: fullData.private_name,
                group_id: fullData.group_id
            };

            // Add 'active' and 'auctions' to inventory data
            for (let integrationId in fullData.integrations) {
                let key = fullData.integrations[integrationId].market_id + '_' + fullData.integrations[integrationId].id;
                // Product isn't active by default
                if (productData.hasOwnProperty(key)) {
                    productData[key + '_active'] = 0;
                    productData[key + '_auctions'] = { num: 0 };
                } else {
                    console.info("No such key: " + key);
                }
            }
        } else {
            productData = inventoryRowData;
        }

        // Uncheck the product
        productData.checked = false;

        // Add product to our list and broadcast it
        let folder = this._dataStore.inventory[folderId];
        if (folder) {
            folder.data.push({
                id: productData.group_id,
                products: [productData]
            });

            this.refresh();
        }
    }

    private _insertGroupAfter(newGroup, originalId, folderId) {
        let groups = this._dataStore.inventory[folderId].data;

        let original = groups.find(group => group.main_id == originalId);
        if (!original) {
            return;
        }

        let originalIndex = groups.indexOf(original);

        groups.splice(originalIndex, 0, newGroup);
    }

    private _addProductToGroup(product, groupId, folderId) {
        let groups = this._dataStore.inventory[folderId].data;
        let group = groups.find(group => group.group_id == groupId);
        if (group && group.products) {
            group.products.push(product);
        }
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    private _isEmpty(inventory, filters, search) {
        if (filters && filters.length) {
            return false;
        }

        if (search && search.data && search.data.length) {
            return false;
        }

        if (!inventory) {
            return true;
        }

        let folderIds = Object.keys(inventory);
        if (!folderIds.length) {
            return true;
        }

        let notEmptyFolders = folderIds.filter(id => inventory[id].data && inventory[id].data.length);
        return notEmptyFolders.length === 0;
    }
}

import 'rxjs/add/operator/share';
import {Injectable}  from '@angular/core';
import {Observable}  from 'rxjs/Observable';
import {DataService} from '../core/data.service';

@Injectable()
export class PropertyService {
    public property$;
    private _propertyObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.property$ = new Observable(observer => this._propertyObserver = observer).share();
        this._dataStore = [];
    }

    get (productId, categories) {
        // Make categories a nice array
        let cats = {};
        for (let ig in categories) {
            if(categories[ig][0].category_id !== null) {
                cats[ig] = categories[ig][0].category_id;
            }
        }

        return this._data.post('v4/products/' + (productId !== undefined ? productId + '/' : '') + 'properties', {
                categories: cats
            })
            .map(res => res.json().data)
            .subscribe(data => {
                // Set the new data and broadcast it to all listeners
                this._dataStore = data;
                this._propertyObserver.next(this._dataStore);
            }, error => console.error('Unable to fetch properties', error))
        ;
    }
}

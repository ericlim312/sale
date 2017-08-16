import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import {Injectable}  from '@angular/core';
import {Observable}  from 'rxjs/Observable';
import {DataService} from '../../core/data.service';

@Injectable()
export class CategoryService {
    public category$;
    private _categoryObserver;
    private _dataStore;

    constructor(
        private _data: DataService
    ) {
        this.category$ = new Observable(observer => this._categoryObserver = observer).share();
        this._dataStore = {
        };
    }

    get () {
        return this._data.get('v4/feed/categories')
            .map(res => res.json().data.categories)
            .subscribe(data => {
                this._dataStore = data;
                this._categoryObserver.next(this._dataStore);

                console.log(this._dataStore);
            }, error => {
                console.error('Error when fetching categories:', error);
            })
        ;
    }

    save (category) {
        this._data.put(`v4/feed/categories/${category.name}`, category)
            .subscribe(data => {
            }, error => {
                console.error('Error when fetching categories:', error);
            });
    }
}

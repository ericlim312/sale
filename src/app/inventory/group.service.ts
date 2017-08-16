import 'rxjs/add/operator/map';

import { Injectable }   from '@angular/core';
import { DataService }  from '../core/data.service';

@Injectable()
export class GroupService {
    constructor(
        private _data: DataService
    ) {}

    addGroup(data) {
        return this._data.post('v4/products/group', data)
            .map(res => res.json().data)
        ;
    }

    editGroup(id, data) {
        return this._data.put('v4/products/group/' + id, data);
    }
}

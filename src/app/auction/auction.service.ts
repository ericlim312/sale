import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { DataService } from '../core/data.service';

@Injectable()
export class AuctionService {
    constructor(private _data: DataService) {
    }

    cancel (productId, auctionId) {
        return this._data.delete('products/' + productId + '/auctions/' + auctionId);
    }
}

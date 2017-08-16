import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class ProductStatsWindowData extends BSModalContext {
    constructor(public productId: any) {
        super();
    }
}

import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class ProductEditWindowData extends BSModalContext {
    constructor(public productId: any, public modalType: string) {
        super();
    }
}

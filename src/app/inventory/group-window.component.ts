import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class GroupProductWindowData extends BSModalContext {
    constructor(public products, public type, public id?) {
        super();
    }
}

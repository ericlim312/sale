import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class ConfirmWindowData extends BSModalContext {
    constructor(public title: string, public body: string, public okText: string, public cancelText: string) {
        super();
    }
}

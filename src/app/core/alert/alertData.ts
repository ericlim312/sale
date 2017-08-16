import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class AlertWindowData extends BSModalContext {
    constructor(public title: string, public body: string, public okText: string) {
        super();
    }
}

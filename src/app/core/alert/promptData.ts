import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class PromptWindowData extends BSModalContext {
    constructor(public title: string, public body: string, public okText: string, public cancelText: string, public defaultValue: string) {
        super();
    }
}

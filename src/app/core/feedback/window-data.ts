import {BSModalContext} from 'angular2-modal/plugins/bootstrap';

export class WindowData extends BSModalContext {
    constructor(public featureName: string, public featureCode: string, public version:number) {
        super();
    }
}

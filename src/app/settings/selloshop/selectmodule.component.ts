import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { SelloshopModulesService } from './modules.service';
import { UnsubscriberComponent } from '../../core'; 

export class SelectModuleWindowData extends BSModalContext {
    constructor(public block: any) {
        super();
    }
}

@Component({
    selector: 'modal-content',
    template: require('./selectmodule.component.html')
})
export class SelectModuleWindow extends UnsubscriberComponent implements ModalComponent<SelectModuleWindowData>, OnInit {
    public context: SelectModuleWindowData;

    public block;
    public isMoving = false;
    public folder = 0; 

    public availableModules;

    constructor(
        private _route: ActivatedRoute,
        public dialog: DialogRef<SelectModuleWindowData>,
        private _modulesService: SelloshopModulesService
    ) {
        super();

        this.context = dialog.context;
        this.context.size = 'lg';
        this.block = this.context.block;
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        this.subscriptions.push(this._modulesService.available$.subscribe(availableModules => {
            this.availableModules = availableModules;
        }));

        this._modulesService.get(this.integrationId);
    }

    beforeDismiss() {
        return false;
    }

    beforeClose() {
        return false;
    }

    onCancel() {
        this.dialog.close();
    }

    selectModule(module) {
        let newModule = Object.assign({}, module);
        this.dialog.close(newModule);
    }
}

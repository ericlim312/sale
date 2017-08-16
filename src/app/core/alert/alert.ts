import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';

import { AlertWindowData } from './alertData';

@Component({
    selector: 'modal-content',
    template: `
    <div class="modal-header">
        <h3 class="modal-title">{{context.title}}</h3>
    </div>
    <div class="modal-body">
        <p [innerHTML]="context.body"></p>
    </div>
    <div class="modal-footer">
        <button class="cancel-button" type="button" (click)="cancel()">{{context.okText}}</button>
    </div>
    `
})
export class AlertWindow implements ModalComponent<AlertWindowData> {
    context: AlertWindowData;
    public value;

    constructor(public dialog: DialogRef<AlertWindowData>) {
        this.context = dialog.context;
        this.context.size = 'sm';
    }

    beforeDismiss(): boolean {
        return false;
    }

    beforeClose(): boolean {
        return false;
    }

    ok() {
        // Only return value if not empty
        if (this.value.length > 0) {
            this.dialog.close(this.value);
        } else {
            this.dialog.close(false);
        }
    }

    cancel() {
        this.dialog.close(false);
    }
}

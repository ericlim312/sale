import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';

import { ConfirmWindowData } from './confirmData';

@Component({
    selector: 'modal-content',
    template: `
    <div class="modal-header">
        <h3 class="modal-title">{{context.title}}</h3>
    </div>
    <div class="modal-body">
        <p>{{ context.body }}</p>
    </div>
    <div class="modal-footer">
        <button class="cancel-button" type="button" (click)="cancel()">{{context.cancelText}}</button>
        <button class="action-button" type="button" (click)="ok()">{{context.okText}}</button>
    </div>
    `
})
export class ConfirmWindow implements ModalComponent<ConfirmWindowData> {
    context: ConfirmWindowData;
    public value;

    constructor(public dialog: DialogRef<ConfirmWindowData>) {
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
        if (this.value && this.value.length > 0) {
            this.dialog.close(this.value);
        } else {
            this.dialog.close(true);
        }
    }

    cancel() {
        this.dialog.close(false);
    }
}

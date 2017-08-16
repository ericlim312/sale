import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';

import { PromptWindowData } from './promptData';

@Component({
    selector: 'modal-content',
    template: `
    <div class="modal-header">
        <h3 class="modal-title">{{context.title}}</h3>
    </div>
    <div class="modal-body">
        <p>{{ context.body }}</p>
        <input #input core-autofocus="true" type="text" class="form-control" required [(ngModel)]="value">
    </div>
    <div class="modal-footer">
        <button class="cancel-button" type="button" (click)="cancel()">{{context.cancelText}}</button>
        <button class="action-button" type="button" (click)="ok()">{{context.okText}}</button>
    </div>
    `
})
export class PromptWindow implements ModalComponent<PromptWindowData> {
    context: PromptWindowData;
    public value;

    constructor(public dialog: DialogRef<PromptWindowData>) {
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

    ngOnInit() {
        // This will typecast to string
        this.value = '' + this.context.defaultValue + '';
    }
}

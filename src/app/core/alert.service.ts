import { Injectable, ViewContainerRef } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { AlertWindow } from './alert/alert';
import { ConfirmWindow } from './alert/confirm';
import { PromptWindow } from './alert/prompt';
import { PromptWindowData } from './alert/promptData';
import { ConfirmWindowData } from './alert/confirmData';
import { AlertWindowData } from './alert/alertData';

@Injectable()
export class AlertService {
    alert(heading: string, body: string, buttonName: string, modal:Modal, viewContainer:ViewContainerRef) {
        modal.defaultViewContainer = viewContainer;

        return modal.open(
            AlertWindow,
            new AlertWindowData(
                heading,
                body,
                buttonName
            )
        );
    }

    confirm(heading: string, body: string, buttonOkName: string, buttonCancelName: string, modal:Modal, viewContainer:ViewContainerRef) {
        modal.defaultViewContainer = viewContainer;

        return modal.open(
            ConfirmWindow,
            new ConfirmWindowData(
                heading,
                body,
                buttonOkName,
                buttonCancelName
            )
        );
    }

    prompt(heading: string, body: string, buttonOkName: string, buttonCancelName: string, defaultValue: string, modal:Modal, viewContainer:ViewContainerRef) {
        modal.defaultViewContainer = viewContainer;
        return modal.open(
            PromptWindow,
            new PromptWindowData(
                heading,
                body,
                buttonOkName,
                buttonCancelName,
                defaultValue
            )
        );
    }
}

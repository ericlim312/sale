import {Component, Input, ViewContainerRef} from '@angular/core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {WindowData} from './window-data.ts';
import {Window} from './window.ts';

@Component({
    selector: 'feedback',
    styles: [`
        .feedback-button {
            cursor: pointer;
            overflow: hidden;
            border: 1px solid #d2d3d6;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        .feedback-button p {
            padding: 10px 0;
            margin: 0;
            font-size: 14px;
        }

        .body-column {
            background: white;
            white-space: nowrap;
            overflow: hidden;
        }

        .button-column {
            background: #4d4d4d;
            color: white;
            text-align: center;
        }
    `],
    template: require('./feedback.component.html')
})
export class FeedbackComponent {
    @Input('section') section;
    @Input('sectionName') sectionName;
    @Input('version') version;

    constructor(
        public modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {
        this.modal.defaultViewContainer = _viewContainer;
    }

    showFeedback() {
        this.modal.open(Window, new WindowData(this.sectionName, this.section, this.version))
    }
}

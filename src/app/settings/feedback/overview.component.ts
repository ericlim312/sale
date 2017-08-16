import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {FeedbackService} from '../feedback.service';

@Component({
    selector: 'feedback-overview',
    template: require('./overview.component.html')
})
export class FeedbackOverviewComponent extends UnsubscriberComponent implements OnInit {
    public items;

    public createNew;
    public editing;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _feedbackService: FeedbackService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._feedbackService.feedback$.subscribe(items => {
                this.items = items;
            }));
        this._feedbackService.getAll();

        this._initCreateNew();
    }

    isPositive(item) {
        return !!JSON.parse(item.positive);
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._feedbackService.create(data)
            .then(() => {
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    onEdit(data, valid) {
        if (!valid) {
            return;
        }

        this._feedbackService.set(this.editing.id, data)
            .then(() => {
                this.editing = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    onDelete(id) {
        this._alertService.confirm(
            this._translate.translate('DELETE_FEEDBACK_TITLE'),
            this._translate.translate('DELETE_FEEDBACK_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._feedbackService.delete(id)
                    .catch(error => this._showUnexpectedError());
            });
        });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            positive: 1
        }
    }

    private _showUnexpectedError() {
        this._alertService.alert(
            this._translate.translate('OOPS'),
            'An unexpected error occurred',
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {MailTemplateService} from '../mail-template.service';
import {StatusesService} from '../statuses.service';
import {FeedbackService} from '../feedback.service';

@Component({
    selector: 'mail-overview',
    template: require('./overview.component.html')
})
export class MailOverviewComponent extends UnsubscriberComponent implements OnInit {
    public templates;
    public statuses;
    public statusesById;
    public feedbacks;

    public createNew;
    public editing;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _mailTemplateService: MailTemplateService,
        private _statusesService: StatusesService,
        private _feedbackService: FeedbackService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._mailTemplateService.template$.subscribe(templates => {
            this.templates = templates;
        }));

        this._mailTemplateService.getAll()

        this.subscriptions.push(
            this._statusesService.statuses$.subscribe(statuses => {
                this.statuses = statuses;

                this.statusesById = {};
                statuses.forEach(s => {
                    this.statusesById[s.id] = s.title;
                });
            }));
        this._statusesService.get();

        this.subscriptions.push(
            this._feedbackService.feedback$.subscribe(feedbacks => {
                this.feedbacks = feedbacks;
            }));
        this._feedbackService.getAll();

        this._initCreateNew();
    }

    onDelete(template) {
        this._alertService.confirm(
            this._translate.translate('DELETE_MAILTEMPLATE_TITLE'),
            this._translate.translate('DELETE_MAILTEMPLATE_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

               this._mailTemplateService.delete(template.id)
                    .catch(error => this._showUnexpectedError());
            });
        });
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._mailTemplateService.create(data)
            .then(() => {
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    edit(template) {
        this._mailTemplateService.get(template.id)
            .then(data => {
                this.editing = data;
                this.editing.attachment = data.attachment || '';
            })
            .catch(error => this._showUnexpectedError());
    }

    isEditing(template) {
        return this.editing && this.editing.id === template.id
    }

    submitEdit(data, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.editing, data);

        this._mailTemplateService.set(this.editing.id, this.editing)
            .then(() => {
                this.editing = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            title: ''
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

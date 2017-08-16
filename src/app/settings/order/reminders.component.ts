import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {TranslatePipe} from '../../core/i18n/translate';
import {AlertService} from '../../core/alert.service';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {MailTemplateService} from '../mail-template.service';
import {StatusesService} from '../statuses.service';
import {RemindersService} from '../reminders.service';

@Component({
    selector: 'reminders',
    template: require('./reminders.component.html')
})
export class OrderRemindersComponent extends UnsubscriberComponent implements OnInit {
    public items;
    public createNew;
    public editing;

    public templates;
    public statuses;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _mailTemplateService: MailTemplateService,
        private _statusesService: StatusesService,
        private _remindersService: RemindersService
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._remindersService.reminder$.subscribe(reminders => {
            this.items = reminders;
        }));
        this._remindersService.get();

        this.subscriptions.push(this._mailTemplateService.template$.subscribe(templates => {
            this.templates = templates;
            this.createNew.settings.mail = this.templates.length > 0 && this.templates[0].id;
        }));
        this._mailTemplateService.getAll();

        this.subscriptions.push(this._statusesService.statuses$.subscribe(statuses => {
            this.statuses = statuses;
            this.createNew.settings.new_status = this.statuses.length > 0 && this.statuses[0].id;
        }));
        this._statusesService.get();

        this._initCreateNew();
    }

    isStatusChecked(item, id) {
        return !!item.settings.status.find(s => s === id);
    }

    setStatusChecked(item, id, checked) {
        if (checked) {
            item.settings.status = item.settings.status.filter(s => s !== id).concat(id);
        } else {
            item.settings.status = item.settings.status.filter(s => s !== id);
        }
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._setItemFields(this.createNew, data);

        this._remindersService.create(this.createNew)
            .then(newItem => this._remindersService.set(newItem.id, this.createNew))
            .then(() => {
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    onEdit(data, valid) {
        if (!valid) {
            return;
        }

        this._setItemFields(this.editing, data);

        this._remindersService.set(this.editing.id, this.editing)
            .then(() => {
                this.editing = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    onDelete(id) {
        this._alertService.confirm(
            this._translate.translate('DELETE_REMINDER_TITLE'),
            this._translate.translate('DELETE_REMINDER_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }
                
                this._remindersService.delete(id)
                    .catch(error => this._showUnexpectedError());
            });
        });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            settings: {
                type: 'orderlist',
                status: []
            }
        };
    }

    private _setItemFields(item, data) {
        item.name = data.name;
        item.days = data.days;

        item.settings.type = data.settings_type;
        item.settings.mail = data.settings_type === 'sendmail' ? data.settings_mail : null;
        item.settings.new_status = data.settings_type === 'changestatus' ? data.settings_new_status : null;
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

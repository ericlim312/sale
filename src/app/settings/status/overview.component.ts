import {Component, ViewContainerRef, OnInit, ChangeDetectorRef} from '@angular/core';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {StatusesService} from './../services';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';

@Component({
    selector: 'status-overview',
    template: require('./overview.component.html')
})
export class StatusOverviewComponent extends UnsubscriberComponent implements OnInit {
    public statuses;
    public createNew;
    public editing;

    constructor(
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _statusesService: StatusesService,
        private _changeDetector: ChangeDetectorRef
    ) {
        super();
    }

    getType(item) {
        if (item.is_active == 0 && item.is_paid == 0 && item.is_delivered == 0) {
            return 'deleted';
        }

        if (item.is_delivered == 1 && item.is_paid == 1) {
            return 'delivered-paid';
        }

        if (item.is_delivered == 1) {
            return 'delivered';
        }

        if (item.is_active == 1 && item.is_paid == 1) {
            return 'active-paid';
        }

        if (item.is_active == 1) {
            return 'active';
        }
    }

    ngOnInit() {
        this.subscriptions.push(
            this._statusesService.statuses$.subscribe(response => {
                this.statuses = response.data;
            }));

        this._refresh();
        this._initCreateNew();
    }

    onCreateNew(item, valid) {
        if (!valid) {
            return;
        }

        item.color = this.createNew.color;
        this._setFlags(item);

        this._statusesService.create(item)
            .then(() => {
                this._initCreateNew();
                this._refresh();
            })
            .catch(error => this._showUnexpectedError());
    }

    setColor(item, value) {
        setTimeout(() => {
            item.color = value;
            this._changeDetector.detectChanges();
        });
    }

    onEdit(item, valid) {
        if (!valid) {
            return;
        }

        item.color = this.editing.color;
        this._setFlags(item);

        this._statusesService.update(this.editing.id, item)
            .then(() => {
                this.editing = null;
                this._refresh();
            })
            .catch(error => this._showUnexpectedError());
    }

    onDelete(status) {
        this._alertService.confirm(
            this._translate.translate('DELETE_STATUS_TITLE'),
            this._translate.translate('DELETE_STATUS_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._deleteStatus(status);
            }).catch(() => {});
        });
    }

    private _refresh() {
        this._statusesService.getAll();
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            title: '',
            is_active: 1,
            is_paid: 0,
            is_delivered: 0,
            color: '#b2ffac'
        }
    }

    private _setFlags(item) {
        // Reset
        item.is_active = 0;
        item.is_paid = 0;
        item.is_delivered = 0;

        // Set
        if (item.type == 'active') {
            item.is_active = 1;
        } else if (item.type == 'active-paid') {
            item.is_active = 1;
            item.is_paid = 1;
        } else if (item.type == 'delivered') {
            item.is_delivered = 1;
        } else if (item.type == 'delivered-paid') {
            item.is_delivered = 1;
            item.is_paid = 1;
        } else if (item.type == 'deleted') {
            item.is_active = 0;
            item.is_paid = 0;
            item.is_delivered = 0;
        }
    }

    private _deleteStatus(status) {
        this._statusesService.delete(status.id)
            .then(() => {
                this.statuses = this.statuses.filter(s => s.id !== status.id);
            })
            .catch(error => {
                let msg = '';
                if (error.message == 'Order status is in use.') {
                    msg = this._translate.translate('DELETE_STATUS_IN_USE');
                } else {
                    msg = this._translate.translate('UNEXPECTED_ERROR');
                }

                this._showUnexpectedError(msg);
            });
    }

    private _showUnexpectedError(msg = '') {
        if (msg == '') {
            msg = this._translate.translate('UNEXPECTED_ERROR');
        }

        this._alertService.alert(
            this._translate.translate('OOPS'),
            msg,
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

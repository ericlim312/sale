import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {AccountService} from '../../account/account.service';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'users-overview',
    template: require('./overview.component.html')
})
export class UsersOverviewComponent extends UnsubscriberComponent implements OnInit {
    public users;
    public invites;
    public createNew;
    public editing;

    constructor(
        private _accountService: AccountService,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this._accountService.user$.filter(x => !!x).subscribe(users => {
            this.users = users.users;
            this.invites = users.invites;
        }));

        this._accountService.getUsers();

        this._initCreateNew();
    }

    onInvite(data, valid) {
        if (!valid) {
            return;
        }

        this._accountService.inviteUser(data)
            .then(() => this._initCreateNew())
            .catch(error => this._showError('User already exists'));
    }

    onEdit(data, valid) {
        if (!valid) {
            return;
        }

        this._accountService.editUser(this.editing.id, data)
            .then(() => { this.editing = null; })
            .catch(error => this._showError());
    }

    onDelete(user) {
        this._alertService.confirm(
            this._translate.translate('DELETE_USER_TITLE'),
            this._translate.translate('DELETE_USER_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._accountService.deleteUser(user)
                    .catch(error => this._showError());
            });
        });
    }

    onUninvite(user) {
        this._alertService.confirm(
            this._translate.translate('UNINVITE_USER_TITLE'),
            this._translate.translate('UNINVITE_USER_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._accountService.deleteUserInvite(user)
                    .catch(error => this._showError());
            });
        });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false,
            role: 'admin'
        }
    }

    private _showError(msg = 'An unexpected error occurred') {
        this._alertService.alert(
            this._translate.translate('OOPS'),
            msg,
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }
}

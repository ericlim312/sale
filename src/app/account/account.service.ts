import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/share';
import * as Rx from 'rxjs';

import { Account } from './account';
import { DataService } from '../core/data.service';

@Injectable()
export class AccountService {
    public account$: Rx.Observable<any>;
    public user$: Rx.Observable<any>;
    private _accountObserver;
    private _dataStore;
    private _getInProgress = false;
    private _hasAccount = false;
    private language;

    constructor(private _data: DataService) {
        this.account$ = new Observable(observer => this._accountObserver = observer).share();
        this.user$ = this.account$.map(account => account.users);
        this._dataStore = {
        };

        // Fetch language from cookie (if available)
        let cookie = document.cookie.match(/ui\.language=([a-z]{2})/);
        if (cookie) {
            this.language = cookie[1];
        } else {
            this.language = 'sv';
        }
    }

    setLanguage(lang) {
        this._data.put('v3/user/language/', { 'langCode': lang })
            .subscribe(data => {
                this.language = lang;
                this._dataStore.lang_code = lang;
            }, error => {
                console.error('Unable to change language, redirecting to Sello.io', error);
                window.location.href = 'https://sello.io';
            });
    }

    getAvailableLanguages(): Promise<any[]> {
        return new Promise(resolve => {
            this._data.get('v3/language')
                .map(response => response.json().data)
                .subscribe(data => resolve(data));
        });
    }

    getLanguage() {
        return this.language;
    }

    logout() {
        this._data.post('v3/account/logout', {}).subscribe(() => {
            if (this._dataStore.account_type == 'whitelabel') {
                document.location.href = 'https://webapi.tradera.com/auth/member/login?ClientId=Sello';
            } else {
                document.location.href = 'https://sello.io';
            }
        });
    }

    getAccount () {
        if (this._hasAccount) {
            this._accountObserver.next(this._dataStore);
            return;
        }

        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress) {
            this._getInProgress = true;

            return this._data.get('v3/account')
                .map(res => <Account> res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore = data;
                    this._accountObserver.next(this._dataStore);
                    this._getInProgress = false;
                    this._hasAccount = true;
                }, error => {
                    console.error('Unable to fetch account, redirecting to Sello.io', error);
                    window.location.href = 'https://sello.io';
                })
            ;
        }
    }

    getUsers() { 
        return this._data.get('v3/account/user').toPromise()
            .then(response => {
                this._dataStore.users = response.json().data;
                this._accountObserver.next(this._dataStore);
                
                return this._dataStore.users;
            })
            .catch(error => { throw error.json(); });
    }

    inviteUser(user) {
        return this._data.post('v3/account/user', user).toPromise()
            .then(response => {
                this._dataStore.users.invites = this._dataStore.users.invites.concat(user);
                this._accountObserver.next(this._dataStore);
            })
            .catch(error => { throw error.json(); });
    }


    editUser(id, user) {
        return this._data.put(`v3/account/user/${id}`, user).toPromise()
            .then(response => {
                let existing = this._dataStore.users.users.find(u => u.id === id);
                Object.assign(existing, user);

                this._accountObserver.next(this._dataStore);
            })
            .catch(error => { throw error.json(); });
    }

    deleteUser(user) {
        return this._data.post('v3/account/user/remove', user).toPromise()
            .then(response => {
                this._dataStore.users.users = this._dataStore.users.users.filter(u => u.id !== user.id);
                this._accountObserver.next(this._dataStore);
            })
            .catch(error => { throw error.json(); });
    }

    deleteUserInvite(user) {
        return this._data.post('v3/account/user/remove', user).toPromise()
            .then(response => {
                this._dataStore.users.invites = this._dataStore.users.invites.filter(u => u.email !== user.email);
                this._accountObserver.next(this._dataStore);
            })
            .catch(error => { throw error.json(); });
    }
}

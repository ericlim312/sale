import 'rxjs/add/operator/map';

import {Injectable}       from '@angular/core';
import {Observable}       from 'rxjs/Observable';

import {DataService}      from '../core/data.service';
import {Localstorage}     from '../core';
import {TranslatePipe}    from '../core';

@Injectable()
export class FolderService {
    public folder$: Observable<any>;
    public currentFolder$;
    private _folderObserver;
    private _currentFolderObserver;
    private _dataStore;
    private _getInProgress = {};

    constructor(
        private _data: DataService,
        private _localstorage: Localstorage,
        private _translate: TranslatePipe
    ) {
        this.folder$ = new Observable(observer => this._folderObserver = observer).share();
        this.currentFolder$ = new Observable(observer => this._currentFolderObserver = observer).share();
        this._dataStore = {
            'folders': [],
            'all': [],
            'current': {},
            'num': {}
        };
    }

    delete (folder) {
        console.log(folder.parent_id);
        console.log(this._dataStore.folders[folder.parent_id]);
        console.log(this._dataStore.folders);
        // Remove the folder from cache
        if (this._dataStore.folders.hasOwnProperty(folder.parent_id)) {
            this._dataStore.folders[folder.parent_id].splice(this._dataStore.folders[folder.parent_id].indexOf(folder), 1);
        }

        this._data.delete('v4/inventory/folders/' + folder.id).subscribe(res => console.info('Folder ' + folder.id + ' deleted.'));
    }

    put (folder) {
        // Remove the folder from cache
        this._data.put('v4/inventory/folders/' + folder.id, folder).subscribe(res => console.info('Folder ' + folder.id + ' updated.'));
    }

    post (parent, name) {
        return this._data.post('v4/inventory/folders/', {
            title: name,
            parent: parent
        })
        .map(res => {
            let data = res.json().data;
            if (!this._dataStore.folders.hasOwnProperty(parent)) {
                this._dataStore.folders[parent] = [];
            }

            this._dataStore.folders[parent].push(data);
            return data;
        });
    }

    getAll() {
        return this._data.get('v4/inventory/folders/all')
            .map(res => res.json().data)
            .subscribe(data => {
                // Set the new data and broadcast it to all listeners
                this._dataStore.all = data;
                this._folderObserver.next(this._dataStore);
            }, error => console.error('Unable to fetch all folders', error))
        ;
    }

    getNum() {
        return this._data.get('v3/products/folder/num')
            .map(res => res.json().data)
            .subscribe(data => {
                this._dataStore.num = data;
                this._folderObserver.next(this._dataStore);
                this._localstorage.set('folderNum', data);
            }, error => console.error('Unable to fetch folder num', error))
        ;
    }

    setCurrent(id:number) {
        // If it's the main folder, return static data
        if (id < 1) {
            this._dataStore.current = {
                id: 0,
                parent: 0,
                title: this._translate.translate('MAIN_FOLDER')
            };
            this._folderObserver.next(this._dataStore);
            return;
        };

        // No need to fetch data again if folder hasn't changed
        if (id == this._dataStore.current.id) {
            this._folderObserver.next(this._dataStore);
            return;
        }

        return this._data.get('v3/products/folders/' + id)
            .map(res => res.json().data)
            .subscribe(data => {
                // Set the new data and broadcast it to all listeners
                this._dataStore.current = data;
                this._folderObserver.next(this._dataStore);
            }, error => console.error('Unable to fetch single folder', error))
        ;
    }

    getSingle(id:number) {
        return this._data.get('v4/inventory/folders/' + id + '?sing=le')
            .map(res => res.json().data)
        ;
    }

    get (parentId) {
        this._dataStore.folders[parentId] = [];

        // If get() is already running by someone else, don't run it again
        if (!this._getInProgress.hasOwnProperty(parentId) || !this._getInProgress[parentId]) {
            this._getInProgress[parentId] = true;

            return this._data.get('v4/inventory/folders?parentId=' + parentId)
                .map(res => res.json().data)
                .subscribe(data => {
                    // Set the new data and broadcast it to all listeners
                    this._dataStore.folders[parentId] = data;
                    this._folderObserver.next(this._dataStore);
                    this._getInProgress[parentId] = false;
                }, error => console.error('Unable to fetch folders', error))
            ;
        }
    }
}

import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {SelloshopFilesService} from './files.service';
import {SelloshopCategoriesService} from './categories.service';

@Component({
    selector: 'selloshop-categories',
    template: require('./categories.component.html')
})
export class SelloshopCategoriesComponent extends UnsubscriberComponent implements OnInit {
    public tree;
    public files;

    public createNew;
    public editing;

    constructor(
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _filesService: SelloshopFilesService,
        private _categoriesService: SelloshopCategoriesService
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        this.subscriptions.push(this._categoriesService.setting$.subscribe(tree => {
            this.tree = tree;
        }));
        this._categoriesService.get(this.integrationId);

        this._initCreateNew();

        this.subscriptions.push(this._filesService.file$.subscribe(files => {
            this.files = files;
        }));
        this._filesService.get(this.integrationId);
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        let newCategory = Object.assign({
            parent: 0,
            subcategories: []
        }, data);

        this._categoriesService.post(this.integrationId, newCategory).toPromise()
            .then(data => {
                data.link = newCategory.link;
                data.description = newCategory.description;
                data.image = newCategory.image;

                Object.assign(newCategory, data);

                return this._categoriesService.put(this.integrationId, data.id, data).toPromise();
            })
            .then(() => {
                this.tree.push(newCategory);
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    onChildEdit(data, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.editing, data);

        this._categoriesService.put(this.integrationId, this.editing.id, this.editing).toPromise()
            .then(() => {
                this.editing = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    onChildDeleted(child) {
        let index = this.tree.indexOf(child);
        this.tree.splice(index, 1);
        this.save();
    }

    save() {
        console.log("!!! save", this.tree);
    }

    private _getTree(list) {
        let root = { children: [] };
        this._populateChildren(list, root.children, 0)
        return root.children;
    }

    private _populateChildren(list, children, current_id) {
        list.filter(item => item.parents[0] == current_id)
            .forEach(current => {
                let child = { category: current, children: [] };
                this._populateChildren(list, child.children, current.id)
                children.push(child);
            });
    }

    private _initCreateNew() {
        this.createNew = {
            visible: false
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

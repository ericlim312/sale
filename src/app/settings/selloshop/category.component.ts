import {Component, EventEmitter, Input, Output, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {SelloshopFilesService} from './files.service';
import {SelloshopCategoriesService} from './categories.service';

@Component({
    selector: 'selloshop-category',
    template: require('./category.component.html')
})
export class SelloshopCategoryComponent extends UnsubscriberComponent {
    @Input() public node;
    @Output() onSave = new EventEmitter();
    @Output() onDelete = new EventEmitter();
    @Output() onEdit = new EventEmitter();

    public files;

    public expanded;
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
            parent: this.node.id,
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
                this.node.subcategories.push(newCategory);
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
        let index = this.node.subcategories.indexOf(child);
        this.node.subcategories.splice(index, 1);
        this.onSave.emit();
    }

    onSelfDelete(id) {
        this._alertService.confirm(
            this._translate.translate('DELETE_CATEGORY_TITLE'),
            this._translate.translate('DELETE_CATEGORY_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._categoriesService.delete(this.integrationId, this.node.id).toPromise()
                    .then(() => this.onDelete.emit(this.node))
                    .catch(error => this._showUnexpectedError());
            });
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

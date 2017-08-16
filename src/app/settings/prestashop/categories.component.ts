import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {IntegrationSettingsService} from './../integration-settings.service';
import {LanguageService} from './../language.service';

@Component({
    selector: 'prestashop-categories',
    template: require('./categories.component.html')
})
export class PrestashopCategoriesComponent extends UnsubscriberComponent implements OnInit {
    public tree;
    private expanded = {};
    public languages;

    public createNew;

    constructor(
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _integrationSettingService: IntegrationSettingsService,
        private _languageService: LanguageService
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        this.subscriptions.push(this._integrationSettingService.setting$.subscribe(list => {
            this.tree = this._getTree(list);
        }));
        this.getCategories();

        this._initCreateNew();

        this.subscriptions.push(this._languageService.language$.subscribe(languages => {
            this.languages = languages;
        }));
        this._languageService.get();
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        let newCategory = {};
        this.languages.forEach(lang => newCategory[lang.code] = data[`${lang.code}_name`]);

        this._integrationSettingService.post(`prestashop/${this.integrationId}/category/0`, newCategory).toPromise()
            .then(() => {
                this._initCreateNew();
                this.getCategories();
            })
            .catch(error => this._showUnexpectedError());
    }

    getCategories() {
        this._integrationSettingService.get(`prestashop/${this.integrationId}/category/update`)
            .then(() => {
                this._integrationSettingService.get(`prestashop/${this.integrationId}/category`);
            });
    }

    onChildEdit(data, valid) {
        if (!valid) {
            return;
        }

        let updatedCategory = {};
        this.languages.forEach(lang => updatedCategory[lang.code] = data[`${lang.code}_name`]);

        this._integrationSettingService.put(`prestashop/${this.integrationId}/category/0`, updatedCategory).toPromise()
            .then(() => {
                this.getCategories();
            })
            .catch(error => this._showUnexpectedError());
    }

    onChildDeleted(child) {
        let index = this.tree.indexOf(child);
        this.tree.splice(index, 1);
    }

    private _getTree(list) {
        let root = { currentItem: null, children: [] };
        this._populateChildren(list, root.children, 0)
        return root.children;
    }

    private _populateChildren(list, children, current_id) {
        list.filter(item => item.parent_id == current_id)
            .forEach(current => {
                let existingChild = children.find(c => c.id == current.category_id);
                let child = existingChild || { id: current.category_id, items_by_iso: {}, children: [] };

                child.items_by_iso[current.iso_code] = current;

                this._populateChildren(list, child.children, current.category_id)

                if (!existingChild) {
                    children.push(child);
                }
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

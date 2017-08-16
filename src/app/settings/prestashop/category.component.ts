import {Component, EventEmitter, Input, Output, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {UnsubscriberComponent} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {IntegrationSettingsService} from './../integration-settings.service';
import {LanguageService} from './../language.service';

@Component({
    selector: 'prestashop-category',
    template: require('./category.component.html')
})
export class PrestashopCategoryComponent extends UnsubscriberComponent {
    @Input() public node;
    @Input() expanded;
    @Output() onSave = new EventEmitter();
    @Output() onDelete = new EventEmitter();
    @Output() onEdit = new EventEmitter();

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

        this._integrationSettingService.post(`prestashop/${this.integrationId}/category/${this.node.id}`, newCategory).toPromise()
            .then(() => {
                this.onSave.emit(this.node.id);
            })
            .catch(error => this._showUnexpectedError());
    }

    onChildEdit(data, valid) {
        if (!valid) {
            return;
        }

        let updatedCategory = {};
        this.languages.forEach(lang => updatedCategory[lang.code] = data[`${lang.code}_name`]);

        this._integrationSettingService.put(`prestashop/${this.integrationId}/category/${this.node.id}`, updatedCategory).toPromise()
            .then(() => {
                this.onSave.emit(this.node.id);
            })
            .catch(error => this._showUnexpectedError());
    }

    onChildDeleted(child) {
        let index = this.node.children.indexOf(child);
        this.node.children.splice(index, 1);
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

                this._integrationSettingService.delete(`prestashop/${this.integrationId}/category/${this.node.id}`).toPromise()
                    .then(() => this.onDelete.emit(this.node))
                    .catch(error => this._showUnexpectedError());

            }).catch(() => {});
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

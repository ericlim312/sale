import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {ProductTemplateService} from '../product-template.service';

@Component({
    selector: 'templates-overview',
    template: require('./overview.component.html')
})
export class TemplatesOverviewComponent extends UnsubscriberComponent implements OnInit {
    public templates;

    public createNew;
    public editing;

    constructor(
        private _alertService: AlertService,
        private _productTemplateService: ProductTemplateService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef
    ) {
        super();
    }

     ngOnInit() {
        this.subscriptions.push(this._productTemplateService.template$.subscribe(templates => {
            this.templates = templates;
        }));

        this._productTemplateService.get();

        this._initCreateNew();
    }

    onCreateNew(data, valid) {
        if (!valid) {
            return;
        }

        this._productTemplateService.create(data)
            .then(() => {
                this._initCreateNew();
            })
            .catch(error => this._showUnexpectedError());
    }

    onEdit(data, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.editing, data);

        this._productTemplateService.set(this.editing.id, this.editing)
            .then(() => {
                this.editing = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    onDelete(template) {
        this._alertService.confirm(
            this._translate.translate('DELETE_TEMPLATE_TITLE'),
            this._translate.translate('DELETE_TEMPLATE_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this._productTemplateService.delete(template.id)
                    .catch(error => this._showUnexpectedError());
            });
        });
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

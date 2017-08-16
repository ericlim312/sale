import {ActivatedRoute} from '@angular/router';
import {Component, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {TranslatePipe} from '../../core';
import {AlertService} from '../../core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {UnsubscriberComponent} from '../../core';
import {MarketV3Service} from './../services';

@Component({
    selector: 'selloshop-content',
    providers: [
        MarketV3Service
    ],
    template: require('./content.component.html')
})
export class SelloshopContentComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    public pages;
    public createPage;
    public editingPage;

    public boxes;
    public createBox;
    public editingBox;

    constructor(
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _settingService: MarketV3Service
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        this.subscriptions.push(this._settingService.setting$.subscribe(content => {
            this.pages = this._getPages(content);
            this.boxes = this._getBoxes(content);
        }));

        this._settingService.get(`selloshop/${this.integrationId}/content`);

        this._initCreatePage();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        
        this._settingService.reset();
    }

    onCreatePage(data, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.createPage.content, data);

        this.pages = this.pages.concat(this.createPage);

        this._saveContent()
            .then(() => {
                this._initCreatePage();
            })
            .catch(error => this._showUnexpectedError());
    }

    onEditPage(data, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.editingPage.content, data);

        this._saveContent()
            .then(() => {
                this.editingPage = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    onDeletePage(id) {
        this._alertService.confirm(
            this._translate.translate('DELETE_PAGE_TITLE'),
            this._translate.translate('DELETE_PAGE_TEXT'),
            this._translate.translate('BTN_CONFIRM_DELETE'),
            this._translate.translate('BTN_CANCEL'),
            this._modal,
            this._viewContainer
        ).then((resultPromise) => {
            resultPromise.result.then((result) => {
                if (!result) {
                    return;
                }

                this.pages = this.pages.filter(c => c.id !== id);

                this._saveContent()
                    .catch(error => this._showUnexpectedError());
            }).catch(() => {});
        });
    }

    onEditBox(data, valid) {
        if (!valid) {
            return;
        }

        Object.assign(this.editingBox.content, data);

        this._saveContent()
            .then(() => {
                this.editingBox = null;
            })
            .catch(error => this._showUnexpectedError());
    }

    private _initCreatePage() {
        this.createPage = {
            visible: false,
            id: 'new' + Math.random(),
            content: { 
                name: '',
                type: 'page',
                mode: 'edit',
                menuName: '',
                showContact: '',
            }
        };
    }

    private _saveContent() {
        let content = this._getContent(this.pages.concat(this.boxes));
        return this._settingService.put(`selloshop/${this.integrationId}/content`, content).toPromise();
    }

    private _getPages(content) {
        return Object.keys(content).filter(key => content[key].type === 'page')
            .map(key => { return { id: key, content: content[key] }; });
    }

    private _getBoxes(content) {
        return Object.keys(content).filter(key => content[key].type === 'box')
            .map(key => { return { id: key, content: content[key] }; });
    }

    private _getContent(items) {
        let content = {};

        items.forEach(item => {
            content[item.id] = item.content;
        });

        return content;
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

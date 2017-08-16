import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectModuleWindow, SelectModuleWindowData } from './selectmodule.component';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { SelloshopThemeService } from './theme.service';
import { SelloshopModulesService } from './modules.service';
import { MarketV3Service } from './../market-v3.service';
import { UnsubscriberComponent } from '../../core'; 
import { AlertService } from '../../core';
import { TranslatePipe } from '../../core';

@Component({
    selector: 'selloshop-modules',
    template: require('./modules.component.html')
})
export class SelloshopModulesComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    public blocks;
    public enabledModules;

    public expanded = {};

    public editingBlock;
    public editing;

    public widths = [
        {value: 0, name: '0 - Gömd'},
        {value: 2, name: '2 - Minst'},
        {value: 3, name: '3 - Mindre'},
        {value: 4, name: '4 - Liten'},
        {value: 6, name: '6 - Mellan'},
        {value: 8, name: '8 - Stor'},
        {value: 9, name: '9 - Större'},
        {value: 10, name: '10 - Störst'},
        {value: 12, name: '12 - Full bredd'}
    ];
    
    constructor(
        private _route: ActivatedRoute,        
        private _alertService: AlertService,
        private _translate: TranslatePipe,
        private _modal: Modal,
        private _viewContainer: ViewContainerRef,
        private _themeService: SelloshopThemeService,
        private _modulesService: SelloshopModulesService,
        private _settingService: MarketV3Service
    ) { 
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    get showAdditionalSettings() {
        return !!this.editing.settings && !!this.editing.template;
    }
    
    ngOnInit() {
        let activeThemeBlocks$ = this._getActiveTheme(this.integrationId).map(theme => this._getBlocks(theme && theme.pos));
        this.subscriptions.push(activeThemeBlocks$.subscribe(blocks => {
            this.blocks = blocks;
        }));
        this._themeService.get(this.integrationId);
        this._settingService.get(`selloshop/${this.integrationId}/settings`);


        this.subscriptions.push(this._modulesService.enabled$.subscribe(enabledModules => {
            this.enabledModules = enabledModules;
        }));
        this._modulesService.get(this.integrationId);
    }

    getWidthByValue(value) {
        return this.widths.find(w => w.value == value) || this.widths[0];
    }

    onAddModule(block) {
        this._modal.defaultViewContainer = this._viewContainer;
        this._modal.open(SelectModuleWindow, new SelectModuleWindowData(block)).then(instance => {
            instance.result.then(newModule => {
                if (newModule) {
                    this._modulesService.create(this.integrationId, block, newModule)
                        .then(() => {
                            this.expanded[block] = true;
                        })
                        .catch(error => {
                            this._showError();
                        });
                }
            });
        });
    }

    onOpenEdit(block, module) {
        this.editingBlock = block;
        this.editing = this._deepClone(module);

        if (typeof this.editing.width !== 'object') {
            this.editing.width = {};
        }
    }

    onEdit(valid, block) {
        if (!valid) {
            return;
        }

        console.log('!!! edit', this.editing)

        this._modulesService.update(this.integrationId, block, this.editing)
            .then(() => {
                this.editing = null;
            })
            .catch(error => this._showError());
    }
    
    onDelete(block, module) {
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

                this._modulesService.delete(this.integrationId, block, module)
                    .catch(error => this._showError());
            });
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        
        this._settingService.reset();
    }

    private _getBlocks(posObj) {
        if (!posObj) {
            return [];
        }
        return Object.keys(posObj).map(key => Object.assign(posObj[key], {id: key}));
    }

    private _getActiveTheme(integrationId) {
        let activeTheme$ = 
            this._settingService.setting$.combineLatest(this._themeService.theme$).map(([settings, themes]) => {
                let activeTheme = themes.find(theme => theme.theme === settings.template);
                return activeTheme;
            });
        
        return activeTheme$;
    }

    private _showError() {
        this._alertService.alert(
            this._translate.translate('OOPS'),
            'An unexpected error occurred',
            this._translate.translate('BTN_CLOSE'),
            this._modal,
            this._viewContainer
        );
    }

    private _deepClone(obj) {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}

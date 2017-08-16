import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

/*
* Third party modules
*/
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { UiSwitchModule } from 'angular2-ui-switch';

/*
* Other project modules
*/
import { CoreModule } from '../core';
import { CategoryModule } from '../category';

/*
* Module routes
*/
import { InventoryRoutes } from './inventory.routes';

/*
* Module components
*/
import { InventoryEditComponent } from './edit/edit.component';
import { InventoryEditWrapperComponent } from './edit/edit-wrapper.component';
import { InventoryStatsComponent } from './stats/stats.component';
import { InventoryComponent } from './inventory.component';
import { InventoryListComponent } from './list.component';
import { FolderSelectComponent } from './folder-select.component';
import { InventoryStatsWrapperComponent } from './stats/stats-wrapper.component';
import { ProductEditWindow } from './edit/modal.component';
import { SectionCategoryComponent } from './edit/section-category.component';
import { CategoryComponent } from './category.component';
import { InventoryEditWhereToSellComponent } from './edit/where-to-sell.component';
import { InventoryEditButtonsComponent } from './edit/buttons.component';
import { ImageWidgetComponent } from './edit/image.component';
import { SubmitterSearchComponent } from './edit/submitter-search.component';
import { SectionTextComponent } from './edit/section-text.component';
import { SectionInventoryComponent } from './edit/section-inventory.component';
import { SectionDetailsComponent } from './edit/section-details.component';
import { SectionMyitemComponent } from './edit/section-myitem.component';
import { SectionShippingComponent } from './edit/section-shipping.component';
import { SectionPriceComponent } from './edit/section-price.component';
import { LanguagesComponent } from './edit/languages.component';
import { BrandSelectComponent } from './brand-select.component';
import { ManufacturerSelectComponent } from './manufacturer-select.component';
import { PropertyComponent } from './edit/properties.component';
import { TemplateSelectComponent } from './template-select.component';
import { PaginatorComponent } from './paginator.component';
import { FilterComponent } from './filter.component';
import { InventoryToolbarComponent } from './list/toolbar.component';
import { InventoryMetaComponent } from './meta.component';
import { InventoryFolderTreeComponent} from './folder-tree.component';
import { InventoryColumnSelectorComponent } from './column-selector.component';
import { InventoryEmptyComponent } from './empty.component'; 
import { InventoryListGroupComponent } from './list/group.component';
import { InventoryListProductComponent } from './list/product.component';
import { ProductEditButton } from './list/edit-button.component';
import { ProductActivateButton } from './list/activate.component';
import { ProductQuantityComponent } from './list/quantity.component';
import { TextComponent } from './list/text.component';
import { AuctionsComponent } from './list/auctions.component';

/*
* Modals
*/
import { InventoryModals } from './modals'

/*
* Module services
*/
import { InventoryService } from './inventory.service';
import { ColumnsService } from './columns.service';
import { GroupService } from './group.service';
import { FolderService } from './folder.service';
import { TemplateService } from './template.service';
import { BrandService } from './brand.service';
import { ManufacturerService } from './manufacturer.service';
import { OutboxService } from './outbox.service';
import { EditModalService } from './edit/modal.service';
import { StatsModalService } from './stats/modal.service';
import { GroupModalService } from './group-modal.service';
import { QuickeditService } from './quickedit.service';
import { PropertyService } from './property.service';

export const InventoryComponents = [
    InventoryEditComponent,
    InventoryEditWrapperComponent,
    InventoryStatsComponent,
    InventoryComponent,
    InventoryListComponent,
    FolderSelectComponent,
    InventoryStatsWrapperComponent,
    ProductEditWindow,
    SectionCategoryComponent,
    CategoryComponent,
    InventoryEditWhereToSellComponent,
    InventoryEditButtonsComponent,
    ImageWidgetComponent,
    SubmitterSearchComponent,
    SectionTextComponent,
    SectionInventoryComponent,
    SectionDetailsComponent,
    SectionMyitemComponent,
    SectionShippingComponent,
    SectionPriceComponent,
    LanguagesComponent,
    BrandSelectComponent,
    PropertyComponent,
    ManufacturerSelectComponent,
    TemplateSelectComponent,
    InventoryToolbarComponent,
    InventoryMetaComponent,
    InventoryFolderTreeComponent,
    FilterComponent,
    PaginatorComponent,
    InventoryColumnSelectorComponent,
    InventoryEmptyComponent,
    InventoryListGroupComponent,
    InventoryListProductComponent,
    ProductEditButton, 
    ProductActivateButton, 
    ProductQuantityComponent, 
    TextComponent, 
    AuctionsComponent,
];

export const InventoryServices = [
    InventoryService,
    ColumnsService,
    GroupService,
    FolderService,
    TemplateService,
    BrandService,
    ManufacturerService,
    OutboxService,
    EditModalService,
    StatsModalService,
    GroupModalService,
    QuickeditService,
    PropertyService
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(InventoryRoutes),
        HttpModule,

        ModalModule,
        BootstrapModalModule,
        Ng2BootstrapModule,
        UiSwitchModule,

        CoreModule,
        CategoryModule
    ],
    declarations: [
        ...InventoryComponents,
        ...InventoryModals
    ],
    providers: [
        ...InventoryServices
    ],
    entryComponents: [
        ...InventoryModals
    ],
})
export class InventoryModule {}

export { InventoryService } from './inventory.service';

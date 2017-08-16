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
import { SettingsRoutes } from './settings.routes';

/*
* Module components
*/
import { SettingsComponent } from './settings.component';
import { AgentSettingsComponent } from './agent/settings.component';
import { AgentSubmittersComponent } from './agent/submitters.component';
import { PersonalComponent } from './personal.component';
import { FeedSettingsComponent } from './feed/settings.component';
import { FeedLogComponent } from './feed/log.component';
import { MailOverviewComponent } from './mail/overview.component';
import { EconomySettingsComponent } from './economy/settings.component';
import { ReceiptSettingsComponent } from './economy/receipt.component';
import { FeedbackOverviewComponent } from './feedback/overview.component';
import { StatusOverviewComponent } from './status/overview.component';
import { FeedCategoriesComponent } from './feed/categories.component';
import { SettingsAdvancedComponent } from './advanced.component';
import { SettingsLogisticsComponent } from './logistics.component';
import { TemplatesOverviewComponent } from './templates/overview.component';
import { TemplateEditComponent } from './templates/edit.component';
import { ManufacturersComponent } from './manufacturers.component';
import { WebhooksComponent } from './webhooks.component';
import { UsersOverviewComponent } from './users/overview.component';
import { SettingsBrandsComponent } from './brands.component';
import { ProductSettingsComponent } from './products.component';
import { TraderaCheckoutComponent } from './tradera/checkout.component';
import { TraderaTermsComponent } from './tradera/terms.component';
import { TraderaStoreComponent } from './tradera/store.component';
import { TraderaShippingComponent } from './tradera/shipping.component';
import { ApiComponent } from './api.component';
import { WoocommerceSettingsComponent } from './woocommerce.component';
import { AmazonSettingsComponent } from './amazon.component';
import { CdonSettingsComponent } from './cdon.component';
import { PrestashopSyncComponent } from './prestashop/sync.component';
import { PrestashopCategoriesComponent } from './prestashop/categories.component';
import { PrestashopCategoryComponent } from './prestashop/category.component';
import { PrestashopOrderComponent } from './prestashop/order.component';
import { FyndiqSettingsComponent } from './fyndiq.component';
import { SelloshopGeneralComponent } from './selloshop/general.component';
import { SelloshopOrderComponent } from './selloshop/order.component';
import { SelloshopPaymentComponent } from './selloshop/payment.component';
import { SelloshopCategoriesComponent } from './selloshop/categories.component';
import { SelloshopCategoryComponent } from './selloshop/category.component';
import { SelloshopCuponsComponent } from './selloshop/cupon.component';
import { SelloshopThemeComponent } from './selloshop/theme.component';
import { SelloshopFilesComponent } from './selloshop/files.component';
import { SelloshopModulesComponent } from './selloshop/modules.component';
import { SelloshopFacebookModuleComponent } from './selloshop/modules/facebook.component';
import { SelloshopTextModuleComponent } from './selloshop/modules/text.component';
import { SelloshopSliderModuleComponent } from './selloshop/modules/slider.component';
import { SelloshopImageModuleComponent } from './selloshop/modules/image.component';
import { SelloshopGridModuleComponent } from './selloshop/modules/grid.component';
import { SelloshopContentComponent } from './selloshop/content.component';
import { SelloshopContentEditComponent } from './selloshop/content-edit.component';
import { CategorySettingRowComponent } from './feed/category-setting-row.component';
import { SettingRowComponent } from './setting-row.component';
import { SettingRowSelectComponent } from './setting-row-select.component';
import { SettingRowWysiwygComponent } from './setting-row-wysiwyg.component';
import { MenuComponent } from './menu.component';
import { OrderSettingsComponent } from './order/settings.component';
import { OrderRemindersComponent } from './order/reminders.component';

/*
* Modals
*/
import { SettingsModals } from './modals'

/*
* Module services
*/
import { AdvancedSettingsService } from './advanced-settings.service';
import { IntegrationSettingsService } from './integration-settings.service';
import { StatusesService } from './statuses.service';
import { SettingsService } from './settings.service';
import { ApiService } from './api.service';
import { ProductBrandService } from './product-brand.service';

import { SettingsV3Service } from './settings-v3.service';
import { CategoryService } from './feed/categories.service';
import { LogService } from './feed/log.service';
import { FeedbackService } from './feedback.service';
import { MailTemplateService } from './mail-template.service';
import { LanguageService } from './language.service';
import { ManufacturersService } from './manufacturers.service';
import { MarketV3Service } from './market-v3.service';
import { SelloshopFilesService } from './selloshop/files.service';
import { SelloshopCouponService } from './selloshop/coupon.service';
import { SelloshopThemeService } from './selloshop/theme.service';
import { SelloshopCategoriesService } from './selloshop/categories.service';
import { SelloshopModulesService } from './selloshop/modules.service';
import { ProductTemplateService } from './product-template.service';
import { WebhooksService } from './webhooks.service';
import { RemindersService } from './reminders.service';

export const SettingsComponents = [
    SettingsComponent,
    PersonalComponent,
    AgentSettingsComponent,
    AgentSubmittersComponent,
    FeedSettingsComponent,
    FeedLogComponent,
    MailOverviewComponent,
    EconomySettingsComponent,
    ReceiptSettingsComponent,
    FeedbackOverviewComponent,
    StatusOverviewComponent,
    FeedCategoriesComponent,
    SettingsAdvancedComponent,
    SettingsLogisticsComponent,
    TemplatesOverviewComponent,
    TemplateEditComponent,
    ManufacturersComponent,
    WebhooksComponent,
    UsersOverviewComponent,
    SettingsBrandsComponent,
    ProductSettingsComponent,
    TraderaCheckoutComponent,
    TraderaTermsComponent,
    TraderaStoreComponent,
    TraderaShippingComponent,
    ApiComponent,
    WoocommerceSettingsComponent,
    AmazonSettingsComponent,
    CdonSettingsComponent,
    PrestashopSyncComponent,
    PrestashopCategoriesComponent,
    PrestashopCategoryComponent,
    PrestashopOrderComponent,
    FyndiqSettingsComponent,
    SelloshopGeneralComponent,
    SelloshopOrderComponent,
    SelloshopPaymentComponent,
    SelloshopCategoriesComponent,
    SelloshopCategoryComponent,
    SelloshopCuponsComponent,
    SelloshopThemeComponent,
    SelloshopFilesComponent,
    SelloshopModulesComponent,
    SelloshopFacebookModuleComponent,
    SelloshopTextModuleComponent,
    SelloshopSliderModuleComponent,
    SelloshopImageModuleComponent,
    SelloshopGridModuleComponent,
    SelloshopContentComponent,
    SelloshopContentEditComponent,
    CategorySettingRowComponent,
    SettingRowComponent,
    SettingRowSelectComponent,
    SettingRowWysiwygComponent,
    MenuComponent,
    OrderSettingsComponent,
    OrderRemindersComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(SettingsRoutes),
        HttpModule,

        ModalModule,
        BootstrapModalModule,
        Ng2BootstrapModule,
        UiSwitchModule,

        CoreModule,
        CategoryModule
    ],
    providers: [
        AdvancedSettingsService,
        IntegrationSettingsService,
        StatusesService,
        SettingsService,
        ApiService,
        ProductBrandService,
        SettingsV3Service,
        CategoryService,
        LogService,
        FeedbackService,
        MailTemplateService,
        LanguageService,
        ManufacturersService,
        MarketV3Service,
        SelloshopFilesService,
        SelloshopCouponService,
        SelloshopThemeService,
        SelloshopCategoriesService,
        SelloshopModulesService,
        ProductTemplateService,
        WebhooksService,
        RemindersService
    ],
    declarations: [
        ...SettingsComponents,
        ...SettingsModals
    ],
    entryComponents: [
        ...SettingsModals
    ]
})
export class SettingsModule {}

export { StatusesService }
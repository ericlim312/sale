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
import { CoreModule } from './core';

/*
* Module components
*/
import { AccountSwitcher } from './account/account-switcher.component';
import { UserMenuComponent } from './account/user-menu.component';
import { InvoiceNotifier } from './account/invoice-notifier.component';
import { XLarge } from './home/x-large';

/*
* Module service
*/
import { AppState } from './app.service';
import { AccountService } from './account/account.service';
import { IntegrationService } from './integration/integration.service';

/*
* Module routes
*/
import { AppRoutes } from './app.routes';

const AppComponents = [
    AccountSwitcher,
    UserMenuComponent,
    InvoiceNotifier,
    XLarge
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(AppRoutes),
        HttpModule,

        ModalModule,
        BootstrapModalModule,
        Ng2BootstrapModule,
        UiSwitchModule,

        CoreModule
    ],
    declarations: [
        ...AppComponents
    ],
    exports: [
        ...AppComponents
    ],
    providers: [
        AppState,
        AccountService,
        IntegrationService
    ]
})
export class AppModule {}

export * from './app.component';
export * from './app.service';
export * from './app.routes';
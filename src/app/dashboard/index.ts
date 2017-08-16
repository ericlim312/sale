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

/*
* Module routes
*/
import { DashboardRoutes } from './dashboard.routes';

/*
* Module components
*/
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(DashboardRoutes),
        HttpModule,

        ModalModule,
        BootstrapModalModule,
        Ng2BootstrapModule,
        UiSwitchModule,

        CoreModule
    ],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule {}
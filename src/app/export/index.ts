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
import { ExportRoutes } from './export.routes';

/*
* Module components
*/
import { ExportOrdersBookkeepingComponent } from './orders/bookkeeping.component';
import { ExportComponent } from './export.component';

const ExportModals = [
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(ExportRoutes),
        HttpModule,

        ModalModule,
        BootstrapModalModule,
        Ng2BootstrapModule,
        UiSwitchModule,

        CoreModule
    ],
    declarations: [
        ExportOrdersBookkeepingComponent,
        ExportComponent,
        ...ExportModals
    ],
    entryComponents: [
        ...ExportModals
    ]
})
export class ExportModule {}
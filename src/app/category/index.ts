import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
* Module components
*/
import { CategorySelect } from './category-select.component';
import { CategoryMultiSelect } from './category-select-multiple.component';

/*
* Module services
*/
import { CategoryService } from './category.service';

export const CategoryComponents = [
    CategorySelect,
    CategoryMultiSelect
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,

        ModalModule,
        BootstrapModalModule,
        Ng2BootstrapModule,
        UiSwitchModule,

        CoreModule
    ],
    declarations: [
        ...CategoryComponents
    ],
    providers: [
        CategoryService
    ],
    exports: [
        ...CategoryComponents
    ]
})
export class CategoryModule {}

export { CategoryService } from './category.service';

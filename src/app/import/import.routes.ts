import { RouterConfig }          from '@angular/router';
import { ImportComponent } from './import.component';
import { ImportLetsdealComponent } from './letsdeal.component';
import { ImportXlsxComponent } from './xlsx.component';
import { ImportOrderXlsxComponent } from './order-xlsx.component';

export const ImportRoutes: RouterConfig = [
  {
    path: 'import',
    component: ImportComponent,
    children: [
        { path: 'orders/letsdeal', component: ImportLetsdealComponent },
        { path: 'orders/xlsx', component: ImportOrderXlsxComponent },
        { path: 'products/xlsx', component: ImportXlsxComponent }
    ]
  }
];

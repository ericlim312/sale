import { RouterConfig }          from '@angular/router';
import { ExportOrdersBookkeepingComponent } from './orders/bookkeeping.component';
import { ExportComponent } from './export.component';

export const ExportRoutes: RouterConfig = [
  {
    path: 'export',
    component: ExportComponent,
    children: [
        { path: 'orders/bookkeeping', component: ExportOrdersBookkeepingComponent }
    ]
  }
];

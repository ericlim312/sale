import { RouterConfig }          from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { InventoryListComponent } from './list.component';
import { InventoryEditComponent } from './edit/edit.component';
import { InventoryStatsComponent } from './stats/stats.component';

export const InventoryRoutes: RouterConfig = [
  { path: 'inventory/edit/:productId', component: InventoryEditComponent }, // These are root routes, should not be made into children of inventory
  { path: 'inventory/stats/:productId', component: InventoryStatsComponent }, // These are root routes, should not be made into children of inventory
  {
    path: 'inventory',
    component: InventoryComponent,
    children: [
        { path: 'list', component: InventoryListComponent },
        { path: '', redirectTo: 'list', terminal: true }
    ]
  }
];

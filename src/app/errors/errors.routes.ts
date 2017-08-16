import { RouterConfig } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

export const ErrorsRoutes: RouterConfig = [
    {path: '404', component: NotFoundComponent},
    {path: '**', redirectTo: '404'}
];
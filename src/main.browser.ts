/*
 * Providers provided by Angular
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

/*
* Platform and Environment
* our providers/directives/pipes
*/
import { ENV_PROVIDERS, decorateComponentRef } from './platform/environment';

/*
* Third party modules
*/
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { UiSwitchModule } from 'angular2-ui-switch';

/*
* App modules
*/
import { CoreModule } from './app/core';
import { InventoryModule } from './app/inventory';
import { SettingsModule } from './app/settings';
import { ImportModule } from './app/import';
import { TraderaModule } from './app/tradera';
import { ExportModule } from './app/export';
import { ErrorsModule } from './app/errors';
import { DashboardModule } from './app/dashboard';

/*
* App Component
* our top level component that holds all of our components
*/
import { App, AppModule } from './app';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([], {useHash: false}),
    ModalModule.forRoot(),

    BootstrapModalModule,
    Ng2BootstrapModule,
    UiSwitchModule,

    AppModule,
    CoreModule,
    InventoryModule,
    SettingsModule,
    ImportModule,
    ExportModule,
    TraderaModule,
    DashboardModule,
    ErrorsModule
  ],
  providers: [
    ...ENV_PROVIDERS
  ],
  declarations: [
    App,
  ],
  bootstrap: [App]
})
class MainModule {}

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main(initialHmrState?: any): Promise<any> {

  return platformBrowserDynamic().bootstrapModule(MainModule)
      .then(decorateComponentRef);

}

/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */

/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */
if ('development' === ENV && HMR === true) {
  // activate hot module reload
  let ngHmr = require('angular2-hmr');
  ngHmr.hotModuleReplacement(main, module);
} else {
  // bootstrap when document is ready
  document.addEventListener('DOMContentLoaded', () => main());
}

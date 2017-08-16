import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/*
* Third-party modules
*/
import { Ng2BootstrapModule } from 'ng2-bootstrap';

/*
* Third-party components, which have no module of their own
*/
import { Angulartics2 } from 'angulartics2';
import { Angulartics2On } from 'angulartics2/src/core/angulartics2On';
import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';
import { DateFormatPipe, FromUnixPipe } from 'angular2-moment';
import { ColorPickerDirective } from 'ct-angular2-color-picker/component';

/*
* Third-party services
*/
import { ColorPickerService } from 'ct-angular2-color-picker/component'

/*
* Module components
*/
import { AutofocusDirective } from './autofocus.directive';
import { EqualValidator } from './validators/equal-validator.directive';
import { FeedbackComponent } from './feedback/feedback.component';
import { ImageLoadDirective } from './image-load.directive';
import { HintComponent } from './hint.component';
import { TranslatePipe } from './i18n/translate';
import { FILE_UPLOAD_DIRECTIVES } from './file/all';
import { LCPipe } from './str/lc';
import { NotificationsComponent } from './notifications.component';
import { RoundPipe } from './round.pipe';
import { SelloPanel } from './sello-panel.component';
import { Wysiwyg } from './wysiwyg.component';

/*
* Modals
*/
import { CoreModals } from './modals'

/*
* Module services
*/
import { AlertService } from './alert.service';
import { CountryService } from './country.service';
import { DataService } from './data.service';
import { Localstorage } from './localstorage.service';
import { NotificationService } from './notification.service';

export const CoreComponents = [
    Angulartics2On,
    ColorPickerDirective,
    DateFormatPipe,
    FromUnixPipe,

    AutofocusDirective,
    EqualValidator,
    FeedbackComponent,
    ImageLoadDirective,
    HintComponent,
    TranslatePipe,
    ...FILE_UPLOAD_DIRECTIVES,
    LCPipe,
    NotificationsComponent,
    RoundPipe,
    SelloPanel,
    Wysiwyg
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,

        Ng2BootstrapModule
    ],
    declarations: [
        ...CoreComponents,
        ...CoreModals
    ],
    providers: [
        Angulartics2,
        Angulartics2GoogleAnalytics,
        ColorPickerService,
        TranslatePipe,

        AlertService,
        CountryService,
        DataService,
        Localstorage,
        NotificationService
    ],
    exports: [
        ...CoreComponents,
        ...CoreModals
    ],
    entryComponents: [
        ...CoreModals
    ],
})
export class CoreModule {}

export { AlertService } from './alert.service';
export { CountryService } from './country.service';
export { NotificationService } from './notification.service';
export { Localstorage } from './localstorage.service';
export { TranslatePipe } from './i18n/translate';
export { UnsubscriberComponent } from './unsubscriber.component';

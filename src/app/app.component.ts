import { Component, ViewEncapsulation, OnInit, ViewContainerRef } from '@angular/core';

import { Angulartics2 }                                       from 'angulartics2';
import { Angulartics2GoogleAnalytics }                        from 'angulartics2/src/providers/angulartics2-google-analytics';
import { Modal }                                              from 'angular2-modal/plugins/bootstrap';

import { IntegrationService }                                 from './integration/integration.service';
import { NotificationService }                                from './core';
import { UnsubscriberComponent }                              from './core';
import { AccountService }                                     from './account/account.service';
import { Account }                                            from './account/account';


@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: require('./app.component.html')
})
export class App extends UnsubscriberComponent implements OnInit {
    public account: Account = null;
    public notifications;
    public integrations;
    private errorMessage;

    constructor(
      private _angulartics2: Angulartics2,
      private _analytics: Angulartics2GoogleAnalytics,
      private _accountService: AccountService,
      private _notificationService: NotificationService,
      private _integrationService: IntegrationService,
      public modal: Modal,
      viewContainer: ViewContainerRef
    ) {
        super();
        modal.defaultViewContainer = viewContainer;
    }

    allowed(route) {
        if (this.account === null) {
            return false;
        } else {
            if (route === 'import' && (this.account.role === 'leader' || this.account.role === 'admin')) {
                return true;
            } else if (route === 'inventory.worth' && (this.account.role === 'leader' || this.account.role === 'admin')) {
                return true;
            } else if (route === 'settings' && (this.account.role === 'leader' || this.account.role === 'admin')) {
                return true;
            } else {
                console.warn('Not allowed: ' + route, this.account.role);
                return false;
            }
        }
    }

    // When component is init:ed
    ngOnInit() {
        // Load account
        // Subscribe to data, then run get() to make sure it's fetched
        this.subscriptions.push(
            this._accountService.account$.subscribe(account => {
                this.account = account;
                this._angulartics2.setUsername.next(account.id);

                if (this.account['account_type'] === 'whitelabel') {
                    // Start of LiveChat (www.livechatinc.com) code
                    window['__lc'] = window['__lc'] || {};
                    window['__lc'].license = 5594831;
                    (function() {
                    var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
                    lc.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
                    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
                    })();
                } else {
                    window['zEmbed']||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window['zEmbed']=function(){a.push(arguments)},window['zE']=window['zE']||window['zEmbed'],r.src="javascript:false",r.title="",r['role']="presentation",(r['frameElement']||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(c){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var o=this.createElement("script");n&&(this.domain=n),o.id="js-iframe-async",o.src=e,this.t=+new Date,this.zendeskHost=t,this.zEQueue=a,this.body.appendChild(o)},o.write('<body onload="document._l();">'),o.close()}("https://assets.zendesk.com/embeddable_framework/main.js","sellohelp.zendesk.com");
                }
            }));
        this._accountService.getAccount();

        this.subscriptions.push(
            this._notificationService.notification$.subscribe(notifications => this.notifications = notifications));
        this._notificationService.get();

        // Fetch for other components to use
        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integrations => this.integrations = integrations));
        this._integrationService.get();
    }
}

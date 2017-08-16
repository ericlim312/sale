import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UnsubscriberComponent} from '../core';
import {IntegrationService} from '../integration/integration.service';

@Component({
  selector: 'settings-menu',
  template: require('./menu.component.html'),
  styles: [
      require('./menu.component.scss')
  ]
})
export class MenuComponent extends UnsubscriberComponent {
    public toggled = {};
    public integrations;
    private _sub;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _integrationService: IntegrationService
    ) {
        super();
    }

    toggle(item) {
        this.toggled[item] = !this.toggled[item];
    }

    getLink(integration) {
        switch(integration.market_id) {
            case 1:
                return 'http://www.tradera.com/profile/items/' + integration.market_user_id + '/seller';

            case 5:
                return integration.endpoint;

            case 10:
                return 'http://cdon.se/merchant/' + integration.market_user_id;

            case 11:
                return integration.endpoint.replace('/api', '');

            case 12:
                return integration.endpoint.replace('/wc-api/v2/', '');

            case 13:
                return 'http://www.amazon.co.uk/shops/' + integration.market_user_id;
        }
    }

    ngOnInit() {
        // Load integrations
        this.subscriptions.push(
            this._integrationService.integration$.subscribe(integration => {
                this.integrations = integration;
            }));
        this._integrationService.get();

        var parentsToExpand = this.getParentsToExpand(this._router.routerState.children(this._route));
        parentsToExpand.forEach(parentToExpand => this.toggled[parentToExpand] = true);
    }

    private getParentsToExpand(children) {
        let results = [];

        if (!children || !children.length) {
            return results;
        }

        let urlParts = children[0].url.value;
        if (urlParts.length > 1) {
            results.push(urlParts[0].toString() + urlParts[1].toString());
        }

        if (urlParts[0]) {
            results.push(urlParts[0].toString());
        }

        return results;
    }
}

import { Component } from '@angular/core';

import { Angulartics2GoogleAnalytics } from 'angulartics2/src/providers/angulartics2-google-analytics';

import { ColumnsService } from './columns.service';
import { IntegrationService } from '../integration/integration.service';
import { AccountService } from '../account/account.service';
import { UnsubscriberComponent } from '../core';

@Component({
    selector: 'so-column-selector',
    template: require('./column-selector.component.html'),
})
export class InventoryColumnSelectorComponent extends UnsubscriberComponent {
    public language;
    public marketColumns = [];
    public standardColumns = [];
    public openIntegrations = {};
    private _columns;

    constructor(
        private _columnsService: ColumnsService,
        private _integrationService: IntegrationService,
        private _account: AccountService,
        private _analytics: Angulartics2GoogleAnalytics
    ) {
        super();
        this.language = this._account.getLanguage();
    }

    toggle(id) {
        this.openIntegrations[id] = !this.openIntegrations[id];
    }

    onColumnChange(column, checked) {
        // Update column property
        column.show = checked;
        this._columnsService.setSelected(column, checked);
        this._columnsService.saveColumns();
    }

    ngOnInit() {
        this.subscriptions.push(
            this._columnsService.columns$.subscribe(columns => {
                this._columns = columns;

                // Make sure integrations are loaded
                if (columns.length > 0) {
                    this.subscriptions.push(
                        this._integrationService.integration$.subscribe(integrations => {
                            this.marketColumns = [];
                            this.standardColumns = [];
                            let cols = {};

                            for (let n in this._columns) {
                                let col = this._columns[n];

                                // If market, add to market array
                                if (col.section === 'market') {
                                    if (!cols.hasOwnProperty(col.integration_id)) {
                                        cols[col.integration_id] = {
                                            'columns': [],
                                            'integration': this._integrationService.getIntegration(parseInt(col.integration_id))
                                        };
                                    }

                                    cols[col.integration_id].columns.push(col);
                                } else {
                                    this.standardColumns.push(col);
                                }
                            }

                            // Rebuild to flat array
                            let keys = Object.keys(cols);
                            for (let n in keys) {
                                this.marketColumns.push(cols[keys[n]]);
                            }
                        }));

                    // Request data
                    this._integrationService.get();
                }
            }));

        this._columnsService.get();
    }
}

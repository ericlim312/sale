import 'rxjs/add/operator/share';

import { Injectable }                          from '@angular/core';
import { Response }                            from '@angular/http';
import { Observable }                          from 'rxjs/Observable';

import { DataService }                         from '../core/data.service';
import { IntegrationService }                  from '../integration/integration.service';

@Injectable()
export class AgentService {
    public agent$;
    public _agentObserver;
    public _integrations;

    constructor(private _data: DataService, private _integrationService: IntegrationService) {
        console.info('New agents service instance. This should only happen once!');
        // Create agent observer
        this.agent$ = new Observable(observer => this._agentObserver = observer).share();
        console.debug('Subscribe to integrations');
        // We need to fetch integrations
        this._integrationService.integration$.subscribe(integrations => this._integrations = integrations);
    }

    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}

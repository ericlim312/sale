import { Component, OnInit } from '@angular/core';
import { UnsubscriberComponent } from '../../core';
import { DataService } from '../../core/data.service';

@Component({
    selector: 'agent-settings',
    template: require('./settings.component.html')
})
export class AgentSettingsComponent extends UnsubscriberComponent {
    public enable = true;
    public createNew = {
        visible: false
    };

    public constructor(
        private _data: DataService
    ) {
        super();
    }

    onChange() {
        this._data.put('v4/agent/', { 'enabled': !this.enable })
            .subscribe(data => {
                console.log('Update enable status successfully.');      
            }, error => {
                console.error('Unable to change language, redirecting to Sello.io', error);
            });
        this._data.get('v4/agent/rates/')
            .subscribe(data => {
                console.log(data);      
            }, error => {
                console.error('Unable to change language, redirecting to Sello.io', error);
            });
    }

    
}

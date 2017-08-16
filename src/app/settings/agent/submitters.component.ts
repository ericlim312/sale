import { Component, OnInit } from '@angular/core';
import { UnsubscriberComponent } from '../../core';

@Component({
    selector: 'agent-settings',
    template: require('./submitters.component.html')
})
export class AgentSubmittersComponent extends UnsubscriberComponent {
    public enable = true;
    public createNew = {
        visible: false
    };

    public constructor(
    ) {
        super();
    }
}

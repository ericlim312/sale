import { Component } from '@angular/core';


import { AgentService } from './agent.service';

@Component({
  selector: 'agents',
  providers: [
      AgentService
  ],
  template: require('./agents.component.html')
})

export class AgentsComponent {

    constructor(
        private _agentService: AgentService
    ) {
    }

    ngOnInit() {
    }
}

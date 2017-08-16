import { Component } from '@angular/core';

@Component({
  selector: 'agents',
  template: require('./dashboard.component.html')
})
export class AgentsDashboardComponent {

    private submitters = {
        num: 0
    };
    private products = {
        num: 0,
        bid: {
            max: 0,
            min: 0
        }
    };
    private orders = {
        num: 0
    };

    constructor(
    ) {
    }

    ngOnInit() {
    }
}

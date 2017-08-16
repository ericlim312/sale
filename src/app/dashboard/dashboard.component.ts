import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscriberComponent } from '../core';

@Component({
    selector: 'dashboard',
    template: require('./dashboard.component.html')
})
export class DashboardComponent extends UnsubscriberComponent {
    public meta = {};

    public constructor(
    ) {
      super();
    }
}

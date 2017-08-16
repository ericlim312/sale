import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'selloshop-facebook-module',
    template: require('./facebook.component.html')
})

export class SelloshopFacebookModuleComponent implements OnInit {
    @Input() public editing;

    ngOnInit() {
        if (typeof this.editing.settings !== 'object') {
            this.editing.settings = { tabs: {} };
        }
    }
}
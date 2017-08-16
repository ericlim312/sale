import { Component, Input } from '@angular/core';

@Component({
    selector: 'selloshop-text-module',
    template: require('./text.component.html')
})

export class SelloshopTextModuleComponent {
    @Input() public editing;
}
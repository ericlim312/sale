import {Component, Input, OnInit} from '@angular/core';
import {Localstorage} from './localstorage.service';

@Component({
  selector: 'so-panel',
  providers: [],
  template: require('./sello-panel.component.html'),
})
export class SelloPanel implements OnInit {
    @Input('header') header;
    @Input('name') name;
    @Input('collapsible') collapsible;
    @Input('defaultopen') defaultopen;
    @Input('forceopen') forceopen;
    @Input('subheader') subheader;
    @Input('show') show;
    @Input('iconImg') iconImg;

    public open: boolean = false;

    constructor(private _localstorage: Localstorage) {
    }

    onToggle() {
        // If this panel isn't collapsible, ignore this function
        if (!this.collapsible) {
            return;
        }

        // Toogle the variable
        this.open = !this.open;

        // Save the state for this panel
        try {
            this._localstorage.set('panel_' + this.name, { 'open': this.open ? '1' : '0' });
        } catch (e) {}
    }

    // Set the item to default open if set
    ngOnInit() {
        // Show everything by default
        if (this.show === undefined) {
            this.show = true;
        }

        // If this should be force open
        if (this.forceopen) {
            this.open = true;
            return;
        }

        // Check if we have a state saved in localstorage
        try {
            let ls = this._localstorage.get('panel_' + this.name);
            if (ls !== null) {
                this.open = ls.open === '1';
                return;
            }
        } catch (e) {}

        if (this.defaultopen !== null) {
            this.open = this.defaultopen;
        }
    }
}

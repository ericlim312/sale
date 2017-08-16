import {Component, Input} from '@angular/core';
import {Localstorage} from './localstorage.service';

@Component({
  selector: 'hint',
  template: `
<div class="hint" *ngIf="visible">
  <i class="fa fa-info"></i>
  <p [innerHtml]="message"></p>
  <a role="button" (click)="hide()" class="hide-button">{{ 'HINT_HIDE'|translate }}</a>
</div>
<button class="help-button" *ngIf="!visible" (click)="show()"><i class="fa fa-question"></i> {{ 'HELP'|translate }}</button>
  `
})
export class HintComponent {
    @Input('id') id;
    @Input('message') message;

    public constructor(
        private _localstorage: Localstorage
    ) {}

    public get visible() {
      return !this._hidden;
    }

    show() {
      this._hidden = false;
    }

    hide() {
      this._hidden = true;
    }

    private get _hidden() {
      let key = this._getKey(this.id);

      if (!this._localstorage.hasKey(key)) {
        return false;
      }

      return this._localstorage.get(key);
    }

    private set _hidden(value: boolean) {
      this._localstorage.set(this._getKey(this.id), value);
    }

    private _getKey(id = 'default') {
      return `hint-${id}-hidden`;
    }
}

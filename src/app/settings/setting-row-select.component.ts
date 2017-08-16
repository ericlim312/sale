import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'setting-row-select',
    template: require('./setting-row-select.component.html'),
    styles: [require('./setting-row-select.component.scss')]
})
export class SettingRowSelectComponent {

    @Input('mode') mode = 'dropdown';
    @Input('name') name;
    @Input('value') value;
    @Input('choices') choices;
    @Input('required') required: boolean;
    @Input('editable') editable;
    @Input('error') error;
    @Output('onSave') onSave = new EventEmitter();

    public edit = false;
    public valueText;
    public enabledChoices = [];

    private _originalChoices = []

    get isValid() {
        if (!this.required) {
            return true;
        }

        return this.getEnabledChoices().length > 0;
    }

    onEdit() {
        this.edit = true;
    }

    select(choice) {
        this.value = choice;
    }

    save() {
        this.edit = false;
        this.valueText = this.value;
        this.onSave.emit(this.value);
    }

    cancel() {
        this.edit = false;
        this.value = this.valueText;

        if (this.choices) {
            this._restoreOriginalChoices(this.choices, this._originalChoices);
        }
    }

    ngOnInit() {
        if (this.editable === undefined) {
            this.editable = true;
        }

        this.valueText = this.value;

        if (this.choices) {
            this._originalChoices = this.choices.filter(c => c.enable).map(c => c.value);
        }
    }

    getChoiceName(value) {
        if (!this.choices) {
            return value;
        }

        var choice = this.choices.find(c => c.value == value);
        if (!choice) {
            return value;
        }

        return choice.name;
    }

    getEnabledChoices() {
        return this.choices.filter(c => c.enable);
    }

    private _restoreOriginalChoices(choices, originalChoices) {
        choices.forEach(c => c.enable = false);

        originalChoices.forEach(o => {
            var choice = choices.find(c => c.value === o);
            if (choice) {
                choice.enable = true;
            }
        });
    }
}

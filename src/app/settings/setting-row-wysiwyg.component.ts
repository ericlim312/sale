import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'setting-row-wysiwyg',
    template: require('./setting-row-wysiwyg.component.html')
})
export class SettingRowWysiwygComponent {
    @Input('name') name;
    @Input('value') value;
    @Input('default') default;
    @Input('editable') editable;
    @Input('maxLength') maxLength;
    @Input('error') error;
    @Output('onSave') onSave = new EventEmitter();

    public edit:boolean = false;
    public valueText;
    public previewText;

    get isLengthValid() {
        if (!this.maxLength) {
            return true;
        }

        if (!this.value) {
            return true;
        }
        
        return this.value.length <= this.maxLength;
    }

    onEdit() {
        this.edit = true;
    }

    save() {
        if (!this.isLengthValid) {
            return;
        }

        this.edit = false;
        this.valueText = this.value;

        this.previewText = this._getPreviewText(this.value);
        this.onSave.emit(this.value);
    }

    cancel() {
        this.edit = false;
        this.value = this.valueText;
    }

    ngOnInit() {
        if (this.editable === undefined) {
            this.editable = true;
        }

        if (this.value === undefined) {
            this.valueText = this.default;
        } else {
            this.valueText = this.value;
        }

        this.previewText = this._getPreviewText(this.value);
    }

    private _getPreviewText(input) {
        return this.value.substring(0, 100).replace(/<(?:.|\n)*?>/gm, '');
    }
}

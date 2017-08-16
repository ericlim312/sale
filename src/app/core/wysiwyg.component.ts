import {Component, Provider, forwardRef, Inject, ElementRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var tinymce: any;

const noop = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => Wysiwyg),
    multi: true
  });

@Component({
  selector: 'wysiwyg',
  template: `
      <div>
        <textarea class="hidden">{{value}}</textarea>
      </div>
  `,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class Wysiwyg implements ControlValueAccessor{

    //The internal data model
    private _value: any = '';

    //Placeholders for the callbacks
    private _onTouchedCallback: () => void = noop;

    private _onChangeCallback: (_:any) => void = noop;

    private elementRef: ElementRef;
    private elementID: string;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;

        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        this.elementID = 'tinymce' + uniqid;
    }

    ngAfterViewInit() {
        // Wait 100ms until creating editor. This is needed if the element has a ngIf statement
        setTimeout(() => {
            //Clone base textarea
            var baseTextArea = this.elementRef.nativeElement.querySelector('textarea');
            var clonedTextArea = baseTextArea.cloneNode(true);
            clonedTextArea.id = this.elementID;

            var formGroup = this.elementRef.nativeElement.querySelector('div');
            formGroup.appendChild(clonedTextArea);

            //Attach tinyMCE to cloned textarea
            tinymce.init(
                {
                    mode: 'exact',
                    height: 500,
                    theme: 'modern',
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table contextmenu paste code'
                    ],
                    toolbar: 'bold italic | bullist numlist outdent indent | link image | code',
                    elements: this.elementID,
                    setup: this.tinyMCESetup.bind(this)
                }
            );
        }, 100);
    }

    ngOnDestroy() {
        if (tinymce.get(this.elementID) !== null) {
            tinymce.get(this.elementID).remove();
        }
    }

    tinyMCESetup(editor) {
        editor.on('change', () => {
            this.value = tinymce.get(this.elementID).getContent();
        });
        editor.on('keyUp', () => {
            this.value = tinymce.get(this.elementID).getContent();
        });
    }

    //get accessor
    get value(): any { return this._value; };

    //set accessor including call the onchange callback
    set value(v: any) {
      if (v !== this._value) {
        this._value = v;
        this._onChangeCallback(v);
      }
    }

    //Set touched on blur
    onTouched(){
      this._onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
      this._value = value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
      this._onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
      this._onTouchedCallback = fn;
    }

}
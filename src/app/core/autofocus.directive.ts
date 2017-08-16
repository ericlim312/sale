import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer,
    SimpleChanges
} from "@angular/core";

@Directive({
    selector: "[core-autofocus]"
})
export class AutofocusDirective implements OnChanges {
    @Input("core-autofocus") public enabled: boolean;

    public constructor(
        private _renderer: Renderer,
        private _element: ElementRef
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.enabled) {
            setTimeout(() =>
                this._renderer.invokeElementMethod(this._element.nativeElement, "focus", []));
        }
    }
}

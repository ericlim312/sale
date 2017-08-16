import { Directive, Input, ElementRef } from '@angular/core';

declare type IntersectionObserver = any;
declare var IntersectionObserver: IntersectionObserver;

@Directive({ selector: '[imageLoad]' })
export class ImageLoadDirective {
    
    @Input("imageLoad")
    public imageUrl: string;

    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        let element = this.elementRef.nativeElement;

        if (!this.observer) {
            this.observer = new IntersectionObserver(e => this.onChanges(e));
        }

        element.dataset.src = this.imageUrl;

        this.observer.observe(element);
    }

    private get observer() {
        return window['sello_intersection_observer'];
    }

    private set observer(value) {
        window['sello_intersection_observer'] = value;
    }

    onChanges(changes) {
        changes.forEach(change => {
            let element = change.target;
            this.setImageUrl(element)
            this.observer.unobserve(element);
        });
    }

    setImageUrl(element) {
        element.src = element.dataset.src;
    }
}
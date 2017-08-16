import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UnsubscriberComponent } from '../../../core';
import { SelloshopFilesService } from '../files.service';

@Component({
    selector: 'selloshop-slider-module',
    template: require('./slider.component.html')
})

export class SelloshopSliderModuleComponent extends UnsubscriberComponent implements OnInit {
    @Input() public editing;

    public files;

    public slides = [];
    public addSlide = {};

    constructor(
        private _route: ActivatedRoute,
        private _filesService: SelloshopFilesService
    ) {
        super();
    }

    get integrationId() {
        return this._route.snapshot.params['id'];
    }

    ngOnInit() {
        if (typeof this.editing.settings !== 'object') {
            this.editing.settings = { interval: 1 };
        }

        this.slides = this._getSlides(this.editing.settings);

        this.subscriptions.push(this._filesService.file$.subscribe(files => {
            this.files = files;
        }));
        this._filesService.get(this.integrationId);
    }

    onAddSlide(url) {
        if (url) {
            this.slides.push(url);
            this.editing.settings = this._getSettings(this.slides, this.editing.settings.interval)
        }
        this.addSlide = {};
    }

    onRemoveSlide(index) {
        this.slides.splice(index, 1);
        this.editing.settings = this._getSettings(this.slides, this.editing.settings.interval)
    }

    private _getSlides(obj) {
        return Object.keys(obj).filter(key => key.indexOf('image_') !== -1).map(key => obj[key]);
    }

    private _getSettings(slides, interval) {
        let settings = { interval };

        slides.forEach((slide, i) => {
            settings[`image_${i}`] = slide;
        });

        return settings;
    }
}
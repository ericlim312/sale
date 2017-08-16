import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../core/data.service';
import {FileUploader} from '../../core/file/all';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';
import {Subject} from 'rxjs';
import {UnsubscriberComponent} from '../../core';

@Component({
    selector: 'image-widget',
    template: require('./image.component.html')
})
export class ImageWidgetComponent extends UnsubscriberComponent implements OnInit {
    @Input('images') images;
    @Input('productId') productId;
    public mainImage;
    public extraImages = [];
    public placeholders = [];
    public hasBaseDropZoneOver:boolean = false;
    private uploader: FileUploader;
    private uploaderMain: FileUploader;
    private placeholderData = {};
    private _maxNumImages = 7;
    private _rotate$: Subject<any>;

    constructor(private _dataService: DataService, private _analytics: Angulartics2GoogleAnalytics) {
        super();

        this._debounceRotate();
    }

    deleteImage(type, image) {
        if (type === 'extra') {
            // Remove image and add placeholder
            this.extraImages.splice(this.extraImages.indexOf(image), 1);
            this.placeholders.push(this.placeholderData);
        } else if (type === 'main') {
            this.mainImage = null;
        }

        this._dataService.delete('v4/products/' + this.productId + '/images/' + image.id)
            .subscribe(res => console.info('Image deleted'));
    }

    rotateImage(image) {
        if (!image.hasOwnProperty('rotation')) {
            image.rotation = 0;
        }

        // Rotate it 90 deg
        image.rotation += 90;

        // Wrap to 0
        if (image.rotation >= 360) {
            image.rotation = 0;
        }

        this._rotate$.next({
            productId: this.productId,
            imageId: image.id,
            imageRotation: image.rotation
        });
    }

    rotationStyle(image) {
       if (image.hasOwnProperty('rotation')) {
           return {'transform': 'rotate(' + image.rotation + 'deg)'};
       } else {
           return {'transform': 'rotate(0deg)'};
       }
    }

    setMain(image) {
        // Move the current main image to extra
        if (this.mainImage) {
            this.extraImages.push(this.mainImage);
            this.placeholders.splice(0, 1);
        }

        // Remove this image from extra
        this.extraImages.splice(this.extraImages.indexOf(image), 1);

        // Set main to this image
        this.mainImage = image;

        // Update cover in images object
        for (let n in this.images) {
            if (this.images[n].id === image.id) {
                this.images[n].cover = true;
            } else {
                this.images[n].cover = false;
            }
        }

        this._dataService.put('v4/products/' + this.productId + '/images/' + image.id, {})
            .subscribe(res => console.info('Image set to cover'));
    }

    ngOnInit() {
        // This variable neded in uploader
        let that = this;

        // Initialize upload
        let url = this._dataService.getHost() + 'v4/products/' + this.productId + '/images'
        let headers = this._dataService.getAuthHeaders();

        this.uploader = new FileUploader({ url, headers });
        this.uploader.autoUpload = true;
        this.uploader.filters.push({ name: 'filetype', fn: function(item) {
            // Only accept the file if a valid image
            return (/\.(gif|jpg|jpeg|png)$/i).test(item.name);
        }});
        this.uploader.onSuccessItem = function(item: any, response: any, status: any, headers: any) {
            let img = JSON.parse(response).data;

            // If there's no identifier, then it is the first image(s)
            if (!item.options.identifier) {
                // Put it as main if we have 0 images, else as extra
                if (!that.mainImage) {
                    item.options.identifier = 'main';
                } else {
                    item.options.identifier = 'extra';
                }
            }

            if (item.options.identifier === 'extra') {
                // Add to data, and remove a placeholder
                that.extraImages.push(img);
                that.placeholders.splice(0, 1);
            } else if (item.options.identifier === 'main') {
                img.cover = true;
                that.mainImage = img;
            }

            delete item.options.identifier;

            that.images.push(img);
        };

        // Pick the main image
        for (let n in this.images) {
            if (this.images[n].cover) {
                this.mainImage = this.images[n];
            } else {
                this.extraImages.push(this.images[n]);
            }
        }

        // If we have less than _maxNumImages extra images, add placeholders
        let numimg = this.extraImages.length;
        if (numimg < this._maxNumImages-1) {
            for (; numimg < this._maxNumImages-1; numimg++) {
                this.placeholders.push(this.placeholderData);
            }
        }
    }

    fileOverBase(event) {
        this.hasBaseDropZoneOver = event;
    }

    private _debounceRotate() {
        this._rotate$ = new Subject<any>();

        let rotateDebounced = this._rotate$.debounceTime(2500);

        this.subscriptions.push(rotateDebounced.subscribe(args => {
            this._dataService.post('v4/products/' + args.productId + '/images/' + args.id + '/rotate', {
                angle: args.imageRotation
            }).subscribe(res => {
                console.log(res);
            });
        }));
    }
}

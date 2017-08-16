import { Component, Input, OnInit } from '@angular/core';
import { QuickeditService } from '../quickedit.service';
import { UnsubscriberComponent } from '../../core';

@Component({
    selector: '[inventory-list-product]',
    template: require('./product.component.html')
})
export class InventoryListProductComponent extends UnsubscriberComponent implements OnInit {
    @Input('product') product: any;
    @Input('mainInGroup') mainInGroup: any;
    @Input('numProductsInGroup') numProductsInGroup: any;
    @Input('columns') columns: any;
    public quickedit;
    private _dirty = [];
    private _hoverStatus = false;
    private _containerClasses;

    constructor(private _quickeditService: QuickeditService) {
        super();
    }

    onCheckProduct(product, event) {
        product.checked = event.target.checked;
    }

    setDirty(column) {
        this._dirty.push(column);
    }

    hover(column, isHovering) {
        if (column.type === "name" && this._hoverStatus !== isHovering) {
            this._hoverStatus = isHovering;

            if (isHovering) {
                this._containerClasses.add('hover');
            } else {
                this._containerClasses.remove('hover');
            }
        }
    }

    isMainInGroup() {
        // If only one product, return false
        if (this.numProductsInGroup < 2) {
            return false;
        }

        return this.product.id == this.mainInGroup;
    }

    ngOnInit() {
        this.subscriptions.push(
            this._quickeditService.quickedit$.subscribe(result => {
                this.quickedit = result;
            }));

        this._containerClasses = document.querySelector('.inventory-list-scroll-container').classList;

        this.subscriptions.push(
            this._quickeditService.quickeditSave$.subscribe(result => {
                // Make an object of all visible data that might have been updated
                let data = {};

                if (this._dirty.length > 0) {
                    for (let col of this._dirty) {
                        data[col] = this.product[col];
                    }

                    // Send the data we have to quickedit service
                    this._quickeditService.setQuickeditData(this.product.id, data);
                }
            }));
    }
}

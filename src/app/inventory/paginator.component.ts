import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from './inventory.service';

const PREV_PAGES_TO_SHOW = 5;
const NEXT_PAGES_TO_SHOW = 5;

@Component({
  selector: 'so-paginator',
  providers: [],
  template: require('./paginator.component.html'),
})
export class PaginatorComponent implements OnChanges {
    @Input('total') total;
    @Input('folder') folder;
    @Input('sort') sort;
    @Input('search') search;
    @Input('sortDir') sortDir;
    public pages;
    private numPages = 0;
    private limit = 100;
    private _page: number;

    constructor(
      private _inv: InventoryService,
      private _router: Router
    ) {}

    get page() { return this._page; }

    @Input('page') set page(value) {
      this._page = Number(value);
    }

    goToRoute(page) {
      this._router.navigateByUrl(this.getLink(page));
    }

    getLink(page) {
      let obj = {
        page: page
      }

      if (this.sort) {
        obj['sort'] = this.sort;
      }

      if (this.folder) {
        obj['folder'] = this.folder;
      }

      if (this.sortDir) {
        obj['sortDir'] = this.sortDir;
      }

      if (this.search) {
        obj['search'] = this.search;
      }

      return this._inv.getLink(obj);
    }

    ngOnChanges() {
        this.numPages = Math.ceil(this.total / this.limit);

        // current page + and - 5 pages
        let range = PREV_PAGES_TO_SHOW + NEXT_PAGES_TO_SHOW;

        this.pages = Array.from(Array(range).keys())
          .map(i => i + this.page - PREV_PAGES_TO_SHOW)
          .filter(num => 0 < num && num <= this.numPages)
          .map(num => {
            return { num }; 
          });
    }

    onPageChange(page) {
        this.page = page;
    }
}

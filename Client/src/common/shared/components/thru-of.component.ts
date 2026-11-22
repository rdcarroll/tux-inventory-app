import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'thru-of',
    template: `
        <span>
            {{start}} through {{end}} of {{all}}
        </span>
    `
})

export class ThruOfComponent implements OnChanges {
    @Input() page: number;
    @Input() pageSize: number;
    @Input() collectionSize: number;
    @Input() count: number;
    start: number; end: number; all: number;

    constructor() { }

    ngOnChanges() {
        this.start = (this.page - 1) * this.pageSize + 1;
        this.end = (this.page - 1) * this.pageSize + this.count;
        this.all = this.collectionSize;
    }
}

//{ { (config.page - 1) * config.pageSize + 1 } } - {{ (config.page - 1) * config.pageSize + items.length }} of { { config.collectionSize } }
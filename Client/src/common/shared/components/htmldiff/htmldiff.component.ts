
import { Component, Input, Output, EventEmitter, OnInit, } from '@angular/core';
import diff = require("node-htmldiff");

@Component({
    selector: 'my-htmldiff',
    templateUrl: './htmldiff.component.html'
})
export class htmldiffComponent implements OnInit  {
    @Input() before: string;
    @Input() after: string;
    @Output() htmldiffChange = new EventEmitter<object>();
    mydiff: any;
    constructor() {
    }

    ngOnInit(): void {
        this.mydiff = diff(this.before, this.after);
    }
}


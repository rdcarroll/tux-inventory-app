
import { Component, Input, Output, EventEmitter, } from '@angular/core';


@Component({
    selector: 'my-date',
    templateUrl: './date.component.html'
})
export class DateComponent  {
    @Input() dateTime: Date;
    @Input() readOnly: any;
    @Input() id: string;
    @Input() name: string;
    @Output() dateTimeChange = new EventEmitter<object>();
    constructor() {
        this.id = this.id || "test";
        this.name = this.name || "test";
    }

    dateChange($event: any) {
        if (Object.prototype.toString.call($event) === '[object Date]') {
            this.dateTime = $event;
            this.dateTime.setHours(5, 0, 0, 0);
        }
        this.dateTime = $event;
        this.dateTimeChange.emit($event);
    }
}



import { Component, Input, Output, EventEmitter, } from '@angular/core';


@Component({
    selector: 'my-datecheck',
    templateUrl: './datecheck.component.html'
})
export class DateCheckComponent  {
    @Input() dateTime: Date;
    @Input() check: Boolean;
    @Input() readOnly: any;
    @Input() id: string;
    @Input() name: string;
    @Output() dateTimeChange = new EventEmitter<object>();
    @Output() checkChange = new EventEmitter<object>();
    constructor() {
        this.id = this.id || "test";
        this.name = this.name || "test";
    }
    checkChanged(isChecked: boolean): void {
        if (isChecked) {
            this.dateTime = new Date();
            this.dateTime.setHours(5, 0, 0, 0);
        }
        else this.dateTime = this.dateTime;
        this.check = isChecked;
        this.dateTimeChange.emit(this.dateTime);
        this.checkChange.emit(this.check);
    }
    dateTimeChanged($event: any): void {
        if (Object.prototype.toString.call($event) === '[object Date]') {
            this.dateTime = $event;
            this.dateTime.setHours(5, 0, 0, 0);
        }
        this.dateTime = $event;
        this.dateTimeChange.emit($event);
    }
}


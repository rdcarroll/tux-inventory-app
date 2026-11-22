
import { Component, Input, Output, EventEmitter, OnInit, } from '@angular/core';


@Component({
    selector: 'my-datetime',
    templateUrl: './datetime.component.html'
})
export class DateTimeComponent implements OnInit  {
    @Input() dateTime: Date;
    @Input() readOnly: any;
    @Input() id: string;
    @Output() dateTimeChange = new EventEmitter<object>();

    shortMonths: string[];
    months: string[];
    month: string;
    now: Date;
    dateIn: Date;
    hour: number;
    hours: any[];
    minutes: any[];
    minute: number;
    years: any[];
    year: number;
    startYear: number;
    yearRange: number;
    days: number[];
    day: number;
    constructor() {
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        this.yearRange = 10;
        this.now = (new Date());
        this.startYear = this.now.getFullYear() - this.yearRange / 2;

        this.dateTime = this.dateTime == null ? this.now : this.dateTime;
    }

    range1(l: number) { var x:number[] = []; var i = 1; while (x.push(i++) < l) { }; return x }

    onChange() {
        //var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
        this.dateTime = new Date(this.year, this.months.indexOf(this.month), this.day, this.hour, this.minute);
        this.dateTimeChange.emit(this.dateTime);
    }

    ngOnInit() {
        this.dateIn = new Date(this.dateTime);
        this.month = this.months[this.dateIn.getMonth()];
        this.day = this.dateIn.getDate();
        this.year = this.dateIn.getFullYear();
        this.hour = this.dateIn.getHours();
        this.minute = this.dateIn.getMinutes();

        this.days = this.range1(31);
        this.years = this.range1(10).map(x => x + this.startYear);
        this.hours = this.range1(24);
        this.minutes = this.range1(60).map(x => x -1);
    }
}


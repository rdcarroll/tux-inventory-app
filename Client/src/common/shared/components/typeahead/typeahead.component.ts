
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//<my-typeahead [(myModel)]="employee_badge" [options]="employees" [valueField]="'BADGE_ID'" [displayField]="'FULL_NAME'"></my-typeahead>

@Component({
    selector: 'my-typeahead',
    templateUrl: './typeahead.component.html'
})
export class TypeAheadComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() myModel: any;
    @Input() options: any[];
    @Input() name: string;
    @Input() valueField: string;
    @Input() searchField: string; //if supplied, only search this field
    @Input() placeholder: string;
    @Input() btnText: string;
    @Input() allowCustom: boolean; //allow user to provide text not found in list of options
    @Input() displayField: string;
    @Input() required = false;
    @Input() disabled = false;
    @Input() startswith = false; //if true, the match must begin with the search text
    @Input() message: string;
    @Input() size: string;
    @Input() iskeyword: boolean = false;
    @Input() keyparm: string = "keyword";
    @Output() myModelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() myFocus: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('inputbox') inputbox: ElementRef;
    @ViewChild('auto') auto: ElementRef;

    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    max: number = 200;
    panelwidth: any = 'auto';
    constructor(
        private router: Router,
        private route: ActivatedRoute) {
    }
    ngOnInit() {
        this.allowCustom = this.allowCustom || false;
        this.placeholder = this.placeholder || "Pick One";
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => {
                    return this._filter(value);
                })
            );
    }
    ngOnChanges(changes: SimpleChanges): void {
        //this.displayFn(this.myModel);
        if (this.myModel!=null && (changes['myModel'] || changes['options'])) {
            //this.myControl.setValue(this.myModel);
            //this.displayFn(this.myModel);
            if (Array.isArray(this.options)) {
                //let val = this.options.filter((item: any) => item[this.valueField] == this.myModel);
                //this.myControl.setValue(val[0][this.displayField]);
                this.myControl.setValue(this.myModel);
            }
        }
    }
    displayFn(optionValue: any): string {
        if (Array.isArray(this.options)) {
            let val = this.options.filter((item: any) => item[this.valueField] == optionValue);
            return val && val.length ? val[0][this.displayField] : (this.allowCustom ? optionValue : '');
        }
        else {
            return ''
        }
    }
    emitter(val: any): void {
        let qp = {};
        qp[this.keyparm] = val;
        if (this.iskeyword) this.router.navigate([], { relativeTo: this.route, queryParams: qp, queryParamsHandling: 'merge' });
        this.myModelChange.emit(val);
    }
    isEmpty(value: any) {
        return (!value || 0 === value.length);
    }
    //on selection change
    onSelectionChanged(event: any) {
        let val = event.option.value;
        this.emitter(val);
    }
    //on input value change
    getChange(val: any) {
        //let _item = this.options.filter((item: any) => item[this.displayField] == val.target.value);
        //this.myModel = _item[this.valueField];
        //this.myModelChange.emit(this.myModel);
        if (val.target.value.length == 0 || this.allowCustom) this.emitter(val.target.value);
        //else this.clearFilter();
    }
    //on focus
    onFocus(event: any) {
        this.myFocus.emit(this.myModel);
    }
    //clear
    clearFilter(event: any) {
        if(event.pointerId>0){
            this.myControl.setValue("");
            this.emitter("");
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value && typeof value == 'string' ? value.toLowerCase() : "";
        if (this.options) {
            //return this.options.filter(option => option[this.displayField].toLowerCase().includes(filterValue)).slice(0, this.max);
            if (this.startswith) {
                if (this.searchField) {
                    return this.options.filter(o => o[this.searchField].toLowerCase().indexOf(filterValue) == 0).slice(0, this.max);
                }
                else {
                    return this.options.filter(o => Object.keys(o).some(k => typeof o[k] == 'string' ? o[k].toLowerCase().indexOf(filterValue) == 0 : false)).slice(0, this.max);
                }

            }
            else {
                if (this.searchField) {
                    return this.options.filter(o => o[this.searchField].toLowerCase().indexOf(filterValue) > -1 ).slice(0, this.max);
                }
                else {
                    return this.options.filter(o => Object.keys(o).some(k => typeof o[k] == 'string' ? o[k].toLowerCase().indexOf(filterValue) > -1 : false)).slice(0, this.max);
                }

            }
        }
        else {
            return [];
        }
    }

    ngAfterViewInit() {
        let width = this.inputbox.nativeElement.clientWidth; 
        setTimeout(() => {
            //this.panelwidth = width || 'auto';
        }, 1500);
    }
}

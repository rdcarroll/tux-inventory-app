
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

export interface Column {
    display?: string, //The text to display
    variable?: string, //The name of the key that's apart of the data array
    sortable?: boolean,
    filter: string,
    type?: string,
    hidden?: boolean
}
export interface Config {
    page: number,
    collectionSize: number,
    maxSize?: number,
    pageSize: number
}

@Component({
    selector: 'my-grid',
    templateUrl: './datagrid.component.html',
    //styleUrls: ['./datagrid.component.css'],
    styles: [`
            .table-sortable > thead > tr > th > .filter, .table-sortable > thead > tr > th > .sort {
                cursor: pointer;
                position: relative;
                background-image: none;
            }
            .dropdown-toggle::after{
                display:none !important;
            }
            `]
})
export class Datagrid implements OnInit, OnChanges {
    @Input() columns: Column[];
    @Input() data: any[];
    @Input() collectionSize: number = 0;
    @Input() page: number = 1;
    @Input() pageSize: number = 10;
    @Input() maxSize: number = 5; //pagination pages to show
    @Input() sort: any = {};
    @Input() filter: any = {};
    @Input() rowClass: string = "";
    @Input() rowIdentifier: string = "";
    @Output() pageChanged = new EventEmitter<number>();
    @Output() sortChanged = new EventEmitter<object>();
    @Output() filterChanged = new EventEmitter<object>();
    @Output() rowClicked = new EventEmitter<object>();
    @Output() btnClicked = new EventEmitter<object>();
    vcolumns: any[];

    constructor( ) {
    }

    selectedClass(columnName:string): string {
        return columnName == this.sort.column ? 'sort-' + this.sort.descending : 'no-sort';
    }

    changePage(): void {
        this.pageChanged.emit(this.page);
    }
    changeSorting(columnName: any): void {
        this.page = 1;
        var sort = this.sort;
        if (sort.column == columnName) {
            sort.descending = !sort.descending;
        } else {
            sort.column = columnName;
            sort.descending = false;
        }
        this.sortChanged.emit({ colname: this.sort.column, sortdir: this.sort.descending })
    }
    changeFilter(column: any): void {
        this.page = 1;
        this.filter[column.variable] = {'val':column.filtervalue, 'type':column.filter}
        this.filterChanged.emit(this.filter);
    }
    convertSorting(): string {
        return this.sort.descending ? '-' + this.sort.column : this.sort.column;
    }

    rowClick(row: any): void {
        this.data.map((obj) => { obj.$$selected = false; return obj; });
        row.$$selected = true;
        this.rowClicked.emit(row);
    }
    btnClick(row: any, btntype:string): void {
        this.data.map((obj) => { obj.$$selected = false; return obj; });
        row.$$selected = true;
        this.btnClicked.emit([row,btntype]);
    }
    getRowValue(row: any, variable: string): void|null {
        try {
            return eval("row." + variable);
        } catch (e) {
            return null;
        }
    }
    getCell(row: any, col: any): any {
        try {
            switch (col["filter"]) {
                case "text":
                    return eval("row." + col["variable"]);
                case "number":
                    return eval("row." + col["variable"]);
                case "date":
                    let d = Date.parse(eval("row." + col["variable"]))
                    return d > 0 ? new Date(eval("row." + col["variable"])) : null;
                case "link":
                    return eval("row." + col["variable"]);
            }
        } catch (e) {
            return null;
        }
    }

    getItems(): any[] {
        return this.data;
    }

    ngOnInit(): void {
       // this.columns = this.columns.filter(col => !col.hidden);

    }
    ngOnChanges(): void {
        //this.columns = this.columns.filter(col => !col.hidden);
        this.vcolumns = this.columns.filter(col => !col.hidden);

    }
}


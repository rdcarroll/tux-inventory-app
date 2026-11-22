
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, LOCALE_ID, Inject } from '@angular/core';
import { CellEditingStoppedEvent, CellValueChangedEvent, ColDef, Column, FilterChangedEvent, RowNode, RowSelectedEvent, RowValueChangedEvent, StatusPanelDef } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { finalize, map, take } from 'rxjs/operators';
import { SimpleChanges } from '@angular/core';
//import { ApiClientService, Util } from '../../../core';
//import { FileService } from '../../../core/services/file.service';
import { CheckboxRenderer } from './checkbox-renderer.component';
import { BtnCellRenderer } from './button-cell-renderer.component';
import { LinkCellRenderer } from './link-cell-renderer.component';
import { BooleanRenderer } from './boolean-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YNBooleanRenderer } from './booleanyn-renderer.component';
import { CustomTooltip } from './tooltip.component';
import { MyColumn } from '../../index';


interface IVCol extends ColDef {
    Format?: string;
    Ctype?: string;
    StyleField?: string;
}

@Component({
    selector: 'my-datagrid',
    templateUrl: './aggrid.component.html'
})
export class MyAGGrid implements OnInit, OnChanges {
    @Input() id: string;
    @Input() columns: MyColumn[];
    @Input() data: any[];
    @Input() rowClass: string = "";
    @Input() rowIdentifier: string = "";
    @Input() filtername: string;
    @Input() Tools: string[] = ["Excel", "Refresh"];//Word, MyFilters, FloatingFilters
    @Output() rowClicked = new EventEmitter<object>();
    @Output() btnClicked = new EventEmitter<object>();

    vcolumns: any[];
    defdateformat: string = "dd-MMM-yyyy";
    rowData: any[];
    columnDefs: IVCol[];
    api: any;
    columnApi: any;
    changingColumns: boolean;
    floatfilter: boolean = true;
    rowCount: number = 0;
    statusBarComponent: any;

    config: { cols: any[], colstate: any, filters: any };
;
    constructor(
        private modalService: NgbModal,
        private datePipe: DatePipe,
    ) {
    }

    ngOnInit(): void {
        // this.columns = this.columns.filter(col => !col.hidden);
    }
    changeColumns(): void {
        this.columnDefs = this.columns?.map((col) => {
            let _col: IVCol = {
                field: col.variable,
                hide: col.hidden,
                type: "textColumn",
                sortable: col.sortable,
                editable: col.editable
            };
            switch (col.filter) {
                case "text":
                    _col.type = "textColumn";
                    _col.filter = col.filterable ?  "agTextColumnFilter" : "";

                    switch (col.format) {
                        case 'uppercase':
                            //_col.valueFormatter = this.formatUppercase
                            break;
                    }
                    break;
                case "number":
                    _col.type = "numberColumn";
                    _col.filter = col.filterable ? "agNumberColumnFilter" : "";
                    _col.cellClass = 'number-cell';
                    break;
                case "date":
                    _col.type = 'dateColumn';
                    _col.filter = col.filterable ? "agDateColumnFilter" : "";
                    _col.Format = col.format ? col.format : this.defdateformat;
                    break;
                case "boolean":
                    _col.cellRenderer = 'booleanRenderer';
                    _col.filter = col.filterable ? "agNumberColumnFilter" : "";
                    break;
                case "ynboolean":
                    _col.cellRenderer = 'ynbooleanRenderer';
                    _col.filter = col.filterable ?  "agTextColumnFilter" : "";
                    _col.valueFormatter = this.ynValueFormatter;
                    _col.filterParams = { valueFormatter: this.ynValueFormatter }
                    break;
                case "checkbox":
                    _col.cellRenderer = 'checkboxRenderer';
                    if (col.type == "sdelete") {
                        _col.Ctype = "sdelete";
                        _col.valueGetter = (params: any) => {
                            return params.data.$$delete;
                        }
                        _col.valueSetter = (params: any) => {
                            if (params.oldValue !== params.newValue) {
                                params.data.$$delete = params.newValue;
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        _col.comparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
                            let nA: boolean = nodeA.data?.$$nodelete;
                            let nB: boolean = nodeB.data?.$$nodelete;
                            if (nA == nB) return 0;
                            return (nA > nB) ? -1 : 1;
                            }
                    }
                    if (col.type == "sselect") {
                        _col.Ctype = "sselect";
                        _col.valueGetter = (params: any) => {
                            return params.data.$$selected;
                        }
                        _col.valueSetter = (params: any) => {
                            if (params.oldValue !== params.newValue) {
                                params.data.$$selected = params.newValue;
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        _col.comparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
                            let nA: boolean = nodeA.data?.$$selected;
                            let nB: boolean = nodeB.data?.$$selected;
                            if (nA == nB) return 0;
                            return (nA > nB) ? -1 : 1;
                        }
                    }
                    break;
                case "button":
                    _col.cellRenderer = 'btnCellRenderer';
                    _col.cellRendererParams = {
                        clicked: (btntype: string, data: any) => {
                            this.btnClicked.emit([data, btntype]);
                        },
                        type: col.type
                    }
                    col.width = 50;
                    col.minwidth = 50;
                    _col.resizable = false;
                    _col.suppressSizeToFit = true;
                    _col.enableRowGroup = false;
                    break;
                case "link":
                    _col.cellRenderer = 'linkCellRenderer';
                    _col.filter = col.filterable ? "agTextColumnFilter" : "";
                    _col.cellRendererParams = {
                        clicked: (linktype: string, data: any) => {
                            this.btnClicked.emit([data, linktype]);
                        },
                        type: col.type
                    }
                    break;
            }
            let header = col.display?.replace(/\<br\/?\>/ig, " ");
            _col.headerName = header;

            if (col.maxwidth) {
                //_col.suppressSizeToFit = true;
                _col.maxWidth = col.maxwidth;
            }
            if (col.autosize) {
                _col.suppressSizeToFit = false;
            }
            if (col.width) {
                _col.suppressSizeToFit = true;
                _col.width  = col.width;
            }
            if (col.minwidth) {
                //_col.suppressSizeToFit = true;
                _col.minWidth = col.minwidth;
            }
            return _col;
        });
    }
    changeData(): void {
        this.rowData = this.data;
        if (this.statusBarComponent) this.statusBarComponent.setCount(this.rowData.length);
    }
    onFilterChanged(event: FilterChangedEvent): void {
        this.rowData = this.data;
        if (this.statusBarComponent) this.statusBarComponent.setCount(this.rowData.length);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.columns) {
            this.changeColumns();
            this.changingColumns = true;
        }
        if (changes.data) this.changeData();
    }
    onGridReady(params: any): void {
        this.api = params.api;
        this.columnApi = params.columnApi;
        this.statusBarComponent = this.api.getStatusPanel(
            'statusBarCompKey'
        )!;
        this.onBtnFloatingFilters();
        let cols = this.api.getColumnDefs();
        let colstate = this.columnApi.getColumnState();
        let filters = this.api.getFilterModel();
        this.config = { cols: cols, colstate: colstate, filters: filters };
    }
    onFirstDataRendered(params: any): void {
        if (this.statusBarComponent) this.statusBarComponent.setCount(this.rowData.length);
        if (this.id) {
            const filterModel = localStorage.getItem(`${this.id}-filtering`)!;
            this.api.setFilterModel(JSON.parse(filterModel));
        }
        this.api.sizeColumnsToFit();
    }
    onColumnEverythingChanged(params: any): void {
        this.statusBarComponent?.setCount(this.rowData.length);
        if (this.id) {
            const filterModel = localStorage.getItem(`${this.id}-filtering`)!;
            this.api.setFilterModel(JSON.parse(filterModel));
        }
        this.api?.sizeColumnsToFit();
    }
    modelUpdated(params: any): void {
        if (this.changingColumns) {
            params.api.sizeColumnsToFit();
            this.changingColumns = false;
        }
    }
    // define a column type (you can define as many as you like)
    columnTypes : any = {
        nonEditableColumn: { editable: false },
        textColumn: { editable: false },
        numberColumn: { editable: false },
        dateColumn: {
            filter: 'agDateColumnFilter',
            valueFormatter: (params:any) => { return this.formatDate(params) },
            filterParams: { comparator: this.myDateComparator },
            //suppressMenu: true
        }
    };
    myDateComparator(mydate: Date, cellValue: string) {
        var dateAsString = cellValue;
        if (dateAsString == null) return -1;
        //var dateParts = dateAsString.split('/');
        var cellDate = new Date(dateAsString);
        if (mydate.getTime() === cellDate.getTime()) {
            return 0;
        }
        if (cellDate < mydate) {
            return -1;
        }
        if (cellDate > mydate) {
            return 1;
        }
        return 0;
    }
    frameworkComponents = {
        checkboxRenderer: CheckboxRenderer,
        btnCellRenderer: BtnCellRenderer,
        linkCellRenderer: LinkCellRenderer,
        booleanRenderer: BooleanRenderer,
        ynbooleanRenderer: YNBooleanRenderer,
        myToolTip: CustomTooltip
    };
    // a default column definition with properties that get applied to every column
    defaultColDef = {
        // set every column width
        width: 150, 
        minWidth:40,
        resizable: true,
        suppressSizeToFit: true,
        // allow every column to be grouped
        enableRowGroup: true,
        floatingFilter: this.floatfilter
    };
    statusBar: { statusPanels: StatusPanelDef[]; } = {
        statusPanels: [
            //{ statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agFilteredRowCountComponent', align: 'center' },
            { statusPanel: 'agTotalRowCountComponent', align: 'center' },
            //{ statusPanel: 'agSelectedRowCountComponent' },
            //{ statusPanel: 'agAggregationComponent' },
        ],
    };
    defaultSideBar = {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                    suppressRowGroups: false,
                    suppressValues: true,
                    suppressPivots: true,
                    suppressPivotMode: true,
                    suppressColumnFilter: true,
                    suppressColumnSelectAll: false,
                    suppressColumnExpandAll: false,
                },
                minWidth: 180,
                maxWidth: 400,
                width: 250
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
                minWidth: 180,
                maxWidth: 400,
                width: 250
            }
        ],
        defaultToolPanel: ''
    };
    rowClassRules = {
        // apply amber 
        'rag-warning': function (params: any) { return params.data?.$$dirty && !params.data.$$delete; },

        // apply red 
        'rag-danger': function (params: any) { return params.data?.$$delete; },

        // apply soft blue 
        'rag-info': function (params: any) { return params.data?.$$selected; }
    };
    cellClassRules = {
        // apply amber 
        'cag-warning': function (params: any) { return params.colDef.StyleField && params.data[params.colDef.StyleField] == 'amber'; },

        // apply red 
        'cag-danger': function (params: any) { return params.colDef.StyleField && params.data[params.colDef.StyleField] == 'red'; },

        // apply soft blue 
        'cag-info': function (params: any) { return params.colDef.StyleField && params.data[params.colDef.StyleField] == 'blue'; },

        // apply soft green 
        'cag-success': function (params: any) { return params.colDef.StyleField && params.data[params.colDef.StyleField] == 'green'; }
    };
    formatDate(params: any) {
        return params.value == null ? "" : this.datePipe.transform(params.value, params.colDef.Format ?? this.defdateformat);
    }
    formatUppercase(params: any) {
        return params.value == null ? "" : params.value.toUpperCase();
    }
    ynValueFormatter = (params: { value: any; }) => {
        let ynvalue = "";
        switch (params.value) {
            case 0:
            case "0":
            case false:
            case "N":
                ynvalue = 'No';
                break;
            case 1:
            case "1":
            case true:
            case "Y":
                ynvalue = 'Yes';
                break;
            default:
                ynvalue = 'Not Determined';

        }
        return ynvalue;
    };

    get_csv(): string[][] {
        let DataAsCsv: string = this.api.getDataAsCsv();
        //DataAsCsv = DataAsCsv.replace(/\u00BF/g, "\'");
        //DataAsCsv = DataAsCsv.replace(/\u00C7/g, "c");
        //DataAsCsv = DataAsCsv.replace(/\u00BD/g, "1/2");
        //DataAsCsv = DataAsCsv.replace(/\u215C/g, "3/8");

        let csvstrs: string[] = DataAsCsv.split("\r\n");
        let csvarr = csvstrs.map(str => str.substring(1, str.length - 1).split("\",\""));

        //for (var i = 0; i < csvarr.length; i++) {
        //    var csv = csvarr[i];
        //    for (var j = 0; j < csv.length; j++) {
        //        csv[j] = escape(csv[j]);
        //    }
        //}

        return csvarr;
    }
    get_visible_columns(): MyColumn[] {
        let viscols: Column[] = this.columnApi.getAllDisplayedColumns();
        let viscolids = viscols.map(c => c.getColId());
        let acols: MyColumn[] = [];
        viscolids.forEach(str => {
            let acol = this.columns.find(c => c.variable == str);
            if (acol) acols.push(acol);
        });
        return acols;
    }
    export_excel(): void {
        //let csv = this.get_csv();
        //let cols = this.get_visible_columns();
        //this.util.fileloading('reportfile', 'loading');
        //this.ApiClient.pPost("p1/Utility/ExcelFromCSV", {
        //    mode: 'afile', responseType: 'ArrayBuffer',
        //    _m: true,
        //}, { csv: csv, meta: this.metaheaders, columns: cols }).pipe(finalize(() => this.util.fileloading('aggridfile', 'notloading')), take(1),
        //    map(
        //        (res) => {
        //            let _res = res.body;
        //            let _filename = 'Export.xlsx';  //res.filename
        //            this.files.fileDownload(_res, _filename);
        //        })).subscribe();
    }
    export_csv(): void {
        this.api.exportDataAsCsv();
    }
    export_word(): void {
        //let csv = this.get_csv();
        //this.util.fileloading('reportfile', 'loading');
        //this.ApiClient.pPost("p1/Utility/WordFromCSV", {
        //    mode: 'afile', responseType: 'ArrayBuffer',
        //    _m: true,
        //}, { csv: csv, meta: this.metaheaders }).pipe(finalize(() => this.util.fileloading('aggridfile', 'notloading')) ,take(1),
        //    map(
        //        (res) => {
        //            let _res = res.body;
        //            let _filename = 'Export.docx';  //res.filename
        //            this.files.fileDownload(_res, _filename);
        //        })).subscribe();
    }

    onBtnMyFilters(): void {
    }
    onBtnExportExcel(): void {
        this.export_excel();
    }
    onBtnExportCSV(): void {
        this.export_csv();
    }
    onBtnExportWord(): void {
        this.export_word();
    }
    onBtnFloatingFilters(): void {
        this.floatfilter = !this.floatfilter;
       //this.defaultColDef.floatingFilter = this.floatfilter;
        this.columnDefs.forEach((colDef, index) => {
            colDef.floatingFilter = this.floatfilter;
        });
        this.api.setColumnDefs(this.columnDefs);
        this.api.refreshHeader();
    }
    onBtnRefresh(): void {

        this.columnDefs = this.config?.cols;
        this.columnApi.applyColumnState({ state: this.config?.colstate });
        this.api.setFilterModel(this.config?.filters);
        this.api.sizeColumnsToFit();
        this.rowData = this.data;
    }
    
    
    selectRow(node: RowNode) {
        console.log('on selectRow');
    }
    onRowSelected(event: RowSelectedEvent) {
        console.log('on RowSelectedEvent');
        event.data.$$rowselected = event.node.isSelected();
        this.rowClicked.emit(event.data);
    }
    onCellValueChanged(event: CellValueChangedEvent) {
        console.log('on CellValueChangedEvent');
        if (event.colDef["Ctype"] != "sdelete" && event.colDef["Ctype"] != "sselect")
            event.data.$$dirty = true;
        this.rowClicked.emit(event.data);
    }
    onCellEditingStopped(event: CellEditingStoppedEvent) {
        console.log('on CellEditingStoppedEvent');
        //this.api.redrawRows();
        //this.rowClicked.emit(event.data);
    }
    onRowValueChanged(event: RowValueChangedEvent) {
        console.log('on RowValueChangedEvent');
        var b = this.api.getEditingCells();
        //this.api.redrawRows([event.node]);
        //if (b.length > 0) {
        //    let _b = b[0];
        //    this.api.setFocusedCell(_b.rowIndex, _b.column.colId);
        //}
    }
}



export * from './components/login/login.component';
export * from './components/login/nauthed.component';
export * from './components/datagrid/datagrid.component';
export * from './components/datetime/datetime.component';
export * from './components/barcode/barcode.component';
export * from './components/pending-approve.component';
export * from './components/acknowledge.component';
//export * from './angular-editor.module';
//export * from './material.module';

export interface MyColumn{
    display?: string,
    variable?: string,
    sortable?:boolean,
    filter:string,
    maxwidth?:number,
    minwidth?:number,
    width?:number,
    type?:string,
    format?:string,
    hidden?:boolean,
    editable?:boolean,
    filterable?:boolean,
    autosize?:boolean
}
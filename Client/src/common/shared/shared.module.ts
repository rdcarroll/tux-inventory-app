import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { RouterModule } from '@angular/router';
//import { MatTableModule } from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomMaterialModule } from "./material.module";
//import { CustomAngularEditorModule } from "./angular-editor.module";


//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//import { library } from '@fortawesome/fontawesome-svg-core';
//library.add(fas, far);
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { HttpClientModule } from '@angular/common/http';
//import { AngularEditorModule } from '@kolkov/angular-editor';

import { LoginComponent } from './components/login/login.component';
import { NauthedComponent } from './components/login/nauthed.component';

import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { AlertComponent } from './components/alert.component';
import { JumboComponent } from './components/jumbo.component';
import { LoadingComponent } from './components/loading.component';
import { ThruOfComponent } from './components/thru-of.component';
import { Datagrid } from './components/datagrid/datagrid.component';
import { DateComponent } from './components/date/date.component';
import { DateTimeComponent } from './components/datetime/datetime.component';
import { DateCheckComponent } from './components/datecheck/datecheck.component';
import { TypeAheadComponent } from './components/typeahead/typeahead.component';
//import { MyChartComponent } from './components/chart/chart.component';
import { SearchComponent } from './components/search/search.component';
import { EditableComponent } from './components/editable/editable.component';
import { EditModeDirective } from './components/editable/editmode.directive';
import { ViewModeDirective } from './components/editable/viewmode.directive';
import { PendingApproveDialog } from './components/pending-approve.component';
import { AcknowledgeDialog } from './components/acknowledge.component';
import { sanitizeHtmlPipe } from './directives/sanitize-html.pipe';
import { MyFilterPipe } from './directives/my-filter.pipe';
import { HighlightSearch } from './directives/my-highlight.pipe';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MomentModule } from 'ngx-moment';
import { NotDoneComponent } from './components/login/notdone.component';
import { LogoutComponent } from './components/logout.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BackButtonComponent } from './components/backbutton/backbutton.component';
import { SaveQueryDirective } from './directives/save-query.directive';
import { AlertFixedComponent } from './components/alert-fixed.component';
//import { PopstateComponent } from './components/popstate.component';
// Import ngx-barcode module
import { NgxBarcode6Module } from 'ngx-barcode6';
import { MoneyComponent } from './components/money/money.component';
import { BarcodeComponent } from './components/barcode/barcode.component';
import { MyAGGrid } from './components/aggrid/aggrid.component';
import { BooleanRenderer } from './components/aggrid/boolean-renderer.component';
import { BtnCellRenderer } from './components/aggrid/button-cell-renderer.component';
import { CheckboxRenderer } from './components/aggrid/checkbox-renderer.component';
import { LinkCellRenderer } from './components/aggrid/link-cell-renderer.component';
import {AgGridModule} from 'ag-grid-angular';



@NgModule({
    imports: [
        FormsModule, // <-- import the FormsModule before binding with [(ngModel)],
        CommonModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        //CustomAngularEditorModule,
        HttpClientModule, 
        //AngularEditorModule,
        //MatTableModule,
        NgbModule,
        RouterModule,
        FontAwesomeModule,
        MomentModule,
        EditorModule,
        ScrollingModule,
        NgxBarcode6Module,
        AgGridModule
    ],
    declarations: [
        LoginComponent,
        LogoutComponent,
        NauthedComponent,
        NotDoneComponent,
        PhoneMaskDirective,
        AlertComponent,
        AlertFixedComponent,
        //PopstateComponent,
        JumboComponent,
        LoadingComponent,
        ThruOfComponent,
        Datagrid,
        DateComponent,
        DateTimeComponent,
        DateCheckComponent,
        TypeAheadComponent,
       // MyChartComponent,
        SearchComponent,
        EditableComponent,
        EditModeDirective,
        ViewModeDirective,
        SaveQueryDirective,
        MyFilterPipe,
        HighlightSearch,
        sanitizeHtmlPipe,
        PendingApproveDialog,
        AcknowledgeDialog,
        BackButtonComponent,
        MoneyComponent,
        BarcodeComponent,
        MyAGGrid,
        BooleanRenderer,
        BtnCellRenderer,
        CheckboxRenderer,
        LinkCellRenderer,
    ],
    providers: [
        DatePipe,
        CurrencyPipe,
        { provide: TINYMCE_SCRIPT_SRC, useValue: 'dist/tinymce/tinymce.min.js' }
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        LoginComponent,
        LogoutComponent,
        NauthedComponent,
        PhoneMaskDirective,
        SaveQueryDirective,
        AlertComponent,
        AlertFixedComponent,
        //PopstateComponent,
        JumboComponent,
        LoadingComponent,
        ThruOfComponent,
        Datagrid,
        DateComponent,
        DateTimeComponent,
        DateCheckComponent,
        TypeAheadComponent,
       // MyChartComponent,
        SearchComponent,
        PendingApproveDialog,
        MyFilterPipe,
        HighlightSearch,
        sanitizeHtmlPipe,
        ReactiveFormsModule,
        CustomMaterialModule,
        //CustomAngularEditorModule,
        //MatTableModule,
        NgbModule,
        MomentModule,

        FontAwesomeModule,
        ScrollingModule,
        BackButtonComponent,
        NgxBarcode6Module,
        MoneyComponent,
        BarcodeComponent,
        MyAGGrid,
        BooleanRenderer,
        BtnCellRenderer,
        CheckboxRenderer,
        LinkCellRenderer,
    ],
    //entryComponents: [PendingApproveDialog, AcknowledgeDialog]
})
export class SharedModule {
constructor(library: FaIconLibrary) {
    library.addIconPacks(fas,far);
} }
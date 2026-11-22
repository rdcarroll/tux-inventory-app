import { Component, Output, EventEmitter, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'my-filtermodal',
    template: `<div class="modal-header">
    <h4 class="modal-title" id="modal-title">My Filters</h4>
    <button type="button" class="close" (click)="dismiss()">
        <span aria-hidden="true">&times;</span>
    </button>
</div>



<div class="modal-body">
   <my-savefilter [reportname]='reportname' [config]='config' (profileChange)='changeFilter($event)'></my-savefilter>
</div>
`
})
export class FilterModalComponent implements OnInit, OnDestroy {
    reportname: string;
    config: any;
    @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();

    constructor( private activeModal: NgbActiveModal) {
    }

    dismiss() {
        this.activeModal.dismiss();
    }
    loadFilter(filtername: string, config:any) {
        this.reportname = filtername;
        this.config = config;
    }
    changeFilter(json: any) {
        this.filterChange.emit(json);
    }
    ngOnInit() {
    }
    ngOnDestroy() {

    }
}
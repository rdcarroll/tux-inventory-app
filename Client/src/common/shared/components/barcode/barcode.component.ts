
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'my-barcode',
    templateUrl: './barcode.component.html'
})
export class BarcodeComponent implements OnInit, OnDestroy   {
    @Input() barcode: string="";
    @Input() readOnly: any;
    @Input() required = false;
    @Input() id: string;
    @Input() name: string;
    @Input() placeholder: string = "scan or type";
    @Output() barcodeChange = new EventEmitter<string>();
    @Output() scanChange = new EventEmitter<{ barcode: string; scanned: boolean; }>();
    subject: Subject<any> = new Subject();
   keyDownTime:Date;
   scanned:boolean=false;
    constructor() {
        this.id = this.id || "test";
        this.name = this.name || "test";
    }

    onKeydown(e: any) {
        this.subject.next(this.barcode);
        this.keyDownTime = new Date();
    }
    onKeyup(e: any) {
        var now = new Date();
        const keycode = e.keyCode || e.which;
        var diff = now.getTime() - this.keyDownTime.getTime();
        this.scanned = diff < 20 || keycode==13;
    }
    ngOnInit() {   
        if(null==this.barcode)this.barcode="";  
        var that = this; 
        this.subject
        .pipe(debounceTime(500))
        .subscribe((val) => {
            that.barcodeChange.emit(that.barcode);
            that.scanChange.emit({barcode:that.barcode,scanned:that.scanned});
        });
    }
    ngOnDestroy() {
        this.subject.unsubscribe();
    }
}


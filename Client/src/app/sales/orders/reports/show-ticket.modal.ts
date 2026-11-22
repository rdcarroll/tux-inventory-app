import { Component, Inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ApiClientService, DownloadService, Util } from '../../../../common/core';
import { forkJoin, Observable } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';

export interface DialogData{
    id:number
}

@Component({
    selector: 'show-ticket-dialog',
    template: '<div class="p-4">Loading Order...Please Wait</div><ticket-print [hidden]="true" [id]="id" (action)="complete($event)"></ticket-print>'
})
export class ShowTicketDialog {

    id: string;
    order: any;

    constructor(
        private ApiClient: ApiClientService,
        private download: DownloadService,
       public dialogRef: MatDialogRef<ShowTicketDialog>,
       @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        this.id = data.id.toString();
     }


    complete(isloaded:boolean): void {
        if(isloaded){
            let myhtml = $('#ticketorder')[0].outerHTML;
            if(myhtml.length>0){
                this.download.printToBrowser("test",myhtml);
                this.dialogRef.close();
            }
        }
        else{
            this.dialogRef.close();
        }
    }
    
}
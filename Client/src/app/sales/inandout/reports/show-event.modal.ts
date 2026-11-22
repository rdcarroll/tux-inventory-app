import { Component, Inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

import { ApiClientService, DownloadService, Util } from '../../../../common/core';
import { forkJoin, Observable } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EDialogData{
    id:number,
    mode:string
}

@Component({
    selector: 'show-event-dialog',
    template: '<div class="p-4">Loading Order...Please Wait</div><event-print [hidden]="true" [id]="id" [mode]="mode" (action)="complete($event)"></event-print>'
})
export class ShowEventDialog {

    id: number;
    order: any;
    mode: string;

    constructor(
        private ApiClient: ApiClientService,
        private download: DownloadService,
       public dialogRef: MatDialogRef<ShowEventDialog>,
       @Inject(MAT_DIALOG_DATA) public data: EDialogData
    ) {
        this.id = data.id;
        this.mode = data.mode;
     }


    complete(isloaded:boolean): void {
        if(isloaded){
            let myhtml = $('#itemevent')[0].outerHTML;
            if(myhtml.length>0){
                this.download.printToBrowser(`${this.mode} report`,myhtml);
                this.dialogRef.close();
            }
        }
        else{
            this.dialogRef.close();
        }
    }
    
}
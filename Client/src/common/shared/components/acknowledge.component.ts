import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-pending-approve',
    template: `<div class='text-center'>
                <div mat-dialog-content>
                  <p>{{data.msg}}</p>
                </div>
                <div mat-dialog-actions>
                  <button type="button" class="btn btn-success"  mat-dialog-close="true" >OK</button>
                  <button type="button" class="btn btn-primary" (click)="onNoClick()">Cancel</button>
                </div>
              </div>`
})
export class AcknowledgeDialog {

    constructor(
        public dialogRef: MatDialogRef<AcknowledgeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: ADialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

export interface ADialogData {
    msg: string;
}
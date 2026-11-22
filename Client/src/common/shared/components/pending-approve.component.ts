import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';

@Component({
    selector: 'dialog-pending-approve',
    template: `<div class='text-center'>
                <div mat-dialog-content>
                  <p>{{data.msg}}</p>
                    <textarea [(ngModel)]="data.reason" style="min-width: 100%" rows=4 required></textarea>
                </div>
                <div mat-dialog-actions>
                  <button type="button" class="btn btn-success" [mat-dialog-close]="data.reason" >Save</button>
                  <button type="button" class="btn btn-primary" (click)="onNoClick()">Cancel</button>
                </div>
              </div>`
})
export class PendingApproveDialog {

    constructor(
        public dialogRef: MatDialogRef<PendingApproveDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}

export interface DialogData {
    msg: string;
    reason: string;
}
import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: 'checkbox-renderer',
  template: `
    <input 
      type="checkbox" 
      (click)="checkedHandler($event)"
      [checked]="params.value"
      [attr.disabled]="isDisabled ? true : null"
    />
`,
})
export class CheckboxRenderer implements AgRendererComponent {
    params: ICellRendererParams;
    isDisabled: boolean;

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.isDisabled = this.params.data?.$$nodelete;
    }
    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        // set value into cell again
        this.params = params;
        this.isDisabled = this.params.data?.$$nodelete;
        return true;
    }

    checkedHandler(event: any) {
        let checked = event.target.checked;
        let col = this.params.column!;
        this.params.node.setDataValue(col, checked);
    }
    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}

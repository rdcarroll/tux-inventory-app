import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from "ag-grid-community";


@Component({
    selector: 'link-cell-renderer',
    template: `
        <button type="button" class="btn btn-link p-0" (click)="btnClickedHandler($event);$event.stopPropagation();">{{cellValue}}</button>
    `,
})
export class LinkCellRenderer implements AgRendererComponent {
    params: any;
    linktype: string = 'link';
    isDisabled: boolean;
    public cellValue: string;

    // gets called once before the renderer is used
    agInit(params: any): void {
        this.params = params;
        this.linktype = this.params.type || 'link';
        this.cellValue = this.params.value;
    }
    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        // set value into cell again
        this.params = params;
        this.isDisabled = this.params.data?.$$nodelete;
        return true;
    }

    btnClickedHandler(evt: any) {
        this.params.clicked(this.linktype, this.params.data);
    }
}

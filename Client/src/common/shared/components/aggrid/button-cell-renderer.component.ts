import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from "ag-grid-community";

export interface IVCRP extends ICellRendererParams {
    type?:string,
    clicked? : any
}

@Component({
  selector: 'btn-cell-renderer',
    template: `
        <span *ngIf='doshow' (click)="btnClickedHandler($event);$event.stopPropagation();" style="cursor:pointer;">
        <fa-icon [icon]="['fas', btnicon]" [class]="btnclass" size="xs" [title]="btntext"></fa-icon>
        </span>
    `,
})
export class BtnCellRenderer implements AgRendererComponent {
    params: IVCRP;
    isDisabled: boolean;
    btntype: string = 'view';
    btnicon: string = 'edit';
    btnclass: string = 'text-info';
    btntext: string = 'Edit';
    doshow: boolean = false;

    // gets called once before the renderer is used
    agInit(params: any): void|null {
        if (!params.data) return null;
        this.doshow = true;
        this.params = params;
        this.btntype = this.params.type || 'view';
        switch (this.btntype) {
            case 'edit':
                this.btnicon = 'edit';
                this.btnclass = 'text-info';
                this.btntext = 'Edit';
                break;
            case 'view':
                this.btnicon = 'eye';
                this.btnclass = 'text-primary';
                this.btntext = 'View';
                break;
            case 'delete':
                this.btnicon = 'trash-alt';
                this.btnclass = 'text-danger';
                this.btntext = 'Delete';
                break;
        }
    }
    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        // set value into cell again
        this.params = params;
        this.isDisabled = this.params.data?.$$nodelete;
        return true;
    }

    btnClickedHandler(evt: any) {
        this.params.clicked(this.btntype, this.params.data);
    }
}

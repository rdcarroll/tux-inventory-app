import { Component, OnDestroy } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from "ag-grid-community";


//<span * ngSwitchCase="'boolean'" >
//    <fa-icon * ngIf="row[col.variable]"[icon] = "['fas', 'check']" class="text-success" size = "xs" > </fa-icon>
//        < fa - icon * ngIf="!row[col.variable]"[icon] = "['fas', 'times']" class="text-danger" size = "xs" > </fa-icon>
// < /span>

@Component({
    selector: 'booleanyn-renderer',
    template: `
        <span *ngIf='doshow'>
        {{booltext}}
        </span>
`,
})
export class YNBooleanRenderer implements AgRendererComponent {

    params: ICellRendererParams;
    booltext: string = 'True';
    doshow: boolean = false;

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void|null{
        if (!params.data && !params.colDef?.showRowGroup) return null;
        this.doshow = true;
        this.params = params;
        //this.params.value = params.value ?? 0;
        switch (this.params.value) {
            case 0:
            case "0":
            case false:
            case "N":
                this.booltext = 'No';
                break;
            case 1:
            case"1":
            case true:
            case "Y":
                this.booltext = 'Yes';
                break;
            default:
                this.booltext = 'Not Determined';

        }
    }
    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        // set value into cell again
        this.params = params;
        return true;
    }

    ngOnDestroy() {
        // no need to remove the button click handler 
        // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
    }
}

import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
    selector: 'tooltip-component',
    template: ` <div class="custom-tooltip" [style.background-color]="color">
                    <p>
                      <span>{{ cellValue }}</span>
                    </p>
                  </div>`,
    styles: [
        `
      :host {
        position: absolute;
        width: 150px;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
    ],
       // height: 70px;
       // white-space: nowrap;
})
export class CustomTooltip implements ITooltipAngularComp {
    private params!: { color: string } & ITooltipParams;
    public cellValue!: string;
    public color!: string;

    agInit(params: { color: string } & ITooltipParams): void {
        this.params = params;
        this.cellValue = this.params.value;
        this.color = this.params.color || '#AED6F1';
    }
}
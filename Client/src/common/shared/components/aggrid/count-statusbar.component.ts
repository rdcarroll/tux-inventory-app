import { Component } from '@angular/core';
import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelComp, IStatusPanelParams } from 'ag-grid-community';

export interface IStatusBar {
    setCount(count:number): void;
}

@Component({
    selector: 'status-component',
    template: `
    <div class="ag-status-name-value">
      <span>Row Count &nbsp;:</span>
      <span class="ag-status-name-value-value">{{ count }}</span>
    </div>
  `,
})
export class CountStatusBarComponent implements IStatusPanelAngularComp, IStatusBar {
    private params!: IStatusPanelParams;
    public count: number | null = null;

    agInit(params: IStatusPanelParams): void {
        this.params = params;
    }

    setCount(count: number) {
        this.count = count;
    }
}
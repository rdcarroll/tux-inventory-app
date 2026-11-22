import { Component, Input } from '@angular/core';
//import * as root from '../../globals';
import * as root from '../../../environments/environment';

@Component({
    selector: 'app-jumbo',
    template: `
        <div class="ettp-jumbo jumbotron not-round d-none d-md-block d-print-none hide-on-print" [ngClass]="{'unset-bottom': unsetBottom}">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <img class="mr-auto" src="{{assetPath}}images/CorpLog2.jpg" style="height:80px;padding: 0px 0px 20px 0px;"/>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3>{{customTitle}}</h3>
                    </div>
                    <div class="col-md-4">
                        <my-logout class="float-end"></my-logout>
                        <a class="btn btn-light float-end"  routerLink="/landing"><fa-icon [icon]="['fas', 'home']"></fa-icon> Home</a>
                    </div>
                </div>
            </div>
        </div>
        <app-alert-fixed></app-alert-fixed>
    `
})

export class JumboComponent {
    @Input() customTitle: string;
    @Input() unsetBottom: boolean;

    assetPath: string;
    constructor() {
        this.assetPath = root.assetpath;
    }

    ngOnInit() {
    }

}

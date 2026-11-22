import { Component, OnInit } from '@angular/core';
//import * as root from '../../../globals';
import * as root from '../../../../environments/environment';

@Component({
    selector: 'my-nauthed',
    templateUrl: './nauthed.component.html'
})

export class NauthedComponent implements OnInit {
    link: string;
    title = `Unauthorized to use ${root.appname}`;
    constructor() {}


    ngOnInit() {
        this.link = "/login"; 
    }
}

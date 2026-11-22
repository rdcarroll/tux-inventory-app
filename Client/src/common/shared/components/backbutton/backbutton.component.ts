
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from '../../../core';


@Component({
    selector: 'my-backbutton',
    templateUrl: './backbutton.component.html'
})
export class BackButtonComponent implements OnInit  {
    @Input() link: string[];
    @Input() text: string = 'Back';
    @Input() ngclass: string = 'btn btn-outline-secondary';
    backto: any;

    constructor(private router: Router, private util: Util) {
    }

    onClick(): void {
        this.router.navigate(this.link, { queryParams: this.backto });
    }
    ngOnInit(): void {
        this.backto = this.util.getData('backto') || {}; //object
    }

}


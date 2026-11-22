import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Util } from '../../core';

@Component({
    selector: 'app-alert',
    template: `
        <div class= "container"  id = "alert-layer">
            <div class="row" *ngFor="let message of messages">
                <div class="col-md">
                    <div [ngClass]="{ 'alert': message, 'alert-success': message.atype === 'success', 'alert-danger': message.atype === 'error', 'alert-warning': message.atype === 'warning'  }" >
<div *ngIf="message.css?.icon == 'check'" class="float-start" style="margin-right:5px;"><fa-icon  [icon]="['far', 'check-square']"></fa-icon></div>
<div *ngIf="message.css?.icon == 'arrow-up'" class="float-start" style="margin-right:5px;"><fa-icon  [icon]="['fas', 'arrow-up']"></fa-icon></div>
<div *ngIf="message.css?.icon == 'lightbulb'" class="float-start" style="margin-right:5px;"><fa-icon  [icon]="['far', 'lightbulb']"></fa-icon></div>
<div *ngIf="message.css?.icon == 'exclamation'" class="float-start" style="margin-right:5px;"><fa-icon  [icon]="['fas', 'exclamation-triangle']"></fa-icon></div>
                    <button type='button' class='btn-close float-end' (click)='btnClick(message)'></button>
                    <div [innerHTML]="message.msg"></div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    messages: Array<any> = [];

    constructor(private alertService: Util) { }

    btnClick(message: any): void {
        this.messages = this.messages.filter(item => item !== message);
    }

    ngOnInit() {
        this.subscription = this.alertService.getAlertMessage().subscribe(message => {
            if (!message.fixed) {
                if (message.atype === 'cancel') {
                    this.messages.length = 0;
                }
                else {
                    this.messages.push(message);
                    if (!message.persist) {
                        setTimeout(() => this.messages = this.messages.filter(item => item !== message), 4000);
                    }
                }
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

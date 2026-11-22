import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecurityService, CurrentUser } from '../../core';

@Component({
    selector: 'my-logout',
    template: `<div ngbDropdown *ngIf="user" style="margin-left:15px;">
                    <button class="btn btn-light dropdown-toggle" id="navbarDropdown" ngbDropdownToggle>
                        <fa-icon [icon]="['fas', 'sign-out-alt']"></fa-icon> {{user?.FullName?.substring(0,15) || user.UserId || "not logged in"}}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown" ngbDropdownMenu>
                        <button class="dropdown-item" (click)="logOut()" ngbDropdownItem>Logout</button>
                    </div>
               </div>`

        //< div class= 'loading' * ngIf='show'> <div class='center'> <fa-icon[icon]=\"['fas', 'circle-notch']\" [spin]=\"true\" class=\"ettp-text-primary\" size=\"8x\"></fa-icon></div></div>"
})

export class LogoutComponent implements OnInit, OnDestroy {
    user: CurrentUser|null;

    constructor(private security: SecurityService) { }

    logOut() {
        this.user = null;
        this.security.logout();
    }

    ngOnInit() {
        this.user = this.security.getUser();
    }

    ngOnDestroy() {
    }
}

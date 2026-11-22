import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SecurityService } from './security.service';
import { Util } from '..';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private router: Router, private security: SecurityService, private util: Util) { }

    canActivate() {
        if (this.security.hasAccess(this.security.Access.Admin)
        ) {
            return true;
        }
        this.router.navigate(['/landing']);
        this.util.alert("warning", "You do not have the appropriate level of access for this area. Admin required.", false, { icon: 'exclamation' }, true);
        return false;
    }
}
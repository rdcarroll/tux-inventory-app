import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SecurityService } from './security.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private security: SecurityService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.security.isAuthenticated()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url, unless it's /landing
        // this should only happen once since you will be logged in thereafter
        let _returnUrl = this.security.setReturnUrl(state.url); 
        this.router.navigate(['/login'], { queryParams: { returnUrl: _returnUrl } });
        return false;
    }
}
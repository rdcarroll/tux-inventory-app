import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { CurrentUser } from '../app';
import { ApiClientService } from '../services/api-client.service';
import { take } from 'rxjs/operators';

@Injectable()
export class SecurityService {
    constructor(private http: HttpClient, private ApiClient: ApiClientService ) { }

    private userSubject = new Subject<CurrentUser|null>();
    private authZSubject = new Subject<object>();
    private returnUrl: string;

    getUser(): CurrentUser{
        let user = sessionStorage.getItem('currentUser');
        let value = user ? JSON.parse(user) : null;
        var cu: CurrentUser = typeof value === 'object' ? value : null;
        if(cu?.LastName) cu.FullName=`${cu.FirstName} ${cu.LastName}`;
        return cu;
    }
    getReturnUrl(): string {
        return this.returnUrl;
    }
    setReturnUrl(stateUrl: string): string {
        //let t = stateUrl == "/landing" ? "" : stateUrl;
        this.returnUrl = this.returnUrl ?? stateUrl;
        return this.returnUrl;
    }
    getUserMessage(): Observable<any> {
        return this.userSubject.asObservable();
    }
    getAuthzMessage(): Observable<any> {
        return this.authZSubject.asObservable();
    }

    authN(creds:any, returnUrl: string): void {
        this.returnUrl = returnUrl;
        
        let body = new URLSearchParams();
        body.set('username', creds.uid);
        body.set('password', creds.pwd);
        body.set('grant_type',"password");
        body.set('client_id',"asdf");
        body.set('client_secret',"asdf");

        let options = {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };
        this.http.post('/auth/login', body.toString(), options).subscribe({
            next: (user: any) => {
                if (user) {
                    // store user details and token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.userSubject.next(user);
                } else {
                    this.userSubject.next(null);
                }
            },
            error: (err) => {
                this.userSubject.next(null);
            }
        });
    }
    authZ() {
        this.ApiClient.pGet("Employees/Me", {}).pipe(take(1))
            .subscribe(res => {
                let roleId: number = 0;
                //if (res.ActiveFlag) roleId += this.Access.User;
                if (res.UserName) roleId += this.Access.User;
                if (res.IsAdmin) roleId += this.Access.Admin;
                if (res.IsSuperAdmin) roleId += this.Access.SuperAdmin;
                res.role_id = roleId;
                let cu =  this.getUser();
                // store user details and token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('currentUser', JSON.stringify(Object.assign({}, cu, res)) );
                this.authZSubject.next({ success: roleId > 0 });
            }, (err) => {
                this.authZSubject.next({ success: false });
            });
    }

    isAuthenticated() {
        if (sessionStorage.getItem('currentUser')) {
            // logged in so return true 
            return true;
        }
        return false;
    }

    Access = {
        User: 1,
        Admin: 2,
        SuperAdmin: 4
    }

    hasAccess(node: number): boolean {
        let user = this.getUser();
        let roleId: number = user ? user.role_id : 0;
        return (roleId & node) == node;
    }

    logout():void {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.userSubject.next(null);
    }
    
    requestPasswordReset(userid:string):Observable<any> {
        return this.http.post('/auth/requestreset', {UserName:userid});
    }
}
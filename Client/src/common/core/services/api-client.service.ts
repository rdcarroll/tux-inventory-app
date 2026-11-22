
import {of as observableOf,  Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, retryWhen, tap } from "rxjs/operators";
import {  HttpClient } from '@angular/common/http';

@Injectable()
export class ApiClientService {

    private defaultMode = '../api';  // default api base
    private defaultResponseType = 'Json';
    private defaultHeaders:any = { 'Content-Type': 'application/json' };
    private defaultCache = false;
    private observable: Observable<any>;


    constructor(private http: HttpClient) { }

    pGet(url: string, params: any): Observable<any> {
        var options: ApiOptions = {
            method: "GET",
            mode: params.mode || this.defaultMode,
            responseType: params.responseType || this.defaultResponseType,
            url: this.urlBuilder(url, params),
            headers: {},
            body: {},
            cache: params.cache || this.defaultCache
        }
        return this.request(options);
    }
    pPost(url: string, params: any, body: any): Observable<any> {
        var options: ApiOptions = {
            method: "POST",
            mode: params.mode || this.defaultMode,
            responseType: params.responseType || this.defaultResponseType,
            url: this.urlBuilder(url, params),
            headers: {},
            body: body || {},
            cache: params.cache || this.defaultCache
        }
        return this.request(options);
    }
    pPut(url: string, params: any, body: any): Observable<any> {
        var options: ApiOptions = {
            method: "PUT",
            mode: params.mode || this.defaultMode,
            responseType: params.responseType || this.defaultResponseType,
            url: this.urlBuilder(url, params),
            headers: {},
            body: body || {},
            cache: params.cache || this.defaultCache
        }
        return this.request(options);
    }
    pPatch(url: string, params: any, body: any): Observable<any> {
        var options: ApiOptions = {
            method: "PATCH",
            mode: params.mode || this.defaultMode,
            responseType: params.responseType || this.defaultResponseType,
            url: this.urlBuilder(url, params),
            headers: {},
            body: body || {},
            cache: params.cache || this.defaultCache
        }
        return this.request(options);
    }
    pRemove(url: string, params: any, body?: any): Observable<any> {
        var options: ApiOptions = {
            method: "DELETE",
            mode: params.mode || this.defaultMode,
            responseType: params.responseType || this.defaultResponseType,
            url: this.urlBuilder(url, params),
            headers: {},
            body: body || {},
            cache: params.cache || this.defaultCache
        }
        return this.request(options);
    }

    private urlBuilder(url: string, params: any): string {
        let avoidlist = ['mode', 'responseType'];
        var q:string[] = [];
        for (let key in params) {
            if (key=='include' || key=='qf') q.push(key + "=" + JSON.stringify(params[key]));
            else if (avoidlist.indexOf(key) < 0) q.push(key + "=" + encodeURIComponent(params[key]));
        }
        if (q.length > 0) url += "?" + q.join("&");
        return url;
    }

    private request(options: ApiOptions): Observable<any> {

        let cu = JSON.parse(sessionStorage.getItem('currentUser')??"");
        //let authheader = {'Authorization':`${cu.token_type} ${cu.access_token}`};
        let authheader = {'Authorization':`Bearer ${cu.access_token}`};
        options.headers = Object.assign(this.defaultHeaders, authheader, options.headers || {})
        if (options.cache && options.cache === true) {
            if (sessionStorage.getItem(encodeURIComponent(options.url)) != null) {
                return observableOf(JSON.parse(sessionStorage.getItem(encodeURIComponent(options.url))!));
            }
        }

        let _options:any = {
            body: options.body,
            headers: options.headers,
            observe: 'response',
            responseType: "json"
        }
        if (options.responseType == 'ArrayBuffer') _options.responseType = "blob";
        let count = 0;
        this.observable = this.http.request<Response>(options.method, `${options.mode}/${options.url}`, _options)
            .pipe(
                retryWhen(errors =>
                    errors.pipe(
                        tap(err => {
                            count++;
                            //retry the oracle timeout error up to 3 times
                            if (count >= 3 || (typeof err.error.indexOf != 'function' || (err.error.indexOf('ORA-02396') < 0 && err.error.indexOf('ORA-01012') < 0))) {
                                throw err;
                            }
                            console.log('Retrying...');
                        })
                    )
                ),
                map((res:any) => {
                    this.observable = new Observable<any>;
                    if (options.cache && options.cache === true) {
                        sessionStorage.setItem(encodeURIComponent(options.url), JSON.stringify(res.body));
                    }
                    try {
                        if (options.responseType == 'ArrayBuffer') return res.body;
                        return res.body;
                    }
                    catch (e) {

                        return "";
                    }
                })
            )
            
        return this.observable;
    }
}

export interface ApiOptions {
    url: string;
    method: string;
    body?: any;
    headers?: any;
    mode?: string;
    responseType?: string;
    cache?: boolean;
}
export interface OdataParms {
    qs?: string;
    me?: boolean;
    $top?: number;
    $skip?: number;
    $count?: boolean;
    $orderby?: string;
    $filter?: string;
    $select?: string;
    $expand?: string;
    cache?: boolean;
}
export interface APIParms {
    q?: string;
    qf?: string[];
    Search?: string;
    include?: any[];
    filter?: string;
    pageSize?: number;
    page?: number;
    count?: boolean;
    orderby?: string;
    cache?: boolean;
}

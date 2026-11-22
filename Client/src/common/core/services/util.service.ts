import {  Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { setTimeout } from 'timers';
import * as root from '../../../environments/environment';

@Injectable()
export class Util {
    private alertSubject = new Subject<any>();
    private loadingSubject = new Subject<any>();
    private data: { [key: string]: any };
    private maxpageSize: number = Math.pow(2, 31) - 1;
    private pageSize: number = 20;

    constructor() {
        this.data = {};
    }

    PageSize(): number {
        return this.pageSize;
    }
    MaxPageSize(): number {
        return this.maxpageSize;
    }
    setData(key: string, data: any) {
        this.data[key] = data;
        //this.dataChangeObserver.next(this.data);
    }
    getData(key: string) : any {
        return this.data[key] || null;
        //this.dataChangeObserver.next(this.data);
    }
    setCache(key: string, data: any) {
        sessionStorage.setItem(key, data);
    }
    getCache(key: string): any {
        sessionStorage.getItem(key);
    }
    removeCache(key: string): any {
        sessionStorage.removeItem(key);
    }

    getAlertMessage(): Observable<any> {
        return this.alertSubject.asObservable();
    }
    getLoadingMessage(): Observable<any> {
        return this.loadingSubject.asObservable();
    }
    isEmpty(value: any) {
        return (!value || 0 === value.length);
    }
    pad(n: any, width?: number, z?: string): string {
        z = z || '0';
        width = width || 6;
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    cleanObject(obj: any, strip?: boolean): any {
        var _obj = {};
        var keys = Object.keys(obj).filter(function (key) {
            return typeof obj[key] !== 'function' && key.indexOf('$') !== 0;
        });
        for (var key of keys) {
            if (!strip || !(obj[key] instanceof Object)) _obj[key] = obj[key];
        }
        return _obj;   
    }
    cleanArray(objs: any[], strip?: boolean): any[] {
        let a = 0;
        for (let obj of objs) {
            objs[a] = this.cleanObject(obj, strip);
            a++;
        }
        return objs;
    }

    excerpt(mtext: string, search: string, radius?: number): string {
        radius = radius || 50;
        mtext = mtext || "";
        let _mtext = "";
        var inx = mtext.toLowerCase().indexOf(search.toLowerCase());
        if (inx >= 0) {
            var radius_left = radius > inx ? inx : radius;
            var radius_right = radius > mtext.length - (inx + search.length) ? mtext.length - (inx + search.length) : radius;
            let start = inx - radius_left;
            let addto = radius_left + search.length + radius_right;
            _mtext = (radius_left > 3 ? "..." : "") + mtext.substr(start, addto) + (radius_right > 3 ? "..." : "");

        }
        return _mtext;
    }

    alert(atype: string, msg: string, persist: boolean, css?: any, fixed?: boolean) {
        this.alertSubject.next({
            atype: atype,
            msg: msg,
            persist: persist,
            css: css,
            fixed: fixed
        });
    }
    alertcancel(fixed: boolean) {
        this.alertSubject.next({
            atype: 'cancel',
            fixed: fixed
        });
    }

    handleError(ex: any, cause: any, fixed?: boolean) {

        var msg = (cause || "ERROR") + " : ";
        try {
            //var ex = JSON.parse(JSON.parse(ex._body));
            if (ex.error) {
                if (typeof ex.error == "string") {
                    msg += ex.error + "</br>";
                }
                else if (typeof ex.error.error == "string") {
                    msg += ex.error.error + "</br>";
                }
                
                else if (typeof ex.message == "string") {
                    msg += ex.message + "</br>";
                }
                else {
                    if (ex.error.message) msg += ex.error.message;
                    if (ex.error.innererror && typeof ex.error.innererror.message === "string") msg += ex.error.innererror.message;
                }
            }
            else if (ex.value) {
                if (typeof ex.value == "string") {
                    msg += ex.value + "</br>";
                }
                else {
                    for (var i = 0; i < ex.value.length; i++) {
                        msg += ex.value[i].Message + "</br>";
                    }
                }
            }
            else msg += ex;
        }
        catch {

        }
        msg = msg.replace("[object]", "");

        this.alertSubject.next({
            atype: "error",
            msg: msg,
            persist: true,
            css: null,
            fixed: fixed
        });
    }

    private loadingTimmers: NodeJS.Timeout[]=[];
    loading(isLoading: boolean, opts: any) {
        this.loadingSubject.next(isLoading)
        //let timeout = opts && opts.timeout ? opts.timeout : 0;
        //if (isLoading) {
        //    this.loadingTimmers.push(setTimeout(() => {
        //        this.loadingSubject.next(isLoading)
        //    }, timeout));
        //}
        //else {
        //    if (this.loadingTimmers.length > 0) {
        //        this.loadingSubject.next(isLoading);
        //        var firstElement = this.loadingTimmers.shift();
        //        clearTimeout(firstElement);
        //        firstElement = null;
        //    }
        //}
    }
}
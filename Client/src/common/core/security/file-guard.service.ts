import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FileService } from '../services/file.service';
import { ApiClientService } from '../services/api-client.service';
import { take, map, finalize } from 'rxjs/operators';
import { Util } from '..';
import { Observable } from 'rxjs';

enum API_ROUTES {
    IMPORT_TEMPLATE = "/reports/staffing_plan_template_export.xlsx"
}

@Injectable()
export class FileGuard implements CanActivate {

    constructor(private router: Router, private files: FileService,
        private util: Util, private ApiClient: ApiClientService) { }
    private observable: Observable<any>;

    private IMPORT_TEMPLATE(uri: string): Observable<any>{
        let wbs_id = /wbs_id=([^&]+)/.test(uri) ? uri.match(/wbs_id=([^&]+)/)![1] : "undefined";
        return this.ApiClient.pPost(`Wbs/${wbs_id}/TemplateFile`, { responseType: 'ArrayBuffer' }, { wbs_id: wbs_id }).pipe(take(1),
            map(
                (res) => {
                    this.files.fileDownload(res, 'staffing_plan_data_export.xlsx');
                }));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        try {
        let uri = state.url;
        let path = uri.replace(/\?.*/, '');
        //catch paths with API Controllers
        switch (path) {
            case API_ROUTES.IMPORT_TEMPLATE:
                this.observable = this.IMPORT_TEMPLATE(uri);
                break;
            
            default:
                this.files.fileFromPath(path);
        }
            this.util.loading(true, null); //can add any file downloading events here
            this.observable.pipe(finalize(() => this.util.loading(false, null)))
                .subscribe(res => {

                }, (err) => {
                    this.util.handleError(err, "ERROR Downloading");
                });
        } catch (e) {
            this.util.handleError(e, "ERROR");
        }


        return false;
    }
}
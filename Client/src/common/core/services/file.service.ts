import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, Observable, Subscriber } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class FileService {
    constructor(private http: HttpClient) { }

    fileUpload(URI: string, elementId: string, fileName?: string, options?:any): Observable<any> {
        //this one uses api to upload base64 encoded file to server side loaction
        let finfo = (<HTMLInputElement>document.getElementById(elementId)).files![0];//current filename
        let nFileName = finfo.name;
        let reader = new FileReader();
        options = options || {};

        return Observable.create((observer: Subscriber<any>): void => {
            reader.onloadend = (e: Event) => {
                let data = reader.result;
                fileName = fileName || nFileName;

                //if you want the base64encoded file you would use the below line:
                let base64StringFile = btoa(data!.toString());

                var newfile = {
                    Data: base64StringFile,
                    FileName: fileName
                }
                let body = Object.assign(options, newfile);
                if (options.updating) {
                    delete options.updating;
                    return this.http.put(URI, body).pipe(take(1))
                        .subscribe(res => {
                            observer.next(res);
                            observer.complete();
                        }, (error: any): void => {
                            observer.error(error);
                        });
                }
                else {
                    return this.http.post(URI, body).pipe(take(1))
                        .subscribe(res => {
                            observer.next(res);
                            observer.complete();
                        }, (error: any): void => {
                            observer.error(error);
                        });
                }
            }
            reader.onerror = (error: any): void => {
                observer.error(error);
            }
            reader.readAsBinaryString(finfo);


        });
    }

    fileDownload(data: any, fileName?: string): Observable<boolean> {
        fileName = fileName || "download_file";
        var blob = new Blob([data], { type: this.mimetype(fileName) });

        if (navigator.appVersion.toString().indexOf('.NET') > 0
            || navigator.appVersion.toString().indexOf('Edge') > 0)
            var aa = 0;
            //window.navigator.msSaveBlob(blob, fileName);
        else {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display: none");
            var objectUrl = window.URL.createObjectURL(blob);
            //window.open(objectUrl);
            a.href = objectUrl;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(objectUrl);
        }
        return observableOf(true);
    }

    fileFromPath(path: string)  {
       this.fileDownload("Hello World", "test.txt");
    }

    mimetype(path: string): string {

        var ext = "doc";
        var MDN = {
            'aac': 'audio/aac',
            'abw': 'application/x-abiword',
            'arc': 'application/octet-stream',
            'avi': 'video/x-msvideo',
            'azw': 'application/vnd.amazon.ebook',
            'bin': 'application/octet-stream',
            'bz': 'application/x-bzip',
            'bz2': 'application/x-bzip2',
            'csh': 'application/x-csh',
            'css': 'text/css',
            'csv': 'text/csv',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'epub': 'application/epub+zip',
            'gif': 'image/gif',
            'html': 'text/html',
            'ico': 'image/x-icon',
            'ics': 'text/calendar',
            'jar': 'application/java-archive',
            'jpg': 'image/jpeg',
            'js': 'application/javascript',
            'json': 'application/json',
            'midi': 'audio/midi',
            'mpeg': 'video/mpeg',
            'mpkg': 'application/vnd.apple.installer+xml',
            'odp': 'application/vnd.oasis.opendocument.presentation',
            'ods': 'application/vnd.oasis.opendocument.spreadsheet',
            'odt': 'application/vnd.oasis.opendocument.text',
            'oga': 'audio/ogg',
            'ogv': 'video/ogg',
            'ogx': 'application/ogg',
            'png': 'image/png',
            'pdf': 'application/pdf',
            'ppt': 'application/vnd.ms-powerpoint',
            'rar': 'application/x-rar-compressed',
            'rtf': 'application/rtf',
            'sh': 'application/x-sh',
            'svg': 'image/svg+xml',
            'swf': 'application/x-shockwave-flash',
            'tar': 'application/x-tar',
            'tiff': 'image/tiff',
            'ttf': 'font/ttf',
            'txt': 'text/plain',
            'vsd': 'application/vnd.visio',
            'wav': 'audio/x-wav',
            'weba': 'audio/webm',
            'webm': 'video/webm',
            'webp': 'image/webp',
            'woff': 'font/woff',
            'woff2': 'font/woff2',
            'xhtml': 'application/xhtml+xml',
            'xls': 'application/vnd.ms-excel',
            'xml': 'application/xml',
            'xul': 'application/vnd.mozilla.xul+xml',
            'zip': 'application/zip',
            '3gp': 'video/3gpp',
            '3g2': 'video/3gpp2',
            '7z': 'application/x-7z-compressed',
        };

        ext = path.split('.')[path.split('.').length - 1];

        return MDN[ext.toLowerCase()] || "text/plain";
    }
}
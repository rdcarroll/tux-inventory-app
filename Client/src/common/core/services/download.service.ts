import { Injectable } from '@angular/core';
import { Html2CSVService } from './html2csv.service';
import * as FileSaver from 'file-saver';
import * as $ from 'jquery'; //to be able to use $. notation in components
import { ApiClientService } from '..';
//import * as root from '../../globals';
import * as root from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { take, map } from 'rxjs/operators';
import { FileService } from './file.service';

@Injectable()
export class DownloadService {
    constructor(
        private html2csv: Html2CSVService,
        private ApiClient: ApiClientService,
        private http: HttpClient,
        private files: FileService) { }
    private getHtmlDoc(cssdata: string, obj: any, breakInside: boolean):string {
        
        var avoidBreakInside = breakInside ? "table tr td, table tr th, table, table tr {page-break-inside: auto !important;}" : "table tr td, table tr th {page-break-inside: avoid !important;}";
        var cssDiv1a = '<!DOCTYPE html><html><head><meta http-equiv=""content-type"" content=""text/html; charset=utf-8"" /><style>' + avoidBreakInside + '</style></head><body style="margin:15px;">';
        var cssDiv1b = '<!DOCTYPE html><html><head><meta http-equiv=""content-type"" content=""text/html; charset=utf-8"" /><style>' + avoidBreakInside + cssdata + '</style></head><body style="margin:15px;">';
        var cssDiv2 = '</body></html>';
        var regex = new RegExp("-md-", 'g');

        var $clone:any = null;
        var pageBody = "";
        if (obj) {
            $clone = $(obj).find('#exportable').clone();
        }
        else {
            $clone = $('#exportable').clone();
        }

        //input boxes
        $clone.find("input[type=text]").each(function (index, tdl) {
            var value = $(tdl).val();
            $(tdl).replaceWith("<p>" + value + "</p>");
        });
        var checkedbox: string = `<svg role="img" aria-hidden="true" focusable="false" viewBox="0 0 448 512" class="svg-checked"><path fill="currentColor" d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z"></path></svg>`;
        var uncheckedbox: string = `<svg role="img" aria-hidden="true" focusable="false" class="svg-unchecked" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path></svg>`;
        $clone.find("input[type=checkbox]").each(function (index, tdl) {
            var value = tdl.checked;
           // $(this).replaceWith(value ? "[X]" : "[  ]");
            $(tdl).replaceWith(value ? checkedbox : uncheckedbox);
        });
        //replace fa-icon check box
        $clone.find("fa-icon[ng-reflect-icon*='far,check-square']").each(function (index, tdl) {
            //$(this).replaceWith( "[X]");
            $(tdl).replaceWith(checkedbox);
        });
        //replace fa-icon un-check box
        $clone.find("fa-icon[ng-reflect-icon*='far,square']").each(function (index, tdl) {
            //$(this).replaceWith("[  ]"); 
            $(tdl).replaceWith(uncheckedbox);
        });
        $clone.find("input[type=number]").each(function (index, tdl) {
            var value = $(tdl).val();
            $(tdl).replaceWith("<p>" + value + "</p>");
        });
        //text boxes
        $clone.find("textarea").each(function (index, tdl) {
            var value = $(tdl).val();
            $(tdl).replaceWith("<p>" + value + "</p>");
        });
        //select boxes
        $clone.find("select").each(function (index, tdl) {
            var value = $(tdl).find(':selected').text();
            $(tdl).replaceWith("<p>" + value + "</p>");
        });

        //replace company logo with inline base64
        $clone.find("img[src*='CorpLog2.jpg']").each(function (index, tdl) {
            var base64logo = root.base64Logo;
            let style = $(tdl).attr('style');
            $(tdl).replaceWith(`<img src="${base64logo}" style="${style}" />`);
        });

        //remove hidden elements
        $clone.find(".hidden-print").each(function (index, tdl) {
            $(tdl).remove();
        });
        $clone.find(".ng-hide").each(function (index, tdl) {
            $(tdl).remove();
        });

        pageBody = cssDiv1b + $clone.prop('outerHTML').replace(regex, "-xs-") + cssDiv2;

        return pageBody;
    }

    private convertBSTable(el: JQuery<HTMLElement>) {
        var _el = el.clone(); //dont mess up the original!

        _el.find(".bs-table").each(function (i, elTable) {
            var $table = $('<table></table>');
            $(elTable).find('.bs-tr:has(.bs-td)').each(function (i, elTr) {
                var $tr = $('<tr></tr>');

                $(elTr).find('.bs-td').each(function (i, elTd) {
                    var $td = $('<td></td>');
                    $td.append($(elTd).text().trim());

                    $tr.append($td);
                });


                $table.append($tr);
            });
            $(elTable).replaceWith($table);
        });
        return _el;
    }

    excel(title?: string) {
        try {
            var isFileSaverSupported = !!new Blob;
            title = title ? title : "reportdocument";

            //util.loading(true);
            var $converted = this.convertBSTable($('#exportable'));

            //let element = document.getElementById('exportable') as HTMLElement;
            //var $converted = element
            var csv = this.html2csv.convert($converted) || "no data";
            var blob = new Blob([csv], {
                type: "application/csv;charset=utf-8"
            });
            ////util.loading(false);
            FileSaver.saveAs(blob, title + ".csv");
        }
        catch (e) {
            //util.alerts.warning("Your browser does not currently support client-side excel downloads.");
        }
    }
    printToBrowser(title: string, obj: any) {
        
        try {
            
            this.http.get('dist/styles.css', { responseType: 'text' }).subscribe(data => {
                let fullhtml = this.getHtmlDoc(data, obj, false);
                
                var win = window.open('','printwindow'); 
                win?.document.write(fullhtml);
                win?.document.getElementsByTagName("body")[0].setAttribute("style","padding:unset;margin:2cm;");
                
                setTimeout(function () {
                    win?.print();
                    win?.close();
                }, 500);
            });
        }
        catch (e) {
            //util.alerts.warning("Your browser does not currently support client-side pdf downloads.");
            alert("print failed")
        }
    }
    fileFromURI(path: string) {

    }
    email(obj: any, subject:string, addresses: string[], bbc?: string[], cc?: string[]) {
        try {
            this.http.get('dist/ngApp.css', { responseType: 'text' }).subscribe(data => {
                let _body = this.getHtmlDoc(data as 'string', obj, true);
                let ishtml = true;
                let postObject = {
                    "Addresses": addresses,
                    "BBC": bbc||[],
                    "Body": _body,
                    "CC": cc || [],
                    "IsBodyHtml": ishtml,
                    "Subject": subject
                }
                this.ApiClient.pPost("Emails", {}, postObject).pipe(take(1))
                    .subscribe(res => {

                    }, (err) => {

                    });
            });
        }
        catch (e) {
            //util.alerts.warning("Your browser does not currently support client-side pdf downloads.");
        }
    }
}
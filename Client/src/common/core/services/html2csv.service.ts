import { Injectable } from '@angular/core';
import * as $ from 'jquery'; //to be able to use $. notation in components

@Injectable()
export class Html2CSVService {
    constructor() { }

    convert(el: JQuery<HTMLElement>):string {
        el = el.clone(); //dont mess up the original!

        var csvString = ""

        el.find("table").each(function () {
            var $rows = $(this).find('tr:has(td),tr:has(th)').not(".hidden-print"),

                // Temporary delimiter characters unlikely to be typed by keyboard
                // This is to avoid accidentally splitting the actual contents
                //tmpColDelim = String.fromCharCode(11), // vertical tab character
                tmpColDelim = "|||||", // vertical tab character
                tmpRowDelim = String.fromCharCode(0), // null character

                // actual delimiter characters for CSV format
                colDelim = '","',
                rowDelim = '"\r\n"',

                // Grab text from table into CSV formatted string
                csv = '"' + $rows.map(function (i, row) {
                    var $row = $(row), $cols = $row.find('td,th');

                    return $cols.map(function (j, col) {
                        var $col = $(col);

                        //offset colspan
                        var colspanFiller = "",
                            colspan = $col.attr('colspan'),
                            rowspan = $col.attr('rowspan');
                        if (colspan) {
                            for (var i = 1; i < parseInt(colspan); i++) {
                                colspanFiller += tmpColDelim;
                            }
                        }
                        //if (rowspan) {
                        //    for (var i = 0; i < rowspan; i++) {
                        //        colspanFiller += tmpColDelim + tmpRowDelim;
                        //    }
                        //}

                        //input boxes
                        $col.find("input[type=text]").each(function (index) {
                            var value = $(this).val();
                            $(this).replaceWith("<p>" + value + "</p>");
                        });
                        $col.find("input[type=number]").each(function (index) {
                            var value = $(this).val();
                            $(this).replaceWith("<p>" + value + "</p>");
                        });
                        //select boxes
                        $col.find("select").each(function (index) {
                            var value = $(this).val();
                            $(this).replaceWith("<p>" + value + "</p>");
                        });
                        //check boxes
                        $col.find("input[type=checkbox]:not(:checked)").replaceWith("<p></p>");
                        $col.find("input[type=checkbox]:checked").replaceWith("<p>X</p>");
                        //radio buttons
                        $col.find("input[type=radio]:not(:checked)").replaceWith("<p></p>");
                        $col.find("input[type=radio]:checked").replaceWith("<p>X</p>");

                        var text = colspanFiller + $col.text().trim();

                        var re = new RegExp(String.fromCharCode(160), "g"); //regex for &npsb;
                        //return text.replace(/"/g, '""'); // escape double quotes
                        return text
                            .replace(/"/g, '\"')// escape double quotes, 
                            .replace(re, " "); //remove &nbsp;

                    }).get().join(tmpColDelim);

                }).get().join(tmpRowDelim)
                    .split(tmpRowDelim).join(rowDelim)
                    .split(tmpColDelim).join(colDelim) + '"';


            csvString += csv + '\r\n';
        });

        //console.log(csvString);
        return csvString;
    }

}
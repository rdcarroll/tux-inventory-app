import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        var keys = Object.keys(filter);
        for (var key of keys) {
            items = items.filter(item => item[key].indexOf(filter[key]) !== -1);
        }
        return items;
    }
}
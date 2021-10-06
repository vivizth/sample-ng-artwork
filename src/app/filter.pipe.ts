import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], value: string, prop: string): any[] {
    console.log(items);
    if (!items) return [];

    if (!value) return items;

    console.log('filter');

    return items.filter((data: any) => {
      if (data?.[prop]) {
        return data[prop]?.toLowerCase().includes(value.toLowerCase());
      }

      return false;
    });
  }

}

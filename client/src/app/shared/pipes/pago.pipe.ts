import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pago'
})
export class PagoPipe implements PipeTransform {

  transform(value: any[], args?: any): any {

    if (value.length === 0) {
      return 0.0;
    } else if (value.length === 1) {
      return value[0].calculo.toFixed(1);
    } else {
      return (value.map(x => x.calculo).reduce((a, b) => {
        return a + b;
      })).toFixed(1);
    }
  }
}

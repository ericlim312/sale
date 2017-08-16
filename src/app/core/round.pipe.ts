import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
  // Return value from translation object. If it doesn't exist in selected language, use english
  transform(value: any) : any {
      return Math.round(parseInt(value));
  }
}

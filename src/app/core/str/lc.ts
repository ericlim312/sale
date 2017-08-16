import {Pipe, PipeTransform}                 from '@angular/core';

@Pipe({name: 'lc'})
export class LCPipe implements PipeTransform {

  // Return value from translation object. If it doesn't exist in selected language, use english
  transform(value: string) : string {
      return value.toLowerCase();
  }
}

import {Pipe, PipeTransform}                 from '@angular/core';

@Pipe({name: 'uc'})
export class UCPipe implements PipeTransform {

  // Return value from translation object. If it doesn't exist in selected language, use english
  transform(value: string) : string {
      return value.toUpperCase();
  }
}

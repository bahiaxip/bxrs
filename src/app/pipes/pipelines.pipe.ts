import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipelines'
})
export class PipelinesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value)
    return null;

//anulado, no sirve la búsqueda para salto de línea para whte-space
    //ejemplo de búsqueda (match) para salto de línea
    //let texto="asdfñalsikdjfñlaksdjfñlñlksjdafñlksjdfñlkjñalskdjfañsld";
    //forma corta, da error si no hay resultado(ninguno salto de línea).
    //let data=texto.match(/\n/g).length;
    //otra forma, devuelve null si no hay resultado
    //let match = /\n/g.exec(texto);
    //forma larga. (sin paréntesis obtienes solo el array, no el length)
    //let dataList=(texto.match(/\n/g)||[]).length;

  }

}

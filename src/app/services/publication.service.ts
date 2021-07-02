import { Injectable } from '@angular/core';
import { Global } from './Global';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private url:string=Global.url;

  constructor() { }


}

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { CandidatasResponse } from '../interfaces/CandidatasResponse.interface';
import { Candidata } from '../model/candidata.model';
import { InformacionService } from './informacion.service';

@Injectable({
  providedIn: 'root'
})
export class FocUpdaterService {

  candidatas_adultas: Candidata[] = [];
  candidatas_infantiles: Candidata[] = [];
  bellezas!: string;

  constructor(public http: HttpClient, private _is: InformacionService) {
    this.getCandidatas();
  }

  public removeAccent(search: any) {
    var accent = [
      /[\300-\306]/g, /[\340-\346]/g, // A, a
      /[\310-\313]/g, /[\350-\353]/g, // E, e
      /[\314-\317]/g, /[\354-\357]/g, // I, i
      /[\322-\330]/g, /[\362-\370]/g, // O, o
      /[\331-\334]/g, /[\371-\374]/g, // U, u
      /[\321]/g, /[\361]/g, // N, n
      /[\307]/g, /[\347]/g, // C, c
    ],
      noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    for (var i = 0; i < accent.length; i++) {
      search = search.replace(accent[i], noaccent[i]);
    }
    return search;
  }

  public getCandidatas() {
    this._is.getInfo().then((info) => {
      console.log(info.url_base + info.candidatas_path);
      this.http.get<CandidatasResponse>(info.url_base + info.candidatas_path)
        .subscribe(candidatas => {
          this.candidatas_adultas = candidatas.adultas;
          this.candidatas_infantiles = candidatas.infantiles;
        });
    });
  }

  public getInfoAsociaciones() {
    this._is.getInfo().then((info) => {
      console.log(info.url_base + info.candidatas_path);
      console.log('https://api-admin-foguerapp.azurewebsites.net/fogueres');
      
      this.http.get<any>('https://api-admin-foguerapp.azurewebsites.net/fogueres')
        .subscribe((fogueres: any) => {
          console.log(fogueres);
          
        });
    });
  }

  public setRepresenantesAdultas(bellezas: Candidata[]): Promise<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return new Promise((resolve) => {
      this._is.getInfo().then((info) => {
        console.log('Enviando Adultas: ', info.url_base + info.representantes_path + info.adultas_path);
        this.http.post(info.url_base + info.representantes_path + info.adultas_path, JSON.stringify(bellezas), { headers: headers })
          .subscribe(res => {
            resolve(res.toString());
          });
      })
    });
  }

  public setRepresenantesInfantiles(bellezas: Candidata[]): Promise<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return new Promise((resolve) => {
      this._is.getInfo().then((info) => {
        console.log('hola ->', info);
        
        console.log('Enviando Infantiles: ', info.url_base + info.representantes_path + info.infantiles_path);
        this.http.post(info.url_base + info.representantes_path + info.infantiles_path, JSON.stringify(bellezas), { headers: headers })
          .subscribe(res => {
            resolve(res.toString());
          });
      })
    });
  }
}

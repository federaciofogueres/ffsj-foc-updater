import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Info } from '../model/info.model';

@Injectable({
  providedIn: 'root'
})
export class InformacionService {

  info!: Info;
  cargada: boolean = false;

  constructor(public http: HttpClient) {
    this.CargarInfo();
  }

  private CargarInfo() {
    let promesa = new Promise((resolve, reject) => {
      this.http.get<Info>("assets/data/info.pagina.json")
        .subscribe(data => {
          this.info = data;
          this.cargada = true;
          resolve(true);
        });
    });

    return promesa;
  }

  public getInfo(): Promise<Info> {
    return new Promise((resolve, reject) => {
      if (this.cargada) {
        resolve(this.info);
      }
      else {
        this.CargarInfo().then(() => {
          resolve(this.info);
        });
      }
    });
  }
}

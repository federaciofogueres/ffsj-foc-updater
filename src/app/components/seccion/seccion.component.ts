// import { Component } from '@angular/core';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Observable, startWith, map } from 'rxjs';
// import { Candidata } from '../../model/candidata.model';
// import { FocUpdaterService } from '../../services/foc-updater.service';
// import { MatListModule } from '@angular/material/list';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIconModule } from '@angular/material/icon';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-seccion',
//   standalone: true,
//   imports: [CommonModule, MatListModule, MatFormFieldModule, MatAutocompleteModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './seccion.component.html',
//   styleUrl: './seccion.component.scss'
// })
// export class SeccionComponent {


//   itemsSelectedRemove(item: any) {
//     var index = this.candisSeleccionadas.indexOf(item);
//     this.candisSeleccionadas.splice(index, 1);
//   }

//   selectedItemChange(event: any, item: Candidata) {
//     this.errores = "";

//     if (this.checkNumSeleccionadas()) {
//       if (event.source.selected) {
//         if (this.checkCandidataExiste(item.id)) {
//           this.errores = "La chica seleccionada ya se encuentra en la lista.";
//         }
//         else {
//           this.candisSeleccionadas.push(item);
//           this.candisCtrl.reset();
//         }
//       }
//     }
//     else {
//       this.errores = "Ya están las 7 elegidas en la lista, no puedes añadir más.";
//     }
//   }
  
// }


import {Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Candidata } from '../../model/candidata.model';
import { FocUpdaterService } from '../../services/foc-updater.service';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

/**
 * @title Highlight the first autocomplete option
 */
@Component({
  selector: 'app-seccion',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatListModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './seccion.component.html',
  styleUrl: './seccion.component.scss'
})
export class SeccionComponent implements OnInit {

  candisCtrl = new FormControl('');
  candisFiltradas!: Observable<Candidata[]>;
  candisShow: Candidata[] = [];
  candisSeleccionadas: Candidata[] = [];
  idBelleza!: number;
  bellezasResult: string = "";
  errores: string = "";

  constructor(public _fs: FocUpdaterService) {
    this.candisCtrl = new FormControl();
    this.candisFiltradas = this.candisCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filtrarCandidatas(state) : this._fs.candidatas_adultas.slice())
      );
  }

  ngOnInit() {

    this.candisCtrl.valueChanges.pipe(
      startWith('')
    ).subscribe(res => {
      this.candisShow = this.filtrarCandidatas(res || '');
    })

    this.candisFiltradas = this.candisCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarCandidatas(value || ''))
    );
  }

  filtrarCandidatas(cadena: string) {
    if (cadena !== null && cadena !== '') {
      return this._fs.candidatas_adultas.filter(candidata => {
        return candidata.nombre.includes(cadena) || candidata.hoguera.includes(cadena);
      });
    } else {
      return this._fs.candidatas_adultas;
    }
  }

  setRepresentantes() {
    this.errores = "";

    if (this.idBelleza == null) {
      this.errores = "Debe de seleccionar a la belleza del fuego.";
    }
    else {
      for (let i in this.candisSeleccionadas) {
        this.candisSeleccionadas[i].idh = this.candisSeleccionadas[i].id;
        this.candisSeleccionadas[i].cargo = (this.candisSeleccionadas[i].id == this.idBelleza ? 'BELLEZA' : 'DAMA');
      }
      this._fs.setRepresenantesAdultas(this.candisSeleccionadas).then((info) => {
        this.bellezasResult = "";
        this.bellezasResult = this.getBellezasString();
      });
    }
  }

  public checkBellezaSeleccionada() {
    return (this.candisSeleccionadas.length <= 6);
  }

  public checkNumSeleccionadas() {
    return (this.candisSeleccionadas.length <= 6);
  }

  public checkCandidataExiste(id: number) {
    return this.candisSeleccionadas.filter(candidata => {
      return (candidata.id === id);
    }).length != 0;
  }

  public getBellezasString(): string {
    let anyoActual = new Date().getFullYear();
    let bellezasString = "";

    for (let i in this.candisSeleccionadas) {
      if (this.candisSeleccionadas[i].cargo == 'BELLEZA') {
        bellezasString = "Bellesa del Foc d'Alacant " + anyoActual + ": " + this.candisSeleccionadas[i].nombre.trim() + " - Foguera " + this.candisSeleccionadas[i].hoguera.trim() + "\n" + bellezasString;
      } else {
        bellezasString = bellezasString + "Dama d'Honor de la Bellesa del Foc " + anyoActual + ": " + this.candisSeleccionadas[i].nombre.trim() + " - Foguera " + this.candisSeleccionadas[i].hoguera.trim() + "\n";
      }
    }

    bellezasString = "ELECCIÓ DE LA BELLESA DEL FOC D'ALACANT I LES SEUES DAMES D'HONOR " + anyoActual + "\n" + bellezasString;

    return bellezasString;
  }

  itemsSelectedRemove(item: any) {
    var index = this.candisSeleccionadas.indexOf(item);
    this.candisSeleccionadas.splice(index, 1);
  }

  selectedItemChange(event: any, item: Candidata) {
    this.errores = "";

    if (this.checkNumSeleccionadas()) {
      if (event.source.selected) {
        if (this.checkCandidataExiste(item.id)) {
          this.errores = "La chica seleccionada ya se encuentra en la lista.";
        }
        else {
          this.candisSeleccionadas.push(item);
          this.candisCtrl.reset();
        }
      }
    }
    else {
      this.errores = "Ya están las 7 elegidas en la lista, no puedes añadir más.";
    }
  }
}


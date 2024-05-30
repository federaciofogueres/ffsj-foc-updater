import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';


export interface Cabecera {
  label: string;
  order: number;
  active: boolean;
}

@Component({
  selector: 'app-foguerapp',
  standalone: true,
  imports: [ 
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './foguerapp.component.html',
  styleUrl: './foguerapp.component.scss'
})
export class FoguerappComponent {
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  cabeceras: string[] = []; // Añade tus cabeceras aquí
  activeColumns: string[] = [];
  desactivadas: string[] = [];

  nuevasCabeceras: Cabecera[] = [];

  filtro: string = '';
  mostrarFiltros: boolean = false;

  constructor() { }

  changeStateCabecera(cabecera: Cabecera) {
    if (cabecera) {
      if (cabecera.active) {
        cabecera.active = false;
        this.activeColumns = this.activeColumns.filter((column) => column !== cabecera.label);
      } else {
        cabecera.active = true;
        this.activeColumns.push(cabecera.label);
        this.activeColumns.sort((a, b) => { return this.nuevasCabeceras.find(c => c.label === a)!.order - this.nuevasCabeceras.find(c => c.label === b)!.order});
      }
    }
    console.log(this.nuevasCabeceras);
    
  }

  reiniciaDatos() {
    this.dataSource = [];
    this.cabeceras = [];
    this.desactivadas = [];
  }

  onFileChange(evt: any) {
    this.reiniciaDatos();
    const target: DataTransfer = <DataTransfer>(evt.target);
  
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  
    const reader: FileReader = new FileReader();
  
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
  
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
      this.dataSource = XLSX.utils.sheet_to_json(ws, { header: 1 });

      let worksheet = wb.Sheets[wb.SheetNames[0]];
  
      // Almacenar el primer dato de cada columna como cabecera
      this.cabeceras = this.dataSource[0];
      this.activeColumns = this.dataSource[0];

      // Leer las cabeceras del archivo Excel
      let excelHeaders:any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

      // Almacenar las cabeceras en el array nuevasCabeceras
      this.nuevasCabeceras = excelHeaders.map((header: any, index: any) => {
        return {
          label: header,
          order: index,
          active: true
        };
      });
  
      this.displayedColumns = this.dataSource.shift();
      console.log(this.displayedColumns);
      

    };
    reader.readAsBinaryString(target.files[0]);
  }
}

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './foguerapp.component.html',
  styleUrl: './foguerapp.component.scss'
})
export class FoguerappComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  Boolean = Boolean;
  displayedColumns: string[] = [];
  data: any[] = [];
  dataSource!: MatTableDataSource<any>;

  cabeceras: string[] = []; // Añade tus cabeceras aquí
  activeColumns: string[] = [];
  desactivadas: string[] = [];

  nuevasCabeceras: Cabecera[] = [];
  cabecerasFiltradas: Cabecera[] = [];

  filtro: string = '';
  mostrarFiltros: boolean = false;

  archivoSubido: boolean = false;

  @ViewChild('select') select!: MatSelect;

  preventClose(event: KeyboardEvent) {
    if (this.select.panelOpen) {
      event.stopPropagation();
    }
  }

  constructor() { }

  changeStateFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  onFiltroChange(filtro: any) {
    console.log(filtro);
    
    // Filtra las 'nuevasCabeceras' para incluir sólo aquellas que contienen el texto del filtro
    this.cabecerasFiltradas = this.nuevasCabeceras.filter(cabecera => cabecera.label.includes(filtro.target.value));
    console.log(this.cabecerasFiltradas);
    
  }

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
    this.data = [];
    this.cabeceras = [];
    this.desactivadas = [];
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = [];
    }
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
  
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.dataSource = new MatTableDataSource(this.data);

      let worksheet = wb.Sheets[wb.SheetNames[0]];
  
      // Almacenar el primer dato de cada columna como cabecera
      this.cabeceras = this.data[0];
      this.activeColumns = this.data[0];

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
  
      this.displayedColumns = this.data.shift();
      console.log(this.displayedColumns);
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
      }
      this.cabecerasFiltradas = this.nuevasCabeceras;
      this.archivoSubido = true;
    };
    reader.readAsBinaryString(target.files[0]);
  }
}

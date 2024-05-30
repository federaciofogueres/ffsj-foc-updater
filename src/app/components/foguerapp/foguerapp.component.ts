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
  type: string;
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

  activeColumns: string[] = [];
  desactivadas: string[] = [];

  nuevasCabeceras: Cabecera[] = [];

  filtro: string = '';
  mostrarFiltros: boolean = false;

  archivoSubido: boolean = false;

  showInput = false;
  camposAgregados: string[] = [];

  @ViewChild('select') select!: MatSelect;

  preventClose(event: KeyboardEvent) {
    if (this.select.panelOpen) {
      event.stopPropagation();
    }
  }

  constructor() { }

  addCampo(value: string) {
    this.camposAgregados.push(value);
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
      this.activeColumns = this.data[0];

      // Leer las cabeceras del archivo Excel
      let excelHeaders:any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

      excelHeaders.map((header: any, index: any) => {
        this.nuevasCabeceras.push( {
          label: header,
          order: index,
          active: true,
          type: 'text'
        });
      });
      
      for (let campo of this.camposAgregados) {
        this.nuevasCabeceras.push({
          label: campo,
          order: this.nuevasCabeceras[0].order - 1,
          active: true,
          type: 'checkbox'
        });

        for (let i = 0; i < this.data.length; i++) {
          if (i === 0) {
            this.data[i].push(campo);
          } else {
            this.data[i].push(false);
          }
        }
      }
      this.data.shift();
      this.nuevasCabeceras.sort((a, b) => a.order - b.order);
      this.displayedColumns = this.nuevasCabeceras.filter(cabecera => cabecera.active).map(cabecera => cabecera.label);
      console.log(this.displayedColumns);
      this.activeColumns = this.displayedColumns;
      if (this.dataSource) {
        this.dataSource.paginator = this.paginator;
      }
      this.archivoSubido = true;
    };
    reader.readAsBinaryString(target.files[0]);
  }
}

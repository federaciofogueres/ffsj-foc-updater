import { ChangeDetectorRef, Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


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

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  changeStateCabecera(cabecera: Cabecera) {
    // if (this.activeColumns.includes(cabecera)) {
    //   this.activeColumns = this.activeColumns.filter((column) => column !== cabecera);
    //   this.desactivadas.push(cabecera);
    // } else {
    //   this.desactivadas = this.desactivadas.filter((column) => column !== cabecera);
    //   this.activeColumns.push(cabecera);
    // }
    // this.cdr.detectChanges();
    // console.log(this.desactivadas);
    // console.log(this.activeColumns);

    // Encuentra la cabecera en el array nuevasCabeceras
    // let cabeceraObj = this.nuevasCabeceras.find(c => c.label === cabecera);

    // Si la cabecera existe, cambia su estado 'active'
    // if (cabeceraObj) {
    //   if (cabeceraObj.active) {
    //     cabeceraObj.active = false;
    //     this.activeColumns = this.activeColumns.filter((column) => column !== cabecera);
    //   } else {
    //     cabeceraObj.active = true;
    //     this.activeColumns.push(cabecera);
    //   }
    // }

    
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

  esDesactivada(cabecera: string) {
    return this.desactivadas.includes(cabecera);
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

    // let workBook: any = null;
    // let jsonData: any = null;
    // const reader = new FileReader();
    // const file = event.target.files[0];
    // reader.onload = (event) => {
    //   const data = reader.result;
    //   workBook = XLSX.read(data, { type: 'binary' });
    //   jsonData = workBook.SheetNames.reduce((initial, name) => {
    //     const sheet = workBook.Sheets[name];
    //     initial[name] = XLSX.utils.sheet_to_json(sheet);
    //     return initial;
    //   }, {});
    //   this.cabeceras = Object.keys(jsonData[workBook.SheetNames[0]][0]);
    // }
    // reader.readAsBinaryString(file);
  // }
}

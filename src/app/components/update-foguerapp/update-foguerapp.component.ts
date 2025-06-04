import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { FocUpdaterService } from '../../services/foc-updater.service';

@Component({
  selector: 'app-update-foguerapp',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './update-foguerapp.component.html',
  styleUrl: './update-foguerapp.component.scss'
})
export class UpdateFoguerappComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  Boolean = Boolean;

  cabeceras: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(); // Inicialización para evitar undefined
  index = 0;

  constructor(
    private _focUpdaterService: FocUpdaterService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Guardamos cabeceras y datos
      this.cabeceras = data[0];
      const rows = data.slice(1);
      this.dataSource = new MatTableDataSource(rows);

      console.log(this.cabeceras);
      console.log(this.dataSource.data);

      // Montamos array de objetos
      const objetos = rows.map((row: any[]) => {
        const obj: any = {};
        this.cabeceras.forEach((header: string, index: number) => {
          obj[header] = row[index];
        });
        return obj;
      });

      console.log('Array de objetos:', objetos);

      // Llamamos al servicio
      this._focUpdaterService.updateAsociaciones(objetos);
    };

    reader.readAsBinaryString(target.files[0]);
  }




  async procesaDatos() {
    let asociaciones = [];
    await this._focUpdaterService.getInfoAsociaciones().then((response) => {
      asociaciones = response.data;

      const dataAplanada = asociaciones.map((item: any) => {
        const flatItem: any = {};

        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            if (typeof item[key] === 'object' && item[key] !== null) {
              for (const subKey in item[key]) {
                if (item[key].hasOwnProperty(subKey)) {
                  flatItem[`${key}_${subKey}`] = item[key][subKey];
                }
              }
            } else {
              flatItem[key] = item[key];
            }
          }
        }

        return flatItem;
      });

      this.dataSource.data = dataAplanada;
      this.dataSource.paginator = this.paginator;
      this.cabeceras = Object.keys(this.dataSource.data[0]);
    });
  }


  exportarMetaExcel() {
    const datosMeta = this.dataSource.data.map((item: any) => {
      const flatItem: any = {};

      // Recorremos cada clave en el objeto principal
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (typeof item[key] === 'object' && item[key] !== null) {
            // Si es un objeto (como 'meta'), lo aplanamos con prefijo
            for (const subKey in item[key]) {
              if (item[key].hasOwnProperty(subKey)) {
                flatItem[`${key}_${subKey}`] = item[key][subKey];
              }
            }
          } else {
            // Si es un valor plano, lo dejamos tal cual
            flatItem[key] = item[key];
          }
        }
      }

      return flatItem;
    });

    // Crea la hoja de Excel a partir del array aplanado
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosMeta);

    // Crea el libro de Excel y añade la hoja
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Meta');

    // Descarga el archivo Excel
    XLSX.writeFile(wb, 'meta_asociaciones.xlsx');
  }

}

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
  dataSource!: MatTableDataSource<any>;
  index = 0;

  constructor(
    private _focUpdaterService: FocUpdaterService
  ) {}

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
    
      // Aquí puedes almacenar los datos donde necesites
      this.cabeceras = data[1];
      this.dataSource = new MatTableDataSource(data.slice(2));
      console.log(this.cabeceras);
      console.log(this.dataSource.data);
      
    };
    
    reader.readAsBinaryString(target.files[0]);
  }


  procesaDatos() {
    do {
      this._focUpdaterService.getInfoAsociaciones();
      this.index++;
    } while (this.index < 3);
    this.index = 0;


    this.dataSource.data.forEach((row: any) => {
      console.log(row);
      
    });
  }
}

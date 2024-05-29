import { Component } from '@angular/core';


@Component({
  selector: 'app-foguerapp',
  standalone: true,
  imports: [],
  templateUrl: './foguerapp.component.html',
  styleUrl: './foguerapp.component.scss'
})
export class FoguerappComponent {
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.dataSource = XLSX.utils.sheet_to_json(ws, { header: 1 });

      this.displayedColumns = this.dataSource.shift();
    };

    reader.readAsBinaryString(target.files[0]);
  }
}

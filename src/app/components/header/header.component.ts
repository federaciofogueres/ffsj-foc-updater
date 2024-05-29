import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  standalone: true,
  imports: [ MatToolbarModule ]
})
export class HeaderComponent {

  constructor() { }
}

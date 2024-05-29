import { Routes } from '@angular/router';
import { FoguerappComponent } from './components/foguerapp/foguerapp.component';
import { SeccionComponent } from './components/seccion/seccion.component';

export const routes: Routes = [
    { path: 'foc', component: SeccionComponent },
    { path: 'foguerapp', component: FoguerappComponent },
    { path: '**', redirectTo: 'foc'},
];

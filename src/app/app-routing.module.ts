import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { ImpressumComponent } from './routes/impressum/impressum.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'LegalNotice', component: ImpressumComponent},
  {path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

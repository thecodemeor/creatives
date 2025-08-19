import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Folder
import { Pages } from './pages/pages.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Layout } from './layout/layout.component';

const routes: Routes = [
    { path: '', redirectTo: 'frame', pathMatch: 'full' },
    { path: 'frame', component: Layout},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Folder
import { Work } from './pages/work/work.component';
import { Poster } from './pages/poster/poster.component';
import { Logo } from './pages/logo/logo.component';

const routes: Routes = [
    { path: '', redirectTo: 'work', pathMatch: 'full' },
    { path: 'work', component: Work },
    { path: 'poster', component: Poster },
    { path: 'logo', component: Logo },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

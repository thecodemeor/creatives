// ---  Angular Package  --- //
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';

// --- External Libraries --- //

// --- Angular Material --- //

// --- Extra Component --- //
import { ToolbarComponent } from 'src/assets/components/toolbar.component';
import { DialogComponent } from 'src/assets/components/dialog.component';

// --- Folder Component --- //
import { Layout } from 'src/app/layout/layout.component';
import { Pages } from './pages/pages.component';

// --- Page List --- //

@NgModule({
    declarations: [
        AppComponent,
        Layout,

        // Extra
        ToolbarComponent,
        DialogComponent,

        // Folder
        Pages

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        HttpClientModule,
        FormsModule,

        // External Service

        // Angular Material
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

// ---  Angular Package  --- //
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { BookComponent } from 'src/assets/components/book.component';

// --- Folder Component --- //
import { Layout } from 'src/app/layout/layout.component';
import { Pages } from './pages/pages.component';
import { Views } from './views/views.component';

// --- Page List --- //

@NgModule({
    declarations: [
        AppComponent,
        Layout,

        // Extra
        ToolbarComponent,
        DialogComponent,
        BookComponent,

        // Folder
        Pages,
        Views

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
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    bootstrap: [AppComponent]
})
export class AppModule { }

import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { LogoComponent } from 'src/assets/shared/logo/logo.component';
import { NoiseComponent } from 'src/assets/shared/noise';
import { ToolbarComponent } from 'src/assets/shared/toolbar';
import { BookComponent } from 'src/assets/shared/book';
import { Loading } from 'src/assets/components/loading';

import packageJson from '../../../package.json';
import allFolder from 'src/assets/json/metadata.json';

@Component({
    selector: 'app-desktop',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NoiseComponent,
        ToolbarComponent,
        BookComponent,
        LogoComponent,
        Loading
    ],
    templateUrl: './desktop.html',
    styleUrl: './desktop.scss',
})
export class Desktop implements OnInit {
    version: string = packageJson.version;

    openItems: boolean = false
    folders: any[] = [];
    files: any[] = [];
    history: any[] = [];
    breadcrumbs: string = '';
    toDisplay: string = '';
    signal: any;
    booklet: any[] = [];
    pages: any[] = [];

    searchInput: string = '';
    allSearch: any[] = [];
    allImage: any[] = [];
    allPackage: any = allFolder.children;

    isLoading = false;
    loadedImages = 0;

    displayProgress = 0;
    private displayRequestSub?: Subscription;
    private objectUrl?: string;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.openFolder(allFolder, true);
        this.allImage = this.getPackage(this.allPackage, 'folder');
    }

    openFolder(folder: any, add: boolean): void {
        if (add) {
            this.history.push(folder);
        }

        this.folders = [];
        this.files = [];
        this.loadedImages = 0;

        for (const item of folder.children) {
            if (item.fileType === 'folder') {
                this.folders.push(item);
            } else if (item.fileType === 'png' || item.fileType === 'svg') {
                this.files.push(item);
            }
        }

        if (add) {
            this.breadcrumbs += `/${folder.name}`;
        } else {
            this.breadcrumbs = this.breadcrumbs.substring(
                0,
                this.breadcrumbs.lastIndexOf('/')
            );
        }
    }

    openFile(file: any): void {
        this.openItems = true
        this.toDisplay = '';
        this.booklet = [];
        this.pages = [];
        this.signal = file;
        this.isLoading = true;
        this.displayProgress = 0;

        console.log(this.signal, 'mcb')

        if (file.folder === 'work/booklet') {
            const name = file.name.replace(/\s+/g, '').toLowerCase();
            const pageMerge = file.pages / 2;

            for (let i = 0; i < file.pages; i++) {
                const id = i + 1;
                this.pages.push(`assets/images/work/booklet/${name}/${id}.svg`);
            }

            for (let i = 0; i < pageMerge; i++) {
                const id = i + 1;
                this.booklet.push(`assets/images/work/booklet/${name}/book/${id}.png`);
            }

            this.isLoading = false;
            this.displayProgress = 100;
            return;
        }

        const url = `assets/images/${file.folder}/${file.id}.${file.fileType}`;

        this.displayRequestSub = this.http.get(url, {
            responseType: 'blob',
            observe: 'events',
            reportProgress: true
        }).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.DownloadProgress) {
                    if (event.total) {
                        this.displayProgress = Math.round(
                            (event.loaded / event.total) * 100
                        );
                    } else {
                        // total may be missing, so keep a soft progress state
                        this.displayProgress = Math.min(this.displayProgress + 8, 95);
                    }
                }

                if (event.type === HttpEventType.Response) {
                    const blob = event.body;
                    if (!blob) {
                        return;
                    }

                    this.objectUrl = URL.createObjectURL(blob);
                    this.toDisplay = this.objectUrl;

                    // keep loader visible until the actual <img> finishes painting
                    this.displayProgress = 100;
                }
            }
        });
    }

    onAssetLoad(): void {
        if (this.loadedImages < this.files.length) {
            this.loadedImages++;
        }
    }

    filterPackage(searchInput: string): void {
        const keyword = searchInput.toLowerCase().trim();
        this.allSearch = [];

        if (!keyword) {
            return;
        }

        for (const file of this.allImage) {
            const name = file.name.toLowerCase().trim();
            if (name.includes(keyword)) {
                this.allSearch.push(file);
            }
        }
    }

    getPackage(packageJson: any, filter: string): any[] {
        const result: any[] = [];

        for (const node of packageJson) {
            if (node.fileType !== filter) {
                result.push(node);
            }

            if (node.children && node.children.length > 0) {
                result.push(...this.getPackage(node.children, 'folder'));
            }
        }

        return result;
    }

    getFolderName(path: string) {
        return path.split('/')[1]
    }

    openLinkWebsite() {
        window.open('https://www.meorhakim.com', '_blank');
    }

    close(): void {
        this.signal = [];
        this.toDisplay = '';
        this.booklet = [];
        this.pages = [];
        this.isLoading = false;
        this.displayProgress = 0;
        this.openItems = false
    }

    back(): void {
        if (this.history.length <= 1) {
            return;
        }

        this.history.pop();
        const prev = this.history[this.history.length - 1];
        this.openFolder(prev, false);
    }
}
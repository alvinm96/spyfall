import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class CommonService {
    name: string;

    constructor(private localStorage: LocalStorageService) {
        this.name = this.localStorage.retrieve('name');

        this.localStorage.observe('name').subscribe((data) => {
            this.name = data;
        });
    }
}
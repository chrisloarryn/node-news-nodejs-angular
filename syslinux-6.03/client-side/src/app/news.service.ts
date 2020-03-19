import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class NewsService {

    constructor(private http: HttpClient) {}

    url = 'http://localhost:8080/';

    public getNews() {
        return this.http.get(`${this.url}`);
    }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../environments/environment';



@Injectable()
export class NewsService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:8080/api';
  //
  public getNews() {
    return this.http.get(`${env.backend.pre}${env.backend.host}:${env.backend.port}/api`);
  }

}

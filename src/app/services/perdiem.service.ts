import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {AuthenticationService} from './authentication.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


export interface Perdiem {
  first_name;
  last_name;
  days_jantomar;
  jantomar;
  days_martoapr;
  martoapr;
  days_aprtomay;
  aprtomay;
  days_maytojun;
  maytojun;
  days_juntojul;
  juntojul;
  days_jultoaug;
  jultoaug;
  days_augtosep;
  augtosep;
  days_septooct;
  septooct;
  days_octtonov;
  octtonov;
}

@Injectable()
export class PerdiemService {
  private baseUrl = 'http://138.197.101.197/api/';
  constructor(private http: Http, private authenticationService: AuthenticationService) {

  }
  getPerdiemList(type): Observable<any[]> {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.baseUrl}${type}/`, options)
      .map((response: Response) => <any[]> response.json())
      //.do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

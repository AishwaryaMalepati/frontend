/**
 * Created by ash on 5/9/17.
 */

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class EventService {
  private baseUrl = 'http://localhost:8000/api/';

  constructor(private http: Http, private authenticationService: AuthenticationService) {

  }

  getList(type, query=''): Observable<any[]> {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.baseUrl}${type}/?${query}`, options)
      .map((response: Response) => <any[]> response.json())
      //.do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }
  saveEvent(body,type): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.baseUrl}${type}/`,  JSON.stringify(body), options)
      .map((response: Response) => <any> response.json())
      .do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }

  updateEvent(body,type): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(`${this.baseUrl}${type}/${body['id']}/`,  JSON.stringify(body), options)
      .map((response: Response) => <any> response.json())
      .do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }
  deleteEvent(id,type): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${this.baseUrl}${type}/${id}/`, options)
      .map((response: Response) => <any> response.json())
      .do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }

  deleteEventinRange(url): Observable<any> {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${this.baseUrl}${url}`, options)
      .map((response: Response) => <any[]> response.json())
      //.do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }

  updateRaceInfo(query): Observable<any> {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.baseUrl}race_schedule/vehicle_trailer_group_update/${query}`, JSON.stringify({}), options)
      .map((response: Response) => <any> response.json())
      .do(data => console.log('All: ' +  JSON.stringify(data)))
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

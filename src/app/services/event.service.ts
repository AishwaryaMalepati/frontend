/**
 * Created by ash on 5/9/17.
 */
import {Injectable} from '@angular/core';
import {Event} from '../model/event.model';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class EventService {

  constructor(private http: Http,
  private authenticationService: AuthenticationService) {}

  getEvents() {
    let headers = new Headers({ 'Authorization': 'JWT ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get('http://138.197.101.197/api/events/', options)
      .toPromise();
     // .then(res => <any[]> res.json().data)
    //  .then(data => { return data; });
  }
}


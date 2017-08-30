/*import { Component, OnInit } from '@angular/core';
import {PanelModule} from 'primeng/primeng';
import {AuthService} from '../../services/auth.service';
import {User} from '../../model/user.model';
import {Message} from 'primeng/primeng';
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  private username: string;
  private password: string;
  private  msgs: Message[] = [];
  constructor(private authservice: AuthService, private router: Router) {
  }

  public login(): void {
    let user: User = {
      username: this.username,
      password: this.password
    }
    this.authservice.login(user).then((result: boolean) => {
      if (result) {
        this.router.navigate(['/home']); }  else {
        this.msgs = [];
        this.msgs.push({summary: 'Error', detail: 'Incorrect Credentials'});
      }
    });
  }

}*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (result === true) {
          // login successful
          localStorage.setItem('user', this.model.username);
          this.router.navigate(['/home']);
        } else {
          // login failed
          this.error = 'Username or password is incorrect';
          this.loading = false;
        }
      });
  }
}

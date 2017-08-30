import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/primeng';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[];
  constructor() { }

  ngOnInit() {
    const username = localStorage.getItem('user');
    this.items = [
      {
        label: 'Home', icon: 'fa-home fa-2x', routerLink: ['/home']
      },
      {
        label: 'Schedule', icon: 'fa-calendar fa-2x',
        items: [{
                  label: 'All Schedules',
                  routerLink: ['/allschedules']
                },
                {label: 'My Schedule', routerLink: ['/myschedule']},
          {label: 'Create Schedule', routerLink: ['/createschedule']}
        ]
      },
      {
        label: 'Per Diem', icon: 'fa-money fa-2x', routerLink: ['/perdiem']
      },
      {
        label: 'Administration',
        icon: 'fa-lock fa-2x',
        url: 'http://138.197.101.197/admin/'
      },
      { label: username,
        icon: 'fa-user-circle fa-2x',
        items: [{
          label: 'Logout',
          icon: 'fa-power-off' ,
          routerLink: ['/login']
        }
        ]
      }
    ];
  }
}



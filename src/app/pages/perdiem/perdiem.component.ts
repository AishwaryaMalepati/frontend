import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'app-perdiem',
  templateUrl: './perdiem.component.html',
  styleUrls: ['./perdiem.component.css']
})
export class PerdiemComponent implements OnInit {
  perdiemList = [];
  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getList('perdiem').subscribe((response) => {
      console.log(response)         ;
      this.perdiemList = response;
    });
  }

}

import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-raceschedule',
  templateUrl: './raceschedule.component.html',
  styleUrls: ['./raceschedule.component.css']
})
export class RacescheduleComponent implements OnInit {
  races: any[]=[];
  selectedRace: null;
  errorMessage: string;

  public constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.eventService.getList('race_schedule')
      .subscribe(races => {
        var races_ = [];
        this.races = races.map((race) => {
          var progress = 0;

          if (race.event_details.cups.count >= race.event_details.cups.required) {
            progress += 16.6 ;
          }
          if (race.event_details.nxs.count >= race.event_details.nxs.required) {
            progress += 16.6 ;
          }
          if (race.event_details.titans.count >= race.event_details.titans.required) {
            progress += 16.6 ;
          }
          if (race.event_details.tvs.count >= race.event_details.tvs.required) {
            progress += 16.6 ;
          }
          if (race.event_details.wheels.count >= race.event_details.wheels.required) {
            progress += 16.6 ;
          }
          if (race.event_details.coaches.count >= race.event_details.coaches.required) {
            progress += 16.6 ;
          }
          race.total_progress = progress;
          return race;
        });
      }, error => this.errorMessage = <any>error);
  }

  selectRace(e) {
    this.selectedRace = e.data;
  }

}

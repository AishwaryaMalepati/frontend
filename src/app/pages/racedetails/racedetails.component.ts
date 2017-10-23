import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Router} from "@angular/router";


@Component({
  selector: 'app-racedetails',
  templateUrl: './racedetails.component.html',
  styleUrls: ['./racedetails.component.css']
})
export class RacedetailsComponent implements OnInit {

  displayDialog: boolean;
  selectedRace: Race;
  isnew: boolean;
  newRace: Race;
  races: Race[];
  race: Race;
  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getList('race').subscribe((response) => {
      console.log(response)         ;
      this.races = response;
    });
    this.newRace = new Race();
  }
  showDialogToAdd() {
    this.isnew = true;
    this.race = new Race();
    this.displayDialog = true;
  }
  save() {
    let races = [...this.races];
    if (this.isnew) {
      races.push(this.race);
      this.eventService.saveEvent(this.race, 'race') .subscribe((response) => {
      });

      var defaultResourceCount,
          body;

      let curRace = this.race;
      this.eventService.getList('race_resource_count_default')
        .subscribe((response) => {
          defaultResourceCount = response;
          body = defaultResourceCount.filter((d, i) => { if (d['race_location'] === curRace.race_location) return true;});
          body = Object.assign({year: curRace.year, race: body[0]['race_location']}, body[0]);
          this.eventService.saveEvent(body, 'race_resource_count_by_year').subscribe((response) => {});
        });
    }
    else {
      races[this.findSelectedRaceIndex()] = this.race;
      this.eventService.updateEvent(this.race, 'race')
        .subscribe((response) => {

        });
    }
    this.races = races;
    this.race = null;
    this.displayDialog = false;
  }
  delete() {
    let index = this.findSelectedRaceIndex();
    this.races = this.races.filter((val,i) => i!=index);
    this.eventService.deleteEvent(this.selectedRace.id, 'race') .subscribe((response) => {

    });
    this.race = null;
    this.displayDialog = false;
  }
  onRowSelect(event) {
    this.isnew = false;
    this.race = this.cloneRace(event.data);
    this.displayDialog = true;
  }
  cloneRace(c: Race): Race {
    let race = new Race();
    for (let prop in c) {
      race[prop] = c[prop];
    }
    return race;
  }
  findSelectedRaceIndex(): number {
    return this.races.indexOf(this.selectedRace);
  }
}

export class Race {
  id: number;
  race_location: string;
  year: number;
  mec_date: any;
  nxs_date: any;
  ctws_date: any;
}

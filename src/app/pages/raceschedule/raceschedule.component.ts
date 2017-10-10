import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Router} from "@angular/router";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-raceschedule',
  templateUrl: './raceschedule.component.html',
  styleUrls: ['./raceschedule.component.css']
})
export class RacescheduleComponent implements OnInit {
  races: any[]=[];
  vehicles: any[]=[];
  coaches: any[]=[];
  trailers: any[]=[];
  groups:any[]=[];
  selectedRace: object;
  errorMessage: string;
  public constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    Observable.forkJoin([ this.eventService.getList('vehicle'), this.eventService.getList('trailer'),
      this.eventService.getList('groups'), this.eventService.getList('race_schedule')])
      .subscribe((response) => {
        this.vehicles = response[0].filter( (v) => {
          if(v.type === 6) {
            v.vehicle = v.name;
            v.label = v.name;
            v.value = v.id;
            return v;
          }
        });
        this.coaches = response[0].filter( (v) => {
          if(v.type === 7) {
            v.vehicle = v.name;
            v.label = v.name;
            v.value = v.id;
            return v;
          }
        });
        this.trailers = response[1].filter( (t) => {
          t.tName = t.name;
          t.label = t.name;
          t.value = t.id
          return t;
        });
        this.groups = response[2].filter( (g) => {
          g.gName = g.group_name;
          g.label = g.group_name;
          g.value = g.id
          return g;
        });
        var races_ = [];
        this.races = response[3].map((race) => {
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
          race['coaches'] = this.getTableData('coaches', race);
          race['cups'] = this.getTableData('cups', race);
          race['nxs'] = this.getTableData('nxs', race);
          race['titans'] = this.getTableData('titans', race);
          race['tvs'] = this.getTableData('tvs', race);
          race['wheels'] = this.getTableData('wheels', race);
          return race;
        });
        console.log(this.vehicles);
        console.log(this.trailers);
        console.log(this.races);

      }, error => this.errorMessage = <any>error);


  }
  getTableData(type: string, race) {
    let data = [];
    const temp = race['event_details'][type];
    temp['drivers']['names'].forEach( (name, i) => {
      data.push({dId: temp.drivers.ids[i], dName: name,
        vId: temp.vehicles.ids[i] ? temp.vehicles.ids[i] : '',
        vehicle: temp.vehicles.names[i] ? temp.vehicles.names[i] : '',
        tId: temp.trailers.ids[i] ? temp.trailers.ids[i] : '',
        tName: temp.trailers.names[i] ? temp.trailers.names[i] : '',
        gId: temp.groups.ids[i] ? temp.groups.ids[i] : '',
        gName: temp.groups.names[i] ? temp.groups.names[i] : '',
      })
    });
    return data;
  }
  changeVehicle(evt, cup) {
    cup['vehicle'] = evt.originalEvent.target.innerText.trim();
    cup['vId'] = evt.value;
    const query = `?employee=${cup.dId}&location=${this.selectedRace['race_location_id']}&vehicle=${evt.value}`;
    this.updateData(query);
  }
  changeTrailer(evt, cup) {
    cup['tName'] = evt.originalEvent.target.innerText.trim();
    cup['tId'] = evt.value;
    const query = `?employee=${cup.dId}&location=${this.selectedRace['race_location_id']}&trailer=${evt.value}`;
    this.updateData(query);
  }
  changeGroup(evt, cup) {
    cup['gName'] = evt.originalEvent.target.innerText.trim();
    cup['gId'] = evt.value;
    const query = `?employee=${cup.dId}&location=${this.selectedRace['race_location_id']}&group=${evt.value}`;
    this.updateData(query);
  }
  updateData(query) {

    this.eventService.updateRaceInfo(query)
      .subscribe((response) => {

      });
  }
  goBack() {
    this.selectedRace = null;
  }
  selectRace(e) {
    this.selectedRace = e.data;
  }

}

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
  years: any[]=[];
  rcounts: any[]=[];
  defaultrcounts: any[]=[];
  vehicles: any[]=[];
  coaches: any[]=[];
  trailers: any[]=[];
  groups: any[]=[];
  employeesAtTrack: object;
  employeesForDuty: any[]=[];
  selectedRace: object;
  selectedEmps: any[]=[];
  airTitanDutyEmployees: object;
  availableEmployees: any[]=[];
  selectedYear: string;
  isnew: boolean;
  displayDialog: boolean;
  displayDriverDialog: boolean;
  newEvent: MyEvent;
  selectedResourceCount: ResourceCount;
  resourceCount: ResourceCount;
  RCType: string;
  errorMessage: string;
  events: any[];
  public constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    Observable.forkJoin([ this.eventService.getList('vehicle'), this.eventService.getList('trailer'), this.eventService.getList('groups'),
      this.eventService.getList('race_schedule'), this.eventService.getList('race_resource_count_default'), this.eventService.getList('employees_at_track')])
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
        this.years = response[3].filter( (y) => {
          y.year = y.year;
          y.label = y.year;
          y.value = y.year;
          return y;
        } );
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

        var defaultrcounts_ = [];
        this.defaultrcounts = response[4].map((defaultrcount) => { return defaultrcount; })

        this.employeesAtTrack = {};
        for (var loc_id in response[5]) {
          var employees = [];
          for (var i=0; i < response[5][loc_id]['ids'].length; i++) {
            employees.push({
              value: response[5][loc_id]['ids'][i],
              label: response[5][loc_id]['names'][i]
            })
          }
          this.employeesAtTrack[loc_id] = employees;
        }

        console.log(this.vehicles);
        console.log(this.trailers);
        console.log(this.races);
        console.log(this.employeesAtTrack);
        console.log(this.defaultrcounts);

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
  getResourceCountByYear() {
    var query = '';
    if (this.selectedYear) {
      query = `year=${this.selectedYear}`;
    }
    this.eventService.getList('race_resource_count_by_year', query)
      .subscribe((response) => {
        this.rcounts = response.map((rcount) => {
          rcount.race_location = rcount.race;
          delete rcount.race;
          return rcount;
        });
      });
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
  changeGroup(evt, cup, curGroup) {
    cup['gName'] = evt.originalEvent.target.innerText.trim();
    cup['gId'] = evt.value;
    const query = `?employee=${cup.dId}&location=${this.selectedRace['race_location_id']}&group=${evt.value}`;
    this.updateData(query, cup.dId, curGroup, cup['gName']);
  }
  updateData(query, driverId=null, curGroup=null, newGroup=null) {

    this.eventService.updateRaceInfo(query)
      .subscribe((response) => {
        this.updateDriverGroup(driverId, curGroup, newGroup);
        console.log(this.selectedRace);
      });
  }
  updateDriverGroup(driverId, curGroup, newGroup) {
    var curGroupDrivers = [];
    var newGroupDrivers = [];
    var updatedDriver;
    var newGroupKey;
    for (var i=0; i < this.selectedRace[curGroup].length; i++) {
      if (this.selectedRace[curGroup][i].dId != driverId) {
        curGroupDrivers.push(this.selectedRace[curGroup][i]);
      } else {
        updatedDriver = this.selectedRace[curGroup][i];
      }
    }
    this.selectedRace[curGroup] = curGroupDrivers;

    if (newGroup === 'Air Titan') {
      newGroupKey = 'titans';
    } else if (newGroup === 'Box Truck') {
      newGroupKey = 'cups';
    } else if (newGroup === 'Coach') {
      newGroupKey = 'coaches';
    } else if (newGroup === 'Xfinity') {
      newGroupKey = 'nxs';
    } else if (newGroup === 'TV') {
      newGroupKey = 'tvs';
    } else if (newGroup === 'Wheels') {
      newGroupKey = 'wheels';
    }

    newGroupDrivers = this.selectedRace[newGroupKey].slice();
    newGroupDrivers.push(updatedDriver);
    this.selectedRace[newGroupKey] = newGroupDrivers;
  }
  saveDutyEmps(duty_id) {
    this.eventService.saveEvent({emp_ids: this.selectedEmps, duty_id: duty_id, race_id: this.selectedRace['id']}, 'race_duty')
      .subscribe((response) => {
        if (response['success']) {
          this.airTitanDutyEmployees = response['data'];
          this.selectedEmps = [];
        }
      });
  }
  goBack() {
    this.selectedRace = null;
    this.employeesForDuty = null;
  }
  selectRace(e) {
    this.selectedRace = e.data;
    this.employeesForDuty = this.employeesAtTrack[this.selectedRace['race_location_id']];
    var queryParams = 'race_id=' + e.data['id'] + '&duty_id=' + 1; // air titan duty
    this.eventService.getList('race_duty', queryParams)
      .subscribe((response) => {
        if (response['success']) {
          this.airTitanDutyEmployees = response['data'];
        }
      });

    var query = 'race_location=' + this.selectedRace['race_location_id'] + '&year=' + this.selectedRace['year'];
    this.eventService.getList('employeegroup/available', query)
      .subscribe((response) => {
        this.availableEmployees = response;
      });
  }
  removeEmployee(emp_id, duty_id) {
    this.eventService.updateEvent({'id': emp_id, 'duty_id': duty_id, 'race_id': this.selectedRace['id']}, 'race_duty')
      .subscribe((response) => {
        if (response['success']) {
          this.airTitanDutyEmployees = response['data'];
        }
      });
  }
  showDialogToAdd() {
    this.displayDialog = true;
  }
  showDriverDialog(group) {
    this.displayDriverDialog = true;
    this.newEvent = new MyEvent();
    this.newEvent.location = this.selectedRace['race_location'];
    this.newEvent.employee_race_group = group;
  }
  saveEvent() {
    this.eventService.saveEvent(this.newEvent, 'employeelocations')
      .subscribe((response) => {
        var dName, vName, gName, tName, gAlias;
        for (var i=0; i < this.availableEmployees.length; i++) {
          if (this.availableEmployees[i]['value'] == this.newEvent.employee) {
            dName = this.availableEmployees[i]['label'];
            break;
          }
        }
        for(var i=0; i < this.vehicles.length; i++) {
          if (this.vehicles[i]['value'] == response.employee_vehicle) {
            vName = this.vehicles[i]['label'];
            break;
          }
        }
        if (!vName) {
          for (var i=0; i < this.coaches.length; i++) {
            if (this.coaches[i]['value'] == response.employee_vehicle) {
              vName = this.coaches[i]['label'];
            }
          }
        }
        for (var i=0; i < this.groups.length; i++) {
          if (this.groups[i]['value'] == response.employee_race_group) {
            gName = this.groups[i]['label'];
            break;
          }
        }
        for (var i=0; i < this.trailers.length; i++) {
          if (this.trailers[i]['value'] == response.employee_trailer) {
            tName = this.trailers[i]['label'];
            break;
          }
        }

        if (gName === 'Box Truck') {
          gAlias = 'cups';
        } else if (gName === 'Xfinity') {
          gAlias = 'nxs';
        } else if (gName === 'Air Titan') {
          gAlias = 'titans';
        } else if (gName === 'Coach') {
          gAlias = 'coaches';
        } else if (gName === 'Wheels') {
          gAlias = 'wheels';
        } else if (gName === 'TV') {
          gAlias = 'tvs';
        }

        var selectedRace = this.selectedRace;
        selectedRace[gAlias].push({
          dId: response.employee,
          dName: dName,
          vId: response.employee_vehicle,
          vehicle: vName,
          gId: response.employee_race_group,
          gName: gName,
          tId: response.employee_trailer,
          tName: tName
        });
        this.selectedRace = JSON.parse(JSON.stringify(selectedRace));

        this.availableEmployees = this.availableEmployees.filter((emp) => {
          if (emp['value'] != response.employee) {
            return true;
          }
        });

        this.displayDriverDialog = false;
      });
  }
  removeRaceEmployee(empDetails, type) {
    this.eventService.deleteEventinRange('createschedule/delete_emp_events/?emp_id=' + empDetails['dId'])
      .subscribe((response) => {
        this.selectedRace[type] = this.selectedRace[type].filter((emp) => {if (emp['dId'] != empDetails['dId']) return true;});

        var availableEmps = this.availableEmployees;
        availableEmps.push({
          label: empDetails['dName'],
          value: empDetails['dId']
        });
        this.availableEmployees = JSON.parse(JSON.stringify(availableEmps));
      });
  }
  addResourceCount(type) {
    this.isnew = true;
    this.resourceCount = new ResourceCount();
    this.RCType = type;
    this.displayDialog = true;
  }
  saveResourceCount(type) {
    var resourceCounts,
        apiLink,
        body;

    if (type === 'default') {
      resourceCounts = [...this.defaultrcounts];
      apiLink = 'race_resource_count_default';
      body = this.resourceCount;
    } else if (type === 'selectedYear') {
      resourceCounts = [...this.rcounts];
      apiLink = 'race_resource_count_by_year';
      body = Object.assign({year: this.selectedYear, race: this.resourceCount.race_location}, this.resourceCount);
    }

    if (this.isnew) {
      this.eventService.saveEvent(body, apiLink)
        .subscribe((response) => {
          resourceCounts.push(this.cloneResourceCount(response));
          this.updateCounts(resourceCounts, type);
        });
    } else {
      resourceCounts[this.findResourceCountByIndex(type)] = this.resourceCount;
      this.eventService.updateEvent(body, apiLink)
        .subscribe((response) => {});
      this.updateCounts(resourceCounts, type);
    }

    this.resourceCount = null;
    this.displayDialog = false;
  }
  deleteResourceCount(type) {
    var apiLink;

    let index = this.findResourceCountByIndex(type);

    if (type === 'default') {
      apiLink = 'race_resource_count_default';
      this.defaultrcounts = this.defaultrcounts.filter((val,i) => i!=index);
    } else if (type === 'selectedYear') {
      apiLink = 'race_resource_count_by_year';
      this.rcounts = this.rcounts.filter((val,i) => i!=index);
    }

    this.eventService.deleteEvent(this.resourceCount.id, apiLink)
      .subscribe((response) => {});

    this.resourceCount = null;
    this.displayDialog = false;
  }
  updateCounts(resourceCounts, type) {
    if (type === 'default') {
      this.defaultrcounts = resourceCounts;
    } else if (type === 'selectedYear') {
      this.rcounts = resourceCounts;
    }
  }
  cloneResourceCount(c: ResourceCount): ResourceCount {
    let resourceCount = new ResourceCount();
    for (let prop in c) {
      resourceCount[prop] = c[prop];
    }
    return resourceCount;
  }
  onRowSelect(event, type) {
    this.isnew = false;
    this.resourceCount = this.cloneResourceCount(event.data);
    this.displayDialog = true;
    this.RCType = type;
  }
  findResourceCountByIndex(type) {
    if (type === 'default') {
      return this.defaultrcounts.indexOf(this.selectedResourceCount);
    } else if (type === 'selectedYear') {
      return this.rcounts.indexOf(this.selectedResourceCount);
    }
  }
  assignEmp(e) {
    var emp_id = e.data['value'];

    this.displayDriverDialog = true;
    this.newEvent = new MyEvent();
    this.newEvent.employee = emp_id;
    this.newEvent.location = this.selectedRace['race_location'];
  }
  goTo(location: string): void {
    window.location.hash = '';
    window.location.hash = location;
  }
  navigateTo(location: string): void {
// location will be a valid CSS ID selector; i.e. it should be preceded with '#'
    window.location.hash = location;
    setTimeout(() => {
      document.querySelector(location).parentElement.scrollIntoView();
    });
  }
}

export class ResourceCount {
  id: number;
  race_location: string;
  cup_box_trailer: number;
  nxs_box_trailer: number;
  titan_trailer: number;
  wheel_trailer: number;
  coach: number;
  titan_trucks: number;
}

export class MyEvent {
  id: number;
  location: string;
  start: any;
  end: any;
  employee: number;
  employee_race_group: number;
  // allDay: boolean = true;
}

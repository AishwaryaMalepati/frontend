import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-createschedule',
  templateUrl: './createschedule.component.html',
  styleUrls: ['./createschedule.component.css']
})
export class CreatescheduleComponent implements OnInit {
  groups: any[]=[];
  employeesBack: any[]=[];
  overlapEvents: any[]=[];
  employees: any[]=[];
  locations: any[] = [];
  selectedGroups: any[] = [];
  overlapMsg: string='';
  errorMessage: string;
  myScedule: MyScedule;
  event: MyEvent;
  dialogVisible: boolean = false;
  isOverlap: boolean = false;
  successDialogVisible: boolean = false;
  curEventIndex: number;

  public constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.myScedule = new MyScedule();
    this.loadEvents();
  }

  loadEvents(){
    this.eventService.getList('groups')
      .subscribe(groups => {
          groups = groups.map((group)=>{
            group.label = group.group_name;
            group.value = group.id;
            return group;
          });
          this.groups = groups;
        },
        error => this.errorMessage = <any>error);
    this.eventService.getList('locations').subscribe((response) => {
      this.locations = response;
    });
    this.eventService.getList('employeegroup')
      .subscribe(employees => {
          employees = employees.map((emp)=>{
            emp.label = emp.first_name + ' '+emp.last_name;
            emp.value = emp.id;
            return emp;
          });
          this.employeesBack = employees;
        },
        error => this.errorMessage = <any>error);
  }
  filterEmployees(evt) {
    this.employees = this.employeesBack.filter( (emp) => evt.value.indexOf(emp.group)>= 0 );
  }
  changeLoc() {
    this.locations.map( (loc) => {
      if(loc.id == this.event.id){
        this.event.location = loc.location_name;
      }
    });
  }
  cancelEvent() {
    this.dialogVisible = false;
    this.isOverlap = false;
  }
  createNew() {
    this.curEventIndex = -1;
    this.event = new MyEvent();
    this.dialogVisible = true;
  }
  saveEvent() {
    if(this.curEventIndex >= 0){
      if (!this.isOverlap) {
        this.myScedule.events[this.curEventIndex] = this.event;
      } else {
        this.overlapEvents[this.curEventIndex] = this.event;
        this.eventService.updateEvent(this.event, 'createschedule')
          .subscribe(event => {
              if (event.warning_message != 'overlaps') {
                this.overlapEvents.splice(this.curEventIndex, 1);
              }
            },
            error => {this.errorMessage = <any>error;  this.dialogVisible = false;});
      }
      this.curEventIndex = -1;
      this.isOverlap = false;
    } else {
      this.myScedule.events.push(this.event);
    }
    this.dialogVisible = false;
  }
  editEvent(index, overlap=false) {
    this.curEventIndex = index;
    if (!overlap) {
      this.event = Object.assign({}, this.myScedule.events[index]);
    } else {
      var evt = this.overlapEvents[index];
      evt.start = new Date(evt.start);
      evt.end = new Date(evt.end);
      this.event = Object.assign({}, evt);
      this.isOverlap = true;
    }
    this.dialogVisible = true;
  }
  deleteEvent(index, overlap=false) {
    if (!overlap) {
      this.myScedule.events.splice(index, 1);
    } else {
      const evt_id = this.overlapEvents[index].id;
      this.eventService.deleteEvent(evt_id, 'createschedule')
        .subscribe(res => {
            this.overlapEvents.splice(index, 1);
          },
          error => {this.errorMessage = <any>error;});
    }
  }
  saveSchedule() {
    let evnts = [];
    this.myScedule.employees.map( (emp) => {
      this.myScedule.events.map( (evt) => {
        //evt.employee = emp;
        evnts.push(Object.assign({employee: emp}, evt));
      });
    });
    this.eventService.saveEvent({events: evnts}, 'createschedule')
      .subscribe(res => {
          //this.router.navigate(['/allschedules']);
          this.overlapEvents = res.filter(item => {
            if(item.warning_message === 'overlaps'){
              var emps = this.employees.filter(emp=>emp.id == item.employee);
              item.empName = emps[0].first_name+' '+emps[0].last_name;
              return item;
            }
          });

          this.successDialogVisible = true;
        },
        error => {this.errorMessage = <any>error;  this.dialogVisible = false;});
  }
  closeDialog() {
    this.myScedule = new MyScedule();
    this.overlapEvents = [];
    this.selectedGroups = [];
    this.successDialogVisible = false;

  }
}


export class MyScedule {
  id: number;
  employees: any;
  events:any = [];
}
export class MyEvent {
  id: number;
  location: string;
  start: any;
  end: any;
  employee: number;
  // allDay: boolean = true;
}

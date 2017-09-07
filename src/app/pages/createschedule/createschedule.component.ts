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
  }
  createNew() {
    this.curEventIndex = -1;
    this.event = new MyEvent();
    this.dialogVisible = true;
  }
  saveEvent() {
    if(this.curEventIndex >= 0){
      this.myScedule.events[this.curEventIndex] = this.event;
      this.curEventIndex = -1;
    } else {
      this.myScedule.events.push(this.event);
    }
    this.dialogVisible = false;
  }
  editEvent(index) {
    this.curEventIndex = index;
    this.event = Object.assign({}, this.myScedule.events[index]);
    this.dialogVisible = true;
  }
  deleteEvent(index) {
    this.myScedule.events.splice(index, 1);
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

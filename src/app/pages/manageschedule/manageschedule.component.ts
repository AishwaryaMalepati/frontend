import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";
import {EventService} from '../../services/event.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manageschedule',
  templateUrl: './manageschedule.component.html',
  // styleUrls: ['./manageschedule.component.css']
})
export class ManagescheduleComponent implements OnInit {
  actions: any[]=[];
  groups: any[]=[];
  employeesBack: any[]=[];
  employees: any[]=[];
  ddlEmployees: any[]=[];
  selectedEmployees: any[]=[];
  locations: any[] = [];
  selectedGroups: any[] = [];
  errorMessage: string;
  fromDate: any;
  toDate: any;
  selectedEmp1: number;
  selectedEmp2: number;
  successDialogVisible: boolean = false;
  selectedAction: number;

  constructor(private eventService:EventService) {

  }

  ngOnInit() {
    this.loadEvents();
    this.actions = [
      {label:'Select', value:0},
      {label:'Swap', value:1},
      {label:'Copy', value:3},
      {label:'Clear', value:2}
    ];

  }

// loading groups, locations and Employes
  loadEvents() {
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
          this.ddlEmployees = employees;
        },
        error => this.errorMessage = <any>error);

  }

  //filter employees based on groups
  filterEmployees(evt) {
    console.log(evt.value);
    this.employees = this.employeesBack.filter( (emp) => evt.value.indexOf(emp.group)>= 0 );
  }

  //update events for swap, copy and clear
  updateEvents() {
    if (this.selectedAction != 2) {
      const reqObj = {emp1: this.selectedEmp1, emp2: this.selectedEmp2, start: this.convertDate(this.fromDate), end: this.convertDate(this.toDate)};
      const url = this.selectedAction === 3? 'createschedule/copy': 'createschedule/swap';
      this.eventService.saveEvent(reqObj, url)
        .subscribe(res => {
            this.successDialogVisible = true;
          },
          error => {this.errorMessage = <any>error;  this.successDialogVisible = false;});
    } else {

      var url = `createschedule/delete_in_range/?emp_ids=${this.selectedEmployees}&ip_start=${this.convertDate(this.fromDate)}&ip_end=${this.convertDate(this.toDate)}`

      this.eventService.deleteEventinRange(url)
        .subscribe(res => {
            this.successDialogVisible = true;
          },
          error => {this.errorMessage = <any>error;  this.successDialogVisible = false;});
    }
  }

  // for converting date format to YYYY-MM-DD
  convertDate(date){
    return moment(date).format('YYYY-MM-DD');

  }
  closeDialog() {
    this.selectedGroups = [];
    this.fromDate = null;
    this.toDate = null;
    this.selectedEmp1 = -1;
    this.selectedEmp2 = -1;
    this.selectedAction = 0;
    this.successDialogVisible = false;
  }
}

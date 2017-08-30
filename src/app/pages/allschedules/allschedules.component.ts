import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {EventService} from '../../services/event.service';
declare var jQuery: any;

@Component({
  selector: 'app-allschedules',
  templateUrl: './allschedules.component.html',
  styleUrls: ['./allschedules.component.css']
})
export class AllschedulesComponent implements OnInit, AfterViewChecked {
  events: any[];
  eventsBack: any[];
  locations: any[];
  resources: any[];
  headerConfig: any;
  resourceCol: any[];
  event: MyEvent;
  dialogVisible: boolean = false;
  errorMessage: string;
  isBindEvents = false;

  public constructor(private eventService: EventService) { }

  ngOnInit(): void {

    this.headerConfig = {
      left: 'prev,next today',
      center: 'title',
      right: 'timelineMonth,timelineWeek,timelineDay'
    };
    this.eventService.getList('locations').subscribe((response) => {
      this.locations = response;
      this.loadEmps();
    });

  }
  ngAfterViewChecked() {
    if(!this.isBindEvents) {

      jQuery('#external-events .fc-event').each(function(i) {

        jQuery(this).draggable({
          zIndex: 999,
          revert: true,
          revertDuration: 0
        });
        this.isBindEvents = true;
      });

    }
  }
  loadEmps() {
    Observable.forkJoin([this.eventService.getList('employees'),this.eventService.getList('employeelocations')])
      .subscribe((response) => {
        let employees = response[0];
        this.resources = response[0];//.filter((emp) => emp.group != null );
        var evnts = [];

        this.events = response[1].map((loc)=>{loc.title = loc.location;loc.resourceId = loc.employee; return loc;});
        this.eventsBack = response[1].map((loc)=>{loc.title = loc.location;loc.resourceId = loc.employee; return loc;});
        console.log(this.events);
        this.resourceCol = [ {
          group: true,
          labelText: 'Group',
          field: 'group'
        },
          {
            labelText: 'Employee',
            field: 'first_name'
          }];
        console.log('testing1');
        this.bindEvents();
      });
  }
  bindEvents() {
    console.log('testing3');
    jQuery('#external-events .fc-event').each(function() {
      jQuery(this).data('event', {
        title: jQuery.trim(jQuery(this).text()),
        stick: true
      });
    });
  }




  handleDayClick(event) {
    this.event = new MyEvent();
    this.event.start = event.date.format();
    this.dialogVisible = true;
  }

  handleEventClick(e) {
    this.handleEvent(e.calEvent,e.view.name, true);
  }

  handleEventDrop(e) {
    this.handleEvent(e.event,e.view.name, false);
  }

  handleEvent(event,view, isShowDialog){
    this.event = new MyEvent();
    this.event.location = event.title;

    let start = event.start;
    let end = event.end;


    if(end) {
      // end.stripTime();
      //this.event.end = new Date(end._i.replace('T',' ').replace('Z',''));
      this.event.end = new Date(end.format().replace('T',' ').replace('Z',''));
    }
    if(event.id){
      this.event.id = event.id;
    }
    this.event.employee = event.resourceId;
    //this.event.start = new Date(start._i.replace('T',' ').replace('Z',''));
    this.event.start = new Date(start.format().replace('T',' ').replace('Z',''));
    this.event.allDay = event.allDay;

    if(isShowDialog){
      this.dialogVisible = true;
    } else {
      this.saveEvent(false)
    }
  }

  saveEvent(isEdit) {
    if(this.event.id) {
      let index: number = this.findEventIndexById(this.event.id);
      if(index >= 0) {
        if(isEdit){
          this.events = [];
        }
        this.eventService.updateEvent(this.event, 'employeelocations')
          .subscribe(event => {
              if(isEdit){
                this.eventsBack[index].end = event.end;
                this.eventsBack[index].start = event.start;
                this.events = this.eventsBack;
                console.log(this.events);
                this.dialogVisible = false;
              }
            },
            error => {this.errorMessage = <any>error;  this.dialogVisible = false;});
      }
    }
    else {
      this.eventService.saveEvent(this.event, 'employeelocations')
        .subscribe(event => {
            event.title = event.location;event.resourceId = event.employee;
            this.events.push(event);
            this.event = null;
            console.log(this.events);
            this.dialogVisible = false;
          },
          error => {this.errorMessage = <any>error;  this.dialogVisible = false;});

    }


  }

  deleteEvent() {
    let index: number = this.findEventIndexById(this.event.id);
    if(index >= 0) {
      this.eventService.deleteEvent(this.event.id, 'employeelocations')
        .subscribe(events => {this.events.splice(index, 1); this.dialogVisible = false;},
          error => {this.errorMessage = <any>error;  this.dialogVisible = false;});
    }
  }

  findEventIndexById(id: number) {
    let index = -1;
    for(let i = 0; i < this.events.length; i++) {
      if(id == this.events[i].id) {
        index = i;
        break;
      }
    }

    return index;
  }
}

export class MyEvent {
  id: number;
  location: string;
  start: any;
  end: any;
  employee: number;
  allDay: boolean = true;
}

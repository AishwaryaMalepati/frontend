import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';

@Component({
  selector: 'app-myschedule',
  templateUrl: './myschedule.component.html',
  styleUrls: ['./myschedule.component.css']
})
export class MyscheduleComponent implements OnInit {
  events: any[];
  headerConfig: any;
  errorMessage: string;
  header: any;
  event: MyEvent;
  dialogVisible: boolean = false;
  idGen: number = 100;

  public constructor(private eventService: EventService) { }

  ngOnInit() {
    this.headerConfig = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    this.loadEvents();
  }

  loadEvents(){
    this.eventService.getList('events')
      .subscribe(events => { this.events = events.map((evt)=>{evt.title = evt.event; return evt;});},
        error => this.errorMessage = <any>error);
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
    this.event.event = event.title;

    let start = event.start;
    let end = event.end;
    if(view === 'month') {
      start.stripTime();
    }

    if(end) {
      end.stripTime();
      this.event.end = new Date(end._i.replace('T',' ').replace('Z',''));
    }

    this.event.id = event.id;
    this.event.start = new Date(start._i.replace('T',' ').replace('Z',''));
    this.event.allDay = event.allDay;

    if(isShowDialog){
      this.dialogVisible = true;
    } else {
      this.saveEvent()
    }
  }

  saveEvent() {
    //update
    if(this.event.id) {
      let index: number = this.findEventIndexById(this.event.id);
      if (index >= 0) {
        this.eventService.updateEvent(this.event, 'events')
          .subscribe(event => {this.events[index] = event; this.events[index].title = event.event; this.dialogVisible = false; } ,
            error => {this.errorMessage = <any>error;  this.dialogVisible = false; });
      }
    }
    /*  //new
     else {
     this.event.id = this.idGen++;
     this.events.push(this.event);
     this.event = null;
     } */


  }

  deleteEvent() {
    let index: number = this.findEventIndexById(this.event.id);
    if (index >= 0) {
      this.eventService.deleteEvent(this.event.id, 'events')
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
  event: string;
  start: any;
  end: any;
  allDay: boolean = true;
}

import { Component, OnInit } from '@angular/core';
import {EventService} from '../../services/event.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-perdiemcalculator',
  templateUrl: './perdiemcalculator.component.html',
  styleUrls: ['./perdiemcalculator.component.css']
})
export class PerdiemcalculatorComponent implements OnInit {
  current_period: string;
  perdiemList: any[]=[];
  errorMessage: string;

  public constructor(private eventService: EventService, private router: Router) { }

  getCurMonthName(date) {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()];
  };

  ngOnInit() {
    const today = new Date();
    const monthLabels = ['Mar-Apr', 'Apr-May', 'May-Jun', 'Jun-Jul', 'Jul-Aug', 'Aug-Sep', 'Sep-Oct', 'Oct-Nov'];
    var curMonthName = this.getCurMonthName(today);

    if (['Jan', 'Feb'].indexOf(curMonthName) !== -1) {
      this.current_period = 'Jan-Mar';
    } else if (curMonthName === 'Nov') {
      this.current_period = 'Oct-Nov';
    } else {
      this.current_period = monthLabels.find(function(el) {
        return el.startsWith(curMonthName);
      });

      if (today.getDate() < 15) {
        const monthIndex = monthLabels.indexOf(this.current_period);
        this.current_period = monthLabels[monthIndex - 1];
      }
    }
  }

  calculatePerdiem() {
    this.eventService.saveEvent({}, 'perdiem')
      .subscribe(event => {
          this.perdiemList = event;
        },
        error => {this.errorMessage = <any>error;}
      );
  }
}

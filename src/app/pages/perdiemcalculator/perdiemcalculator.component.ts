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
  showWarning: boolean = false;
  statusMessage: string;

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

    this.calculatePerdiem();
  }

  closeDialog() {
    this.showWarning = false;
  }

  calculatePerdiem(forceCalculate=false) {
    if (this.perdiemList.length) {
      this.showWarning = true;
    }
    if (forceCalculate || !this.perdiemList.length) {
      if (this.showWarning) {
        this.statusMessage = 'Updating records...';
      } else {
        this.statusMessage = 'Getting records...'
      }

      this.perdiemList = [];
      this.showWarning = false;

      this.eventService.saveEvent({}, 'perdiem')
        .subscribe(event => {
            this.perdiemList = event;
            this.statusMessage = '';
          },
          error => {
            this.errorMessage = <any>error;
            this.statusMessage = 'Failed to get records. Please try again!';
          }
        );
    }
  }
}

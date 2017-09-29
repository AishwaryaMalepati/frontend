import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { fakeBackendProvider } from './helpers/index';
// import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RoutingModule } from './app.routes';
// services
// import { AuthService } from './services/auth.service';

import {EventService} from './services/event.service';
import { AuthGuard } from './guards/index';
import { AuthenticationService, UserService } from './services/index';
// full calendar
import 'jquery';
import 'moment';
import 'fullcalendar';

// primeng components
import {PanelModule, ScheduleModule, DialogModule, CalendarModule, DropdownModule} from 'primeng/primeng';
import {InputTextModule, CheckboxModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {MenubarModule, MultiSelectModule} from 'primeng/primeng';
import {DataTableModule, SharedModule} from 'primeng/primeng';

import { MyscheduleComponent } from './pages/myschedule/myschedule.component';
import { CreatescheduleComponent } from './pages/createschedule/createschedule.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './base_components/navbar/navbar.component';
import { SidebarComponent } from './base_components/sidebar/sidebar.component';
import { FooterComponent } from './base_components/footer/footer.component';
import { AllschedulesComponent } from './pages/allschedules/allschedules.component';
import { PerdiemComponent } from './pages/perdiem/perdiem.component';
import { NascarcalendarComponent } from './base_components/nascarcalendar/nascarcalendar.component';
import { ManagescheduleComponent } from './pages/manageschedule/manageschedule.component';
import { PerdiemcalculatorComponent } from './pages/perdiemcalculator/perdiemcalculator.component';
import { RacescheduleComponent } from './pages/raceschedule/raceschedule.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyscheduleComponent,
    SchedulerComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AllschedulesComponent,
    CreatescheduleComponent,
    PerdiemComponent,
    NascarcalendarComponent,
    ManagescheduleComponent,
    PerdiemcalculatorComponent,
    RacescheduleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    PanelModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    GrowlModule,
    ScheduleModule,
    DialogModule,
    CalendarModule,
    MenubarModule,
    MultiSelectModule,
    DataTableModule,
    SharedModule,
    DropdownModule
  ],
//  providers: [AuthService],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    EventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

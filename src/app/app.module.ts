import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FlightViewComponent } from './flight-view/flight-view.component';
import { SafePipePipe } from './safe-pipe.pipe';
import { Time24to12hrsPipe } from './time24to12hrs.pipe';
import { TrainViewComponent } from './train-view/train-view.component';
import { HotelViewComponent } from './hotel-view/hotel-view.component';
import { RestaurantViewComponent } from './restaurant-view/restaurant-view.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {GoogleLoginProvider, FacebookLoginProvider} from 'angularx-social-login';
import { TripPlannerComponent } from './trip-planner/trip-planner.component';
import { TripViewComponent } from './trip-view/trip-view.component';
import { SharedServiceService } from './shared-service.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FlightViewComponent,
    SafePipePipe,
    Time24to12hrsPipe,
    TrainViewComponent,
    HotelViewComponent,
    RestaurantViewComponent,
    TripPlannerComponent,
    TripViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocialLoginModule
  ],
  providers: [
    SharedServiceService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('912075288149-il98c70jrkt788eruncr4omfhd5uvaoq.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('324995745163913')
          }
        ],
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FlightViewComponent } from './flight-view/flight-view.component';
import { TrainViewComponent } from './train-view/train-view.component';
import { HotelViewComponent } from './hotel-view/hotel-view.component';
import { RestaurantViewComponent } from './restaurant-view/restaurant-view.component';
import { TripPlannerComponent } from './trip-planner/trip-planner.component';
import { TripViewComponent } from './trip-view/trip-view.component';


const routes: Routes = [
  {
    path : '',
    component : HomeComponent

  },
  {
    path : 'about',
    component : AboutComponent

  },
  {
    path : 'contact',
    component : ContactComponent

  },
  {
    path : 'flights',
    component : FlightViewComponent

  },
  {
    path : 'trains',
    component : TrainViewComponent

  },
  {
    path : 'hotels',
    component : HotelViewComponent

  },
  {
    path : 'restaurants',
    component : RestaurantViewComponent

  },
  {
    path : 'planner',
    component : TripPlannerComponent

  },
  {
    path : 'planViewer',
    component : TripViewComponent

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

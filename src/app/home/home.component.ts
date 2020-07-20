import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import airport_list from '../../assets/airport_list.json';
import station_list from '../../assets/stations.json';
import city_list from '../../assets/countries.json';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('closeModal') closeModal:ElementRef;
  @ViewChild('signInModal') signInModal:ElementRef;
  constructor(private route:ActivatedRoute,private router:Router, private sharedService : SharedServiceService, private authService: SocialAuthService) { }
  airport : String[] = []
  station : String[] = []
  user: any = []
  city:String[]=[]
  stations : String[]=[]
  flag1:Boolean = false
  plannerFlag:Boolean = false
  timeout = null;
  ngOnInit(): void {
    var that = this
    Object.keys(station_list).forEach(function(key) {
       that.stations.push(station_list[key])
    })
    that.user = JSON.parse(localStorage.getItem('token'))
    if(that.user == null){
      that.flag1=false
      that.user = []
    }
    else{
      that.flag1 = true
    }
  }

  flightChange(data){
    var that =this
    that.airport=[]
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      var airports = airport_list.filter(e=>{
        return e.name.toLowerCase().includes(data.toLowerCase())
      })
  
      airports.forEach(e=>{
        that.airport.push(e.name)
      })
  }, 2000);
    
  }
  cityChange(data){
    var that =this
    that.city=[]
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      var cities = city_list.filter(e=>{
        return e.name.toLowerCase().includes(data.toLowerCase())
      })
  
      cities.forEach(e=>{
        that.city.push(e.name)
      })
  }, 2000);
  }

  trainChange(data){
    var that =this
    that.station=[]
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      that.station = that.stations.filter(e=>{
        return e.toLowerCase().includes(data.toLowerCase())
      })
  }, 2000);
  }


  actionFlight(flightObj: Object){
    this.sharedService.setflightData(flightObj);
    this.router.navigate(['flights']);
  }

  actionTrain(trainObj: Object){
    this.sharedService.settrainData(trainObj);
    this.router.navigate(['trains']);
  }
  actionHotel(hotelObj: Object){
    this.sharedService.sethotelData(hotelObj);
    this.router.navigate(['hotels']);
  }
  actionRestaurant(resObj: Object){
    this.sharedService.setresData((resObj))
    this.router.navigate(['restaurants']);
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.user.push(
          {
            name: response.name,
            url : response.photoUrl
          }
          
        )
        this.flag1 = true
        localStorage.setItem("token" , JSON.stringify(this.user));
        this.closeModal.nativeElement.click();
        if(this.plannerFlag == true){
          this.router.navigate(['planner']);
        }
      }
    )
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (response) => {
        this.user.push(
          {
            name: response.name,
            url : response.photoUrl
          } 
        )
        this.flag1 = true
        localStorage.setItem("token" , JSON.stringify(this.user));
        this.closeModal.nativeElement.click();
        if(this.plannerFlag == true){
          this.router.navigate(['planner']);
        }
      }
    )
  }
  signout(){
    this.flag1=false
    this.user=[]
    localStorage.removeItem('token')
  }

  planner(){
    if(this.flag1 ==true){
      this.router.navigate(['planner']);
    }
    else{
      this.plannerFlag = true
      this.signInModal.nativeElement.click();
    }
  }

}

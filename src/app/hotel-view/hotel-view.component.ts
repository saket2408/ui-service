import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import city_list from '../../assets/countries.json';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-hotel-view',
  templateUrl: './hotel-view.component.html',
  styleUrls: ['./hotel-view.component.css']
})
export class HotelViewComponent implements OnInit {
  @ViewChild('closeModal') closeModal:ElementRef;
  @ViewChild('signInModal') signInModal:ElementRef;
  user: any = []
  flag1:Boolean = false
  plannerFlag:Boolean = false
  flag: boolean;
  @ViewChild('openModal') openModal: ElementRef;
  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService,private authService: SocialAuthService) { }

  timeout = null;
  hotelObj: any
  weatherData: any
  covidData: any
  hotelData: any
  city:String[]=[]
  url: any
  mapUrl: String
  ngOnInit(): void {
    var that = this
    that.user = JSON.parse(localStorage.getItem('token'))
    if(that.user == null){
      that.flag1=false
      that.user = []
    }
    else{
      that.flag1 = true
    }
    this.flag = false
    this.hotelObj = this.sharedService.gethotelData();
    //console.log(this.hotelObj)
    var countries = this.hotelObj.city.split(", ");
    this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCWZ7t-HZp75WsyttAOTcZEYXZ5ZB9oJ_M&q=" + countries[0] +", "+ countries[1];
    this.url = 'https://weather-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/weather'
    fetch(this.url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        city: countries[0] + ", " + countries[1]
      })
    })
      .then(res => res.json())
      .then(data => {
        this.weatherData = data
        //console.log(this.weatherData)
        this.url = 'https://covid-cases-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/covidCases'
        fetch(this.url, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            state: countries[1],
            country: countries[2]
          })
        })
          .then(res => res.json())
          .then(data => {
            this.covidData = data
            //console.log(this.covidData)
            this.url = 'https://hotel-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/getHotels'
            fetch(this.url, {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                city: this.hotelObj.city
              })
            })
              .then(res => res.json())
              .then(data => {
                this.hotelData = data
                //console.log(this.hotelData)
                this.flag = true
                this.openModal1();
              })
          })

      })

  }

  openModal1() {
    var that = this
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      that.openModal.nativeElement.click();
    }, 1000);

  }

  cityChange(data) {
    var that = this
    that.city = []
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      var cities = city_list.filter(e => {
        return e.name.toLowerCase().includes(data.toLowerCase())
      })

      cities.forEach(e => {
        that.city.push(e.name)
      })
    }, 2000);
  }


  actionHotel(hotelObj: Object) {
    this.sharedService.sethotelData(hotelObj);
    this.ngOnInit();
  }

  myfunc() {
    this.openModal.nativeElement.click();
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

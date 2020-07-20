import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import city_list from '../../assets/countries.json';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";


@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.css']
})
export class RestaurantViewComponent implements OnInit {
  flag: boolean;
  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('signInModal') signInModal: ElementRef;
  @ViewChild('closeModal') closeModal:ElementRef;
  user: any = []
  flag1:Boolean = false
  plannerFlag:Boolean = false
  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService,private authService: SocialAuthService) { }

  timeout = null;
  resObj: any
  weatherData: any
  covidData: any
  resData: any
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
    this.resObj = this.sharedService.getresData();
    //console.log(this.resObj)
    var countries = this.resObj.city.split(", ");
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
           // console.log(this.covidData)
            this.url = 'https://restaurant-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/searchRestaurants'
            fetch(this.url, {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                city: this.resObj.city,
                category: this.resObj.category
              })
            })
              .then(res => res.json())
              .then(data => {
                this.resData = data
                //console.log(this.resData)
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


  actionRestaurant(resObj: Object) {
    this.sharedService.setresData(resObj);
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

import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import airport_list from '../../assets/airport_list.json';
import country_list from '../../assets/countries.json';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-flight-view',
  templateUrl: './flight-view.component.html',
  styleUrls: ['./flight-view.component.css']
})
export class FlightViewComponent implements OnInit {
  @ViewChild('closeModal') closeModal:ElementRef;
  user: any = []
  flag1:Boolean = false
  plannerFlag:Boolean = false
  flag: boolean;
  @ViewChild('openModal') openModal:ElementRef;
  @ViewChild('signInModal') signInModal:ElementRef;
  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService,private authService: SocialAuthService) { }

  airport: String[] = []
  timeout = null;
  flightObj: any
  weatherData: any
  covidData: any
  flightsData: any
  originCity: String[] = []
  destinationCity: String[] = []
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
    this.flightObj = this.sharedService.getflightData();
    //console.log(this.flightObj)
    this.originCity = this.flightObj.origin.split(',');
    this.destinationCity = this.flightObj.destination.split(',');
    var country = country_list.find(e => {
      return e.name.toLowerCase().startsWith(this.destinationCity[2].toLowerCase().slice(1) + ",")
    })
    //console.log(country)
    var countries = country.name.split(", ");
    this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCWZ7t-HZp75WsyttAOTcZEYXZ5ZB9oJ_M&q=" + this.destinationCity[2].slice(1) +", "+countries[1];
    this.url = 'https://weather-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/weather'
    fetch(this.url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        city: this.destinationCity[2] + ", "+ countries[1]
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
            this.url = 'https://flight-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/getFlights'
            fetch(this.url, {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                origin  : this.originCity[0],
                destination : this.destinationCity[0],
                date : this.flightObj.date,
                adults : this.flightObj.adults,
                children : this.flightObj.children,
                infants : this.flightObj.infants,
                class: this.flightObj.travelClass
              })
            })
              .then(res => res.json())
              .then(data => {
                  this.flightsData = data
                  //console.log(this.flightsData)
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

  flightChange(data) {
    var that = this
    that.airport = []
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      var airports = airport_list.filter(e => {
        return e.name.toLowerCase().includes(data.toLowerCase())
      })

      airports.forEach(e => {
        that.airport.push(e.name)
      })
    }, 2000);

  }
  actionFlight(flightObj: Object) {
    this.sharedService.setflightData(flightObj);
    this.ngOnInit();
  }

  myfunc(){
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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import station_list from '../../assets/stations.json';
import country_list from '../../assets/countries.json';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-train-view',
  templateUrl: './train-view.component.html',
  styleUrls: ['./train-view.component.css']
})
export class TrainViewComponent implements OnInit {
  @ViewChild('closeModal') closeModal:ElementRef;
  @ViewChild('signInModal') signInModal:ElementRef;
  user: any = []
  flag1:Boolean = false
  plannerFlag:Boolean = false
  flag: boolean;
  @ViewChild('openModal') openModal: ElementRef;
  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService,private authService: SocialAuthService) { }

  station: String[] = []
  stations: String[] = []
  timeout = null;
  trainObj: any
  weatherData: any
  covidData: any
  trainData: any
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
    var that = this
    Object.keys(station_list).forEach(function (key) {
      that.stations.push(station_list[key])
    })
    this.trainObj = this.sharedService.gettrainData();
    //console.log(this.trainObj)
    this.originCity = this.trainObj.origin.split(' ');
    this.destinationCity = this.trainObj.destination.split(' ');
    var country = country_list.find(e => {
      return e.name.toLowerCase().startsWith(this.destinationCity[0].toLowerCase() + ',')
    })
    var countries = country.name.split(", ");
    this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCWZ7t-HZp75WsyttAOTcZEYXZ5ZB9oJ_M&q=" + this.destinationCity[0].toLowerCase() +", "+countries[1];
    this.url = 'https://weather-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/weather'
    fetch(this.url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        city: this.destinationCity[0].toLowerCase() + ", " + countries[1]
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
            var dateData = this.trainObj.date.split('-')
            this.url = 'https://train-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/getTrains'
            fetch(this.url, {
              method: "POST",
              headers: {
                "content-type": "application/json"
              },
              body: JSON.stringify({
                origin: this.originCity[this.originCity.length -1],
                destination: this.destinationCity[this.destinationCity.length -1],
                date: dateData[2] + "/" + dateData[1] + "/" + dateData[0]
              })
            })
              .then(res => res.json())
              .then(data => {
                this.trainData = data
                //console.log(this.trainData)
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

  trainChange(data) {
    var that = this
    that.station = []
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      that.station = that.stations.filter(e => {
        return e.toLowerCase().includes(data.toLowerCase())
      })
    }, 2000);
  }

  actionTrain(trainObj: Object) {
    this.sharedService.settrainData(trainObj);
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

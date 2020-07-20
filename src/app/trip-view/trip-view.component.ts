import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.component.html',
  styleUrls: ['./trip-view.component.css']
})
export class TripViewComponent implements OnInit {
  @ViewChild('submitForm') submitForm: ElementRef;
  @ViewChild('openModal') openModal: ElementRef;
  city: String[] = []
  timeout = null;
  user: any = []
  flag1: Boolean = false
  flag: Boolean = false
  plannerObj: any;
  weatherData: any
  covidData: any
  resData: any
  hotelData: any
  poiData: any
  daywiseData : any
  url: any
  mapUrl: String
  show = false
  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedServiceService) { }

  ngOnInit(): void {
    this.flag = false
    var that = this
    that.user = JSON.parse(localStorage.getItem('token'))
    if (that.user == null) {
      this.router.navigate(['']);
    }
    else {
      //console.log(this.user)
      that.flag1 = true
    }
    this.plannerObj = this.sharedService.getplannerData();
    //console.log(this.plannerObj)
    if (this.plannerObj.city == undefined) {
      this.router.navigate(['planner']);
    }
    var countries = this.plannerObj.city.split(", ");
    this.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyCWZ7t-HZp75WsyttAOTcZEYXZ5ZB9oJ_M&q=" + countries[0] + ", " + countries[1];
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
                city: this.plannerObj.city
              })
            })
              .then(res => res.json())
              .then(data => {
                this.hotelData = data
                //console.log(this.hotelData)
                this.url = 'https://restaurant-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/searchRestaurants'
                fetch(this.url, {
                  method: "POST",
                  headers: {
                    "content-type": "application/json"
                  },
                  body: JSON.stringify({
                    city: this.plannerObj.city
                  })
                })
                  .then(res => res.json())
                  .then(data => {
                    this.resData = data
                    //console.log(this.resData)
                    this.url = 'https://poi-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/poi'
                    fetch(this.url, {
                      method: "POST",
                      headers: {
                        "content-type": "application/json"
                      },
                      body: JSON.stringify({
                        city: countries[0]
                      })
                    })
                      .then(res => res.json())
                      .then(data => {
                        this.poiData = data
                        console.log(this.poiData)
                        if(this.poiData.results.length != 0){
                          this.daywiseData = this.chunkArray(this.poiData.results, this.plannerObj.days)
                          console.log(this.daywiseData)
                        }
                        else{
                          this.daywiseData = []
                          console.log(this.daywiseData)
                        }
                        this.flag = true
                        this.openModal1();
                      })
                  })
              })
          })
      })
  }

  chunkArray(arr, chunkCount) {
    var chunks = [];
    while(arr.length) {
      var chunkSize = Math.ceil(arr.length / chunkCount--);
      var chunk = arr.slice(0, chunkSize);
      chunks.push(chunk);
      arr = arr.slice(chunkSize);
    }
    return chunks;
  }

  openModal1() {
    var that = this
    clearTimeout(that.timeout);
    that.timeout = setTimeout(function () {
      that.openModal.nativeElement.click();
    }, 1000);

  }
  myfunc() {
    this.openModal.nativeElement.click();
  }

  signout() {
    this.user = []
    localStorage.removeItem('token')
    this.router.navigate(['']);
  }

}

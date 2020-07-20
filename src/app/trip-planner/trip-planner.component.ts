import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedServiceService } from '../shared-service.service';
import city_list from '../../assets/countries.json';
import { Iwindow } from '../iwindow';

@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.css']
})
export class TripPlannerComponent implements OnInit {
  @ViewChild('submitForm') submitForm: ElementRef;
  city: String[] = []
  timeout = null;
  user: any = []
  flag1: Boolean = false
  constructor(private route: ActivatedRoute,private ngZone: NgZone, private router: Router, private sharedService: SharedServiceService) { }

  ngOnInit(): void {
    var that = this
    that.user = JSON.parse(localStorage.getItem('token'))
    if (that.user == null) {
      this.router.navigate(['']);
    }
    else {
      that.flag1 = true
    }
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

  actionPlanner(plannerObj: any) {
    var date1 = plannerObj.startDate.split('-');
    var date2 = plannerObj.endDate.split('-');

    date1 = new Date(date1[0], date1[1], date1[2]);
    date2 = new Date(date2[0], date2[1], date2[2]);

    var date1_unixtime:any = date1.getTime() / 1000;
    var date2_unixtime: any = date2.getTime() / 1000;

    var timeDifference = date2_unixtime - date1_unixtime;

    var timeDifferenceInHours = timeDifference / 60 / 60;

    var timeDifferenceInDays = timeDifferenceInHours / 24;
    var planObj = {
      city: plannerObj.city,
      startDate: plannerObj.startDate,
      endDate: plannerObj.endDate,
      days: timeDifferenceInDays + 1
    }
    this.sharedService.setplannerData(planObj);
    this.router.navigate(['planViewer'])
  }

  signout() {
    this.user = []
    localStorage.removeItem('token')
    this.router.navigate(['']);
  }

  actionSearch(searchObj: any) {
    var url = 'https://nlp-service-cc-uc-1-hertzchampions.container-crush-01-4044f3a4e314f4bcb433696c70d13be9-0000.che01.containers.appdomain.cloud/nlp'
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        text: searchObj.search
      })
    })
      .then(res => res.json())
      .then(data => {
        //console.log(data)
        if (data != undefined && data.length == 2 &&((data[0].type == "Location" && data[1].type =="Quantity") || (data[1].type == "Location" && data[0].type =="Quantity"))) {
          var cities;
          var days;
          data.forEach(element => {
            if(element.type =="Location"){
              cities = city_list.find(e => {
                return e.name.toLowerCase().startsWith(element.text.toLowerCase() + ",")
              })        
            }
            if(element.type == "Quantity"){
              var day = element.text.split(' ')
              days = day[0]
            }
          });
          var planObj = {
            city: cities.name,
            startDate: '',
            endDate: '',
            days: days
          }
          //console.log(planObj)
          this.sharedService.setplannerData(planObj);
          this.ngZone.run(() => this.router.navigate(['planViewer'])).then();
          //this.router.navigate(['planViewer'])
        }
        else {
          alert('Unable to process. Kindly provide more specific information \n Eg.\n 1. plan 2 days trip to pune \n 2. pune trip for 2 days \n 3. want to travel to Pune for 3 days. etc')
        }
      })
  }

  dictate() {
    var that = this
    const { webkitSpeechRecognition }: Iwindow = <Iwindow><unknown>window;
    var recognition = new webkitSpeechRecognition();
    recognition.onresult = function (event) {
      (<HTMLInputElement>document.getElementById('search')).value = "";
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          (<HTMLInputElement>document.getElementById('search')).value += event.results[i][0].transcript;
        }
      }
      var obj = {
        search: (<HTMLInputElement>document.getElementById('search')).value
      }
      //console.log(obj)
      that.actionSearch(obj)
    };
    recognition.start();
  }
}
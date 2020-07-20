import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  flightData;
  trainData;
  hotelData;
  restaurantData;
  plannerData;
  constructor(){
    this.plannerData={};
    this.flightData= {};
    this.trainData= {};
    this.hotelData= {};
    this.restaurantData= {};
  }
  setflightData(val: Object){
    this.flightData= val;
  }
  getflightData(){
    return this.flightData;
  }

  settrainData(val: Object){
    this.trainData= val;
  }
  gettrainData(){
    return this.trainData;
  }
  sethotelData(val: Object){
    this.hotelData= val;
  }
  gethotelData(){
    return this.hotelData;
  }
  setresData(val: Object){
    this.restaurantData= val;
  }
  getresData(){
    return this.restaurantData;
  }
  setplannerData(val: Object){
    this.plannerData= val;
  }
  getplannerData(){
    return this.plannerData;
  }
}

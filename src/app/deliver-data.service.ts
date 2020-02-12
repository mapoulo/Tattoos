import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DeliverDataService {


  notifications : number = 0;

  logout :boolean =false;

  checkValue = 0
  wantToBook = false;

  name  = "";

  get isLoggedIn() {
    
    return true;
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  dataSaved = {
    category : "",
    description : "",
    image : "",
    endPrice : "",
    startPrice : "",
    name : ""
  }

  AcceptedData =  [];

  constructor() {
    this.notifications = this.AcceptedData.length;
   }
}

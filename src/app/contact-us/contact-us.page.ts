import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {


  
  tattooForm : FormGroup;
  name = ""
  email = ""
  message = ""
  showProfile1
  db = firebase.firestore();
  MyNotifications = 0

  constructor(private rout : Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

 
  ionViewWillEnter(){
    this.showProfile();
  }

    
  showProfile(){


    firebase.auth().onAuthStateChanged((user) => {
      if(user) {


        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).onSnapshot(item => {
          console.log("User Logged in ", item.data());
         
          
        })

       
        
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
          data.forEach(a => {

            if(a.data().bookingState === "Accepted"){ 

              this.db.collection("Bookings").doc(firebase.auth().currentUser.uid)
              .collection("Response")
              
              .get().then(myItem => {
                this. MyNotifications = 0;     
                myItem.forEach(doc => {
                  if(doc.data().bookingState === "Pending"){
                  
                   this. MyNotifications += 1;
                   console.log("@@@@@@@@@@@@@",  doc.data() );
                    // this.array.push(doc.data())
                    // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
                  }   
                })
            
          })
          // return true; 
             }
          })
        })
        
    

        this.showProfile1 = true;

        
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
          data.forEach(a => {

            if(a.data().bookingState === "Accepted"){ 

              this.db.collection("Bookings").doc(firebase.auth().currentUser.uid)
              .collection("Response")
              
              .onSnapshot(myItem => {
                  
                myItem.forEach(doc => {
                  if(doc.data().bookingState === "Pending"){
                  
                   
                  }   
                })
            
          })
          // return true; 
             }
          })
        })
        
        
        // .get().then(i => {
        //   i.forEach(a => {
  
        //    if(a.data().bookingState === "Accepted"){ 

        //     this.db.collection("Bookings").doc(firebase.auth().currentUser.uid)
        //     .collection("Response").get().then(myItem => {
        //       this. MyNotifications = 0;     
        //       myItem.forEach(doc => {
        //         if(doc.data().bookingState === "Pending"){
                
        //          this. MyNotifications += 1;
        //          console.log("@@@@@@@@@@@@@",  this. MyNotifications );
        //           // this.array.push(doc.data())
        //           // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
        //         }   
        //       })
          
        // })
        // // return true; 
        //    }
          
        //   })
        // })

      }else {
        this.showProfile1 = false;
      }
    })
   }


   async sendMessage(){

     firebase.firestore().collection("Messages").doc().set({
       name : this.name,
       email : this.email,
       message : this.message,
       satatus : "NotRead",
       time : moment().format('MMMM Do YYYY, h:mm:ss a'),
       

     })

     this.name = "";
     this.email = "";
     this.message = "";

     const alert = await this.alertCtrl.create({
      header: "",
      subHeader:"",
      message: "Message sent",
      buttons: ['OK']
    });
    alert.present();

     
   }


   goToExplore(){
     this.rout.navigateByUrl('');
   }

}

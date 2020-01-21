import { ModalController, AlertController } from '@ionic/angular';
import { DeliverDataService } from './../deliver-data.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';



@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  db = firebase.firestore();
  array = [];
  showMessage : boolean;
  message = "";
  article: boolean = false;
  articleDiv: any = document.getElementsByClassName('article');
  days = "";
  icon = 'ios-arrow-down';
  Username = "";

  constructor(public DeliverDataService : DeliverDataService,public AlertController : AlertController, private modalController: ModalController, private render: Renderer2 ) {
    // this.array = [];
    // this.array = this.DeliverDataService.AcceptedData;
    console.log("Data in the Notifications ", this.array);
    
   }

   ionViewWillEnter(){

    if(firebase.auth().currentUser){

      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(i => {

        i.forEach(a => {

          if(a.data().bookingState === "Accepted"){   
           this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response")
           .onSnapshot(data => {
             this.array = []; 
             data.forEach(item => {
               if(item.data().bookingState === "Pending"){
                
                 this.array.push(item.data())
                 // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
               } 
             })
           })
           
           
     
       // return true; 
          }
         
         })
      })
    }

   }

  ngOnInit() {


 

  }

  animate(i) {
    this.article = !this.article;
    let card = document.getElementsByClassName('card');
    if(this.article) {
      this.icon = 'ios-arrow-up';
      this.render.setStyle(this.articleDiv[i], 'display', 'block');
      this.render.setStyle(card[i], 'height', '25%');
      this.render.setStyle(card[i], 'transition', '500ms');
    }else {
      setTimeout(() => {
        this.icon = 'ios-arrow-down';
        this.render.setStyle(this.articleDiv[i], 'display', 'none');
        this.render.setStyle(card[i], 'height', '20%');
        this.render.setStyle(card[i], 'transition', '500ms');
      }, 500);
    }
  }

  async Decline(data, i){

    
    this.array.splice(i, 1);

  let obj = {
    startingDate : "",
    endingDate : "",
    price : "",
    uid : "",
    bookingState : "",
    auId : "",
    image : ""
  }
      
      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {       
        myItem.forEach(doc => {
          if(doc.data().auId === data.auId){
            
          console.log("Declined obj", doc.data());
          
          obj.startingDate =  doc.data().startingDate,
          obj.endingDate =  doc.data().endingDate,
          obj.price =  doc.data().price,
          obj.price  =  doc.data().uid,
          obj.bookingState =  "Pending",
          obj.auId = doc.data().auId,
          obj.image =  doc.data().image,doc.data()

          this.updateDecline(doc.data().auId, doc.data(), data.customerName);

          }   
        })
    
  })

  const alert = await this.AlertController.create({
    header: "",
    subHeader: "",
    message: "Successfully Declined",
    buttons: ['OK']
  });
  alert.present();

  }

  updateDecline(auId, obj, name){

    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").doc(auId).update({
      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Decline",
      auId : obj.auId,
      image : obj.image
    })

    console.log("updateDecline successfully");

    this.db.collection("Users").doc().set({

      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Decline",
      auId : obj.auId,
      image : obj.image,
      name : name

    })
    
  }


  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async Accept(data, i){


   
    

    const alert = await this.AlertController.create({
      header: "",
      subHeader: "",
      message: "Booking Finalised. Download the contract in your profile.",
      buttons: ['OK']
    });
    alert.present();

    console.log("a", data.uid);
    this.showMessage = true;
    this.message = "Accept";
   

    setTimeout(() => {
      console.log("ACCEPTED DATA");
      this.array.splice(i, 1);

      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(i => {

        i.forEach(a => {

          if(a.data().bookingState === "Accepted"){   
           this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response")
           .onSnapshot(data => {
             this.array = []; 
             data.forEach(item => {
               if(item.data().bookingState === "Pending"){
                
                 this.array.push(item.data())
                 // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
               } 
             })
           })
           
           
     
       // return true; 
          }
         
         })
      })
     
    },1000);
    
   

    let obj = {
      startingDate : "",
      endingDate : "",
      price : "",
      uid : "",
      bookingState : "",
      auId : "",
      image : ""
    }
        
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(myItem => {       
          myItem.forEach(doc => {
            if(doc.data().auId === data.auId){
              
            console.log("Declined obj", doc.data());
            
            obj.startingDate =  doc.data().startingDate,
            obj.endingDate =  doc.data().endingDate,
            obj.price =  doc.data().price,
            obj.price  =  doc.data().uid,
            obj.bookingState =  "Pending",
            obj.auId = doc.data().auId,
            obj.image =  doc.data().image,doc.data()
  
            this.updateAccept(doc.data().auId, doc.data(), data.customerName);
  
            }   
          })
      
    })

   
  
  }

 


  



  updateAccept(auId, obj, name){

    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").doc(auId).update({
      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Accepted",
      auId : obj.auId,
      image : obj.image
    })

    console.log("updateAccept successfully");
    
    
    this.db.collection("Users").doc().set({

      startingDate : obj.startingDate,
      endingDate : obj.endingDate,
      price : obj.price ,
      uid : obj.price ,
      bookingState : "Accepted",
      auId : obj.auId,
      image : obj.image,
      name : name

    })

  }

}

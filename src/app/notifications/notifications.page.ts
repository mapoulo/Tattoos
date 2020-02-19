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
  icon = 'ios-arrow-down'
  days = "";
  article: boolean = false;
  articleDiv: any = document.querySelectorAll('.article');
  cardDiv: any = document.getElementsByClassName('card');
  constructor(public DeliverDataService : DeliverDataService,public AlertController : AlertController, private modalController: ModalController, private render: Renderer2 ) {
    // this.array = [];
    // this.array = this.DeliverDataService.AcceptedData;
    console.log("Data in the Notifications ", this.array);
    
   }

  ngOnInit() {


    if(firebase.auth().currentUser){

      this.db.collection("Response").onSnapshot(data => {
        this.array = []
        data.forEach(item => {
          let obj = {obj:{}, id : ""}
          if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "Pending" ){
              obj.id = item.id
              obj.obj = item.data()
              this.array.push(obj)
              obj = {obj:{}, id : ""}
          }
        })
      })
    }

  }


 

  async Decline(data, i, key){

   
    // setTimeout(() => {
      this.array.splice(i, 1);
    // },2000);

  this.db.collection("Response").doc(key).set({
  
    bookingState : "Declined"
    
  }, {merge : true})
      


 

  const alert = await this.AlertController.create({
    header: "",
    subHeader: "",
    message: "Successfully Declined",
    buttons: ['OK']
  });
  alert.present();

  }

 

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  animate(i) {
    this.article = !this.article;

    if(this.article) {
      this.render.setStyle(this.articleDiv[i], 'display', 'block');
      this.render.setStyle(this.cardDiv[i], 'height', '25%');
    }else {
      this.render.setStyle(this.articleDiv[i], 'display', 'none');
      this.render.setStyle(this.cardDiv[i], 'height', '20%');
    }
  }

  async Accept(data, i, key){

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
   

    // setTimeout(() => {
    //   console.log("ACCEPTED DATA");
      this.array.splice(i, 1);
     
    // },2000);
    
   

    let obj = {
      startingDate : "",
      endingDate : "",
      price : "",
      number: "",
      customerName:"",
      uid : "",
      bookingState : "",
      auId : "",
      image : ""
    }

    this.db.collection("Response").doc(key).set({
      bookingState : "Accepted"
    }, {merge : true})
        
  }



}

import { ModalController } from '@ionic/angular';

import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { SuccessPagePage } from '../success-page/success-page.page';


@Component({
  selector: 'app-customize',
  templateUrl: './customize.page.html',
  styleUrls: ['./customize.page.scss'],
})
export class CustomizePage implements OnInit {

db = firebase.firestore();
  storage = firebase.storage().ref();
  tattoo = "";
  Length = "";
  Breadth = "";
  Cname = "";
    number : any = 0;

  constructor(public ModalController : ModalController) { }

  ngOnInit() {

    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).get().then(data => {
      this.Cname = data.data().name;  
      this.number = data.data().number;
    })
  }


  changeListener(event): void {
    console.log("My Method is Called");
    
    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress , '% done.');
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(dwnURL => {
        console.log('File avail at: ', dwnURL);
        this.tattoo = dwnURL;
      });
    });
  }

  async Booking(tattoo){


    if (firebase.auth().currentUser) {


    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").doc().set({

            
      category : "Customized",
      description : "Customized Tattoo",
      image : this.tattoo,
      priceRange :  null,
      tattoName: null,
      breadth : this.Breadth,
      length : this.Length,
      email : firebase.auth().currentUser.email,
      uid : firebase.auth().currentUser.uid,
      customerName : this.Cname,
      number : this.number,
      bookingState : 'waiting',
      field : "Customized"
    


    }).then( async() => {

      console.log("Sorry no user here");
      const modal = await this.ModalController.create({
        component: SuccessPagePage
      });
      return await  modal.present();

    })

    // this.modalController.dismiss({
    //   'dismissed': true
    // });
  }
    
  }

  dismiss() {
    this.ModalController.dismiss({
      'dismissed': true
    });
  }

}

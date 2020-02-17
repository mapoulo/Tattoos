import { ModalController, AlertController, Platform } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
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
  SelectedSize: string='';
  color: any=[
    'yes',
    'no',
  ];
  sizes:""
  Cname = "";
    number : any = 0;

    tattooForm : FormGroup;
    validation_messages = {
      'sizes': [
        { type: 'required', message: 'sizes  is required.' },
  
      ],
     
    }
  loader: boolean = false;
  progress: number = 0;
  constructor(public ModalController : ModalController, public AlertController:AlertController, private fb: FormBuilder) { 
    this.tattooForm = this.fb.group({
      sizes: new FormControl('', Validators.compose([Validators.required])),
      // Breadth: new FormControl('', Validators.compose([Validators.required])),
    })
  
  }
  radioChangeHandler(event: any){
    this.SelectedSize=event.target.value;
 }
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
      this.loader=true;
     
    setTimeout(() => {
      this.loader = false;
   }, 1000);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      this.progress += progress;
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


    // if (firebase.auth().currentUser  && this.Length != 0 && this.Breadth != 0) {



    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").doc().set({

            
      category : "Customized",
      description : "Customized Tattoo",
      image : this.tattoo,
      endPrice : null,
      startPrice : null,
      tattoName: null,
      // breadth : this.Breadth,
      // length : this.Length,
      sizes:this.sizes,
      color:this.SelectedSize,
      email : firebase.auth().currentUser.email,
      uid : firebase.auth().currentUser.uid,
      customerName : this.Cname,
      number : this.number,
      bookingState : 'waiting',
      field : "Customized"
    


    }).then( async() => {


      this.dismiss()
      console.log("Sorry no user here");
      const modal = await this.ModalController.create({
        component: SuccessPagePage
      });
      return await  modal.present();

    })

    // this.modalController.dismiss({
    //   'dismissed': true
    // });
  // }else{
  //   const alert = await this.AlertController.create({
  //     header: "",
  //     subHeader: "",
  //     message: "The length and breadth cannot be zero",
  //     buttons: ['OK']
  //   });
  //   alert.present();

  // }
    
  }

  dismiss() {
    this.ModalController.dismiss({
      'dismissed': true
    });
  }

}

import { ModalController, AlertController, Platform } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup, MaxLengthValidator } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { SuccessPagePage } from '../success-page/success-page.page';
import * as moment from 'moment';

@Component({
  selector: 'app-customize',
  templateUrl: './customize.page.html',
  styleUrls: ['./customize.page.scss'],
})
export class CustomizePage implements OnInit {
  
db = firebase.firestore();

userImage = '';
  storage = firebase.storage().ref();
  tattoo = '';
  SelectedSize: string = '';
  color: any = [
    'Yes',
    'No'
  ];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  date:""
  desc:""
  sizes:""
  Cname = "";
  minDate = new Date().toISOString();
    number : any = 0;

    tattooForm : FormGroup;
    validation_messages = {
      'sizes': [
        { type: 'required', message: 'Sizes  is required.' },
  
      ],
      'desc': [
        { type: 'required', message: 'Description  is required.' },
  
      ],
      // 'date': [
      //   { type: 'required', message: 'date  is required.' },
  
      // ],
    }
  loader: boolean = false;
  progress: number = 0;
  constructor(public ModalController : ModalController, public AlertController:AlertController, private fb: FormBuilder) { 
    this.tattooForm = this.fb.group({
      sizes: new FormControl('', Validators.compose([Validators.required])),
      desc: new FormControl('', Validators.compose([Validators.required])),
      color: new FormControl('', Validators.compose([Validators.required])),
    })
  
  }
  radioChangeHandler(event: any){
    this.SelectedSize = event.target.value;
    console.log(this.SelectedSize);
    
 }
  ngOnInit() {

    this.db.collection("Users").doc(firebase.auth().currentUser.uid).get().then(data => {
      this.Cname = data.data().name;  
      this.number = data.data().number;
      this.userImage = data.data().image;
    })
  }

  

 nProgress: number = 0;
  changeListener(event): void {
    console.log("My Method is Called");
    
    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    this.loader=true;
     
    setTimeout(() => {
      this.loader = false;
   }, 1000);
    upload.on('state_changed', snapshot => {
     
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
      this.nProgress = Math.round(progress);
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




      this.db.collection("Bookings").doc().set({

    time : moment().format('MMMM Do YYYY, h:mm:ss a'),     
      category : "Customized",
      description : "Customized Tattoo",
      image : this.tattoo,
      endPrice : null,
      startPrice : null,
      tattoName: null,
      userImage:  this.userImage,
      // date:this.date,
      desc:this.desc,
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

   
    
  }

  dismiss() {
    this.ModalController.dismiss({
      'dismissed': true
    });
  }

}

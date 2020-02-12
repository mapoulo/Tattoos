import { RegisterPage } from './../register/register.page';
// import { XplorePage } from './../pages/xplore/xplore.page';


import { ModalController, AlertController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase";
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DeliverDataService } from '../deliver-data.service';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { BookingModalPage } from '../booking-modal/booking-modal.page';







@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  db = firebase.firestore();
  counter : number = 0;
  email = "";
  password = "";
  AcceptedData = [];
  loader:boolean  = false;
  showProfileState: boolean
  tattooForm : FormGroup;
  validation_messages = {
  
    'email': [
      {type: 'required', message: 'Email address is required.'},
      {type: 'pattern', message: 'Email address is not Valid.'},
      {type: 'validEmail', message: 'Email address already exists in the system.'},
    ],
    'password': [
      {type: 'required', message: 'Password is required.'},
      {type: 'maxlength', message: 'password must be less than 16 characters'},
    ]

  }
  color: string = 'secondary';
  constructor(public AlertController:AlertController,public modalController : ModalController, private fb: FormBuilder,public Router : Router,  public DeliverDataService : DeliverDataService, private plt: Platform) { }

  ngOnInit() {
    if(this.plt.width() < 600) {
        this.color="light";
    }else {
      this.color="dark";

      
    }
    this.showProfile();
    this.tattooForm = this.fb.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
     password: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(15)]))
    })
  }
  
  


  login(){

    this.loader = true;

     setTimeout(() => {

      if (this.tattooForm.valid ) {

        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
     
        
     setTimeout(() => {


      this.db.collection("Users").doc(firebase.auth().currentUser.uid).get().then(async (data) => {
          
        this.DeliverDataService.name = data.data().name;

        if(this.DeliverDataService.wantToBook){
          
           const modal = await this.modalController.create({
         component: BookingModalPage
       });
       return await  modal.present();
        

        }

        this.Router.navigateByUrl('/')
      })
      

     }, 1000)
       


        }).catch(error => {

          this.log2();
     
         this.modalController.dismiss({
           'dismissed': true
         });
     
        })
     
        this.modalController.dismiss({
         'dismissed': true
       });
     
         }
        //  this.log2()
         this.loader = false;
     }, 1000);

     

  }

  
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  showProfile(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.showProfileState = true;
      }else {
        this.showProfileState = false;
      }
    })
   }
 
   async resetPassword(){
    let modal = await this.modalController.create({
      component : ResetPasswordPage,
      cssClass: 'resetModal'
    })
    
    return await modal.present();

   }

  async CreateAccount(){

    let modal = await this.modalController.create({
      component : RegisterPage
    })
    
    return await modal.present();
  }

  async log2(){
    const alert = await this.AlertController.create({
      header: "Login Failed",
      subHeader: "",
      message: "Please Check your Password and Email",
      buttons: ['OK']
    });
    alert.present();
    
    }
  async log(){
    const alert = await this.AlertController.create({
      header: "",
      subHeader: "",
      message: "Successfully logged in",
      buttons: ['OK']
    });
    alert.present();
    
    }
}

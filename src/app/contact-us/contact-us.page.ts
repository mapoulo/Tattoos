import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { SignInPage } from '../sign-in/sign-in.page';
import { RegisterPage } from '../register/register.page';
import { DeliverDataService } from '../deliver-data.service';
import { NotificationsPage } from '../notifications/notifications.page';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  
  
  tattooForm : FormGroup;
  UserIn : boolean
  name = ""
  email = ""
  message = ""
   showProfile1
  db = firebase.firestore();
  MyNotifications = 0
  split: boolean = false;
  image = '';
  respnses=[];
  Contact: any = [];
  loader: boolean = false;
  splitDiv: any = document.getElementsByClassName('split-pane');
  ShowName: any[];
  inputDisabled: boolean = false;
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],
    'email': [
      {type: 'required', message: 'Email address is required.'},
      {type: 'pattern', message: 'Email address is not Valid.'},
      {type: 'validEmail', message: 'Email address already exists in the system.'},
    ],
    'message': [
      { type: 'required', message: 'Message  is required.' },
    ],
  }
  constructor(private fb:FormBuilder,private rout : Router, private alertCtrl: AlertController, public modalController: ModalController, public deliverDataService : DeliverDataService, private render: Renderer2) 
  {
    //his.ionViewWillEnter();
   // this.name;
    this.respnses = this.deliverDataService.AcceptedData; 
  
    this.tattooForm = this.fb.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      message: new FormControl('', Validators.compose([Validators.required])),
    })
  
  
  }
  ngOnInit() {

    if(firebase.auth().currentUser){
      this.UserIn = false
    }else{
      this.UserIn = true
    }

  }
 
  ionViewDidEnter(){
    this.showProfile();
  

    let firetattoo = {
      docid: '',
      doc: {}
    }
   
  
   
   
    this.db.collection('Admin').get().then(data => {
      
      //console.log('tt',this.Tattoos);
      data.forEach(item => {
        firetattoo.doc = item.data();
        firetattoo.docid = item.id;
        
        
        this.Contact.push(firetattoo)
        //console.log('all',this.Tattoos);
         firetattoo = {
          docid: '',
      
          doc: {}
        }
      })
      
      console.log("Contact US ",  this.Contact );
      
      
    })
   
    this.inputDisabled = false;
    setTimeout(() => {
      this.loader = false;
   }, 1000);
    // this.name = this.DeliverDataService.name;
           //User's details
           if(firebase.auth().currentUser) {
            this.email=firebase.auth().currentUser.email;
           }
           
           this.db.collection("Bookings").onSnapshot(data => {         
             data.forEach(item => {
               if(item.exists){
  
                this.ShowName = [];
                 if(item.data().email === this.email){
                   this.deliverDataService.name = item.data().name;
                   this.name = item.data().name;
                   this.image = item.data().image;
                   console.log("Your name is here ", item.data().name);
                   
                   this.ShowName.push(item.data());
                   console.log("ShowName",item.data().name);
                 }
               }
             })
           })
         
 
  
  
  }

  
  addClasseAnimates() {
    this.split = !this.split
    if (this.split) {
     
       this.render.setStyle(this.splitDiv[0],'display','block'); 
     
    } else {
      setTimeout(() => {
       this.render.setStyle(this.splitDiv[0],'display','none');
       
       
      }, 500);
    }
  }

    
  showProfile(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.showProfile1 = true;
        this.inputDisabled = true;
        this.UserIn = false
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).onSnapshot(item => {
          this.name = item.data().name;
          this.image = item.data().image;
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
        
    
        // this.showProfile = true;
        
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
         this.UserIn = true
      }
    })
   }
   async Notifications(){
    console.log("ttttttttt", this.respnses);
   let modal = await this.modalController.create({
      component : NotificationsPage,
      cssClass: 'modalNotification'
    })
    return await modal.present();
  }
   
async CreateAccount(){
  this.loader = true;
  this.split = false;
  setTimeout(() => {
    this.loader = false;
  }, 1000);
  let modal = await this.modalController.create({
    component : RegisterPage
  })
  this.showProfile();
  return await modal.present();
}
async Login(){
  this.loader = true;
  this.split = false;
  setTimeout(() => {
    this.loader = false;
  }, 1000);
 
    let modal = await this.modalController.create({
      component : SignInPage,
    })
    
    this.showProfile();
    return await modal.present();
  
}
  logOut(){
    this.loader = true
    this.split = false;
    this.ShowName=[];
  
    setTimeout(() => {
      firebase.auth().signOut().then(user => {
  
        this.loader = false;
  
      // this.presentToast('You are now logged out');
  
       
    
      }).catch(error => {
        console.log("Something went wrong");
        
      })
    }, 1000);
   
  
   
  }
  
   async sendMessage(){
  
    var user = firebase.auth().currentUser;
    if (user) {
      this.db.collection("Messages").doc(firebase.auth().currentUser.uid).collection("Message").doc().set({
        //firebase.firestore().collection("Messages").doc().set({
         
          name : this.name,
          email : this.email,
          message : this.message,
          satatus : "NotRead",
          time : moment().format('MMMM Do YYYY, h:mm:ss a'),
          
        })
      // User is signed in.
    } else {
      this.db.collection("Messages").doc().set({
        name : this.name,
        email : this.email,
        message : this.message,
        satatus : "NotRead",
        time : moment().format('MMMM Do YYYY, h:mm:ss a'),
        
      })
      // No user is signed in.
    }
 
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

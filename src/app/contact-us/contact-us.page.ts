import { CustomizePage } from './../customize/customize.page';
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
import { MessagesPage } from '../messages/messages.page';

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  
  Myname;
  Mynumber;
  Picture= "";
  tattooForm : FormGroup;
  UserIn : boolean
  name = ""
  email = ""
  messages = 0;
  phoneNumber = ""
  UserImage = ""
  message = ""
   showProfile1
  db = firebase.firestore();
  MyNotifications = 0
  split: boolean = false;
  image = '';
  respnses=[];
  Contact: any = [];
  buttonDisabled: boolean = false;
  loader: boolean = false;
  splitDiv: any = document.getElementsByClassName('split-pane');
  ShowName: any[];
  inputDisabled: boolean = false;
  

  placeid = ""

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
  constructor(private fb:FormBuilder,private rout : Router, private AlertController: AlertController, public modalController: ModalController, public deliverDataService : DeliverDataService, private render: Renderer2) 
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



  async opnModal(){
    let modal = await this.modalController.create({
      component : CustomizePage,
      cssClass: 'modalNotification'
    })
    return await modal.present();
   }


  ngOnInit() {

   this.showProfile();
    this.loader=true;


    this.db.collection("Admin").onSnapshot(data => {
      data.forEach(item => {
        this.placeid = item.data().placeId
        console.log("PlaceId ", item.data().placeId );
        
      })
    })

    if(firebase.auth().currentUser){

      this.UserIn = false


      this.db.collection("Message").onSnapshot(data => {
        this.messages = 0
        data.forEach(item => {

         if(item.exists){

           if( item.data().status == "NotRead" && item.data().uid == firebase.auth().currentUser.uid && item.data().cmsUid == null  ){
             this.messages += 1
             console.log("Called  ssss");                
        }

         }
        
        })

        
      })

      this.db.collection("Response").onSnapshot(data => {
        this.MyNotifications = 0
         data.forEach(item => {
           if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "Pending"){
             this.MyNotifications += 1
           }
         })
       })
        

    }else{
      this.UserIn = true
    }

  }
  
  ionViewWillLeave () {

    this.Contact = []
  }

  // GoTo(){ 

  //   return window.location.href = 'https://www.google.com/maps/place/?q=place_id:'+this.placeid;

  //   // 230 Park Ave, New York, NY 10169, USA
    
  // }


  GoTo(){ 
    const pdfUrl = 'https://www.google.com/maps/place/?q=place_id:'+this.placeid; ;
    const pdfName = 'InkScribeTattoo Contract.pdf';
    FileSaver.saveAs(pdfUrl, pdfName);
    // return window.location.href = 'https://www.google.com/maps/place/?q=place_id:'+this.placeid;
    // 230 Park Ave, New York, NY 10169, USA
    
  }


  async  viewMessages(){

    const modal = await this.modalController.create({
      component: MessagesPage,
      cssClass:'modalMessages'

    });
    return await  modal.present();

  }
 
  ionViewDidEnter(){
        this.showProfile();
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {




        this.showProfile1 = true;
    
        this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(data => {
          this.Myname = data.data().name;
          this.Mynumber = data.data().number;
          this.Picture=data.data().image;
          this.email=data.data().email;
          this.phoneNumber = data.data().number,
          this.UserImage = data.data().image
        })
        

      }

    })


  

    let firetattoo = {
      docid: '',
      doc: {}
    }
   
  
   
   
    this.db.collection('Admin').onSnapshot(data => {
       this.Contact = []
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
         
 
           setTimeout(() => {
            this.loader = false;
         }, 1000);
  
  }


  async sendMessage(){


   setTimeout(() => {

    this.db.collection("Admin").get().then(data => {

      data.forEach(item => {

        console.log("CMS UID ", item.data().uid); 
        this.db.collection("Message").doc().set({

          name : this.Myname,
          image : this.Picture,
          email : firebase.auth().currentUser.email,
          message : this.message,
          status : "NotRead",
          cmsUid : "CMS",
          number : this.phoneNumber,
          time : moment().format('MMMM Do YYYY, h:mm:ss a'),
          uid : firebase.auth().currentUser.uid,
         
        })

  
      })
    

    })
     
   }, 1000);

    const alert = await this.AlertController.create({
      header: '',
      subHeader: '',
      message: 'Message sent',
      buttons: [ 'Ok']
    });

    await alert.present();
     

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



  openGps(){

    
  }
    
  showProfile(){

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        this.showProfile1 = true;
        this.inputDisabled = true;
        this.buttonDisabled = false;
        this.UserIn = false
        this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(item => {
          this.name = item.data().name;
          this.image = item.data().image;
          console.log("User Logged in ", item.data());
         
          
        })
       
        
     
        
   
      }else {
        this.buttonDisabled = true;
         this.showProfile1 = false;
         this.UserIn = true;
         this.buttonDisabled = true;
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
    this.email = ""
    this.name = ""
    this.loader = true
    this.split = false;
    this.ShowName=[];


    this.name = "";

    this.message="";
    this.email="";
  
    setTimeout(() => {
      firebase.auth().signOut().then(user => {
  
        this.loader = false;
  
      // this.presentToast('You are now logged out');
  
       
    
      }).catch(error => {
        console.log("Something went wrong");
        
      })
    }, 1000);
   
  
   
  }
  
 


   goToExplore(){
     this.rout.navigateByUrl('');
   }
}

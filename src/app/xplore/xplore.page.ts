
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CustomizePage } from '../customize/customize.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { SignInPage } from '../sign-in/sign-in.page';
import { BookingModalPage } from '../booking-modal/booking-modal.page';
import { DeliverDataService } from '../deliver-data.service';
import { RegisterPage } from '../register/register.page';
// import { OneSignal } from '@ionic-native/onesignal';


@Component({
  selector: 'app-xplore',
  templateUrl: './xplore.page.html',
  styleUrls: ['./xplore.page.scss'],
})
export class XplorePage implements OnInit {

  split: boolean = false;
  tattooView: any;
  splitDiv: any = document.getElementsByClassName('split-pane');
  loader: boolean = true;

  tattooDisplay: boolean = false;
  tattooDisplaDiv: any = document.getElementsByClassName('tattoo-image');


  /* Animations */
popoverState = false;
popoverDiv = document.getElementsByClassName('popOver');

datesState = false;
dateIcon = 'ios-arrow-down';
dateDiv = document.getElementsByClassName('dates');

tattooInfo = false;
tattooDiv = document.getElementsByClassName('info-tattoo');

menu = false;
menuDiv = document.getElementsByClassName('wraper-list');
  
tattoo = {
    name: '',
    StartingpriceRange: '',
    EndingpriceRange: '',
    description: '',
    image: '',
    categories:''
    
  }
  db = firebase.firestore();
  Tattoos = [];
  MyValue: boolean;
  MyValue1: boolean;
  num: number;
  docId: string;
  query: any[];
  Design = [];
  Sketch = [];
  PreviouseWork = [];
  porpular = []
  respnses = []
  AcceptedData = [];


  MyNotifications = 0;

  ShowName=[];

  name = "";
  image = '';

  email: string;

  tattoos: any = {
    image: '',
    description: '',
    StartingpriceRange: '',
    EndingpriceRange: '',
    nameTattoo: '',
    categories: '',
  }
 
  storage = firebase.storage().ref();
  showProfile1;
  continue: any;

  constructor(public DeliverDataService : DeliverDataService, private toastController: ToastController, private plt: Platform, public modalController: ModalController, public alertCtrl: AlertController, private render: Renderer2, private rout:Router) {

    this.respnses = this.DeliverDataService.AcceptedData;
   
   }



   async Notifications(){
     console.log("ttttttttt", this.respnses);
    let modal = await this.modalController.create({
       component : NotificationsPage,
       cssClass: 'modalNotification'
     })
     return await modal.present();
   }


   async opnModal(){
    let modal = await this.modalController.create({
      component : CustomizePage,
      cssClass: 'modalNotification'
    })
    return await modal.present();
   }

   load(){

    if(firebase.auth().currentUser){

      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(i => {
        i.forEach(a => {
  
         if(a.data().bookingState === "Accepted"){
              
          this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").onSnapshot(myItem => {       
            myItem.forEach(doc => {
              if(doc.data().bookingState === "Pending"){
                this.AcceptedData.push(doc.data())
               
              }   
            })
        
      })
      
         }
        
        })
      })
    }

   }



   viewTattoo(image) {
    this.viewTattoo = image;
   }

 



   ionViewWillEnter(){

   


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
                   this.DeliverDataService.name = item.data().name;
                   this.name = item.data().name;
                   this.image = item.data().image;
                   console.log("Your name is here ", item.data().name);
                   
                   this.ShowName.push(item.data());
                   console.log("ShowName",item.data().name);
                 }
               }
             })
           })
         
 
  
    this.showProfile();



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
        this.tattoo.image = dwnURL;
      });
    });
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

  tattooAnimated(tattoo) {

    this.loader = true;
    this.tattooDisplay = !this.tattooDisplay;
  
    
      
      this.tattoos.image = tattoo.image;
      this.tattoos.nameTattoo = tattoo.name;
      this.tattoos.description = tattoo.description
      this.tattoos.categories = tattoo.categories;
      this.continue = tattoo;
      this.tattoo.StartingpriceRange = tattoo.startPrice;
      this.tattoo.EndingpriceRange = tattoo.endPrice
  

   

    




   
    
    setTimeout(() => {
      
      
      if (this.tattooDisplay) {
       
         this.render.setStyle(this.tattooDisplaDiv[0],'display','block'); 

         
       
      } else {
        setTimeout(() => {
         this.render.setStyle(this.tattooDisplaDiv[0],'display','none');
         
         
        }, 500);
      }
      this.loader = false;
 
    }, 1000);
   
  }


 

  
  showProfile(){


    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        this.presentToast('You have logged in Successfully')

        this.showProfile1 = true;

        this.email=firebase.auth().currentUser.email;
        
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
          data.forEach(a => {

            if(a.data().bookingState === "Accepted"){ 

              this.db.collection("Bookings").doc(firebase.auth().currentUser.uid)
              .collection("Response")
              
              .onSnapshot(myItem => {
                this. MyNotifications = 0;     
                myItem.forEach(doc => {
                  if(doc.data().bookingState === "Pending"){
                  
                   this. MyNotifications += 1;
                   console.log("@@@@@@@@@@@@@",  this. MyNotifications );
                    // this.array.push(doc.data())
                    // console.log("@@@@@@@@@", this.DeliverDataService.AcceptedData);
                  }   
                })
            
          })
          // return true; 
             }
          })
        })
        
        
      

      }else {
        this.showProfile1 = false;
      }
    })
   }
 

    profile(){
      this.rout.navigateByUrl('/profile')

    }

  ngOnInit() {

    this.showProfile();



   

    
    

    
    this.db.collection("Tattoo").onSnapshot(data => {

      this.Sketch = []
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Sketch/design"){
            
           this.Sketch.push(item.data());
          //  console.log("11111111111111111",this.Sketch);
          }
        }
      })
    })
    this.db.collection("Tattoo").onSnapshot(data => {
      this.PreviouseWork = [];
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Previous work"){
            
           this.PreviouseWork.push(item.data());
         
          }
        }
      })
    })
    this.db.collection("Tattoo").onSnapshot(data => {
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Sketch/design"){
            
           this.porpular.push(item.data());
       
          }
        }
      })
    })
            
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
async presentToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 1000,
    position: 'bottom'
  });
  toast.present();
}

logOut(){
  this.loader = true
  this.split = false;
  this.ShowName=[];

  setTimeout(() => {
    firebase.auth().signOut().then(user => {

      this.loader = false;

     this.presentToast('You are now logged out');
      
     
  
    }).catch(error => {
      console.log("Something went wrong");
      
    })
  }, 1000);
 

 
}


 async Booking(tattoo){

  console.log("pppppppp ", tattoo);
  

    if(firebase.auth().currentUser){

      this.showProfile1 = true;
      console.log("Your data ", tattoo);
      console.log("Your uid here is ", firebase.auth().currentUser.uid);
      console.log("Your email here is ", firebase.auth().currentUser.email);
      // this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").doc().set({

        this.ShowName.push(firebase.auth().currentUser.email);
        console.log("display name ", this.ShowName);
      //   name : "Simon",
      //   surname : "Cowel",
      //   legnth : "153",
      //   breadth : "353"
      // })
      this.DeliverDataService.dataSaved.category = tattoo.categories;
      this.DeliverDataService.dataSaved.description = tattoo.description;
      this.DeliverDataService.dataSaved.image = tattoo.image;
      this.DeliverDataService.dataSaved.name = tattoo.name;
      this.DeliverDataService.dataSaved.startPrice = tattoo.startPrice;
      this.DeliverDataService.dataSaved.endPrice = tattoo.endPrice;
     this.tattooDisplay = false;
   

      console.log("Your data in the service",  this.DeliverDataService.dataSaved);
      const modal = await this.modalController.create({
        component: BookingModalPage
      });
      return await  modal.present();


    }else{
      this.tattooDisplay = false;
      console.log("Sorry no user here");
      const modal = await this.modalController.create({
        component: RegisterPage
      });
      return await  modal.present();
      
    }


    
  }

  // viewNotifications() {
    
  //   this.animate(); 
    
  // }

  // animate() {
  //   this.popoverState = !this.popoverState
  //   if (this.popoverState) {
  //     this.render.setStyle(this.popoverDiv[0],'display','block');
  //   } else {
  //     setTimeout(() => {
  //      this.render.setStyle(this.popoverDiv[0],'display','none');
  //     }, 500);
  //   }
    
  // }
  // animateDates() {
  //   this.datesState = !this.datesState
  //   if (this.datesState) {
  //     this.dateIcon = 'ios-arrow-up';
  //     this.render.setStyle(this.dateDiv[0],'display','block');
  //   } else {
  //     setTimeout(() => {
  //       this.dateIcon = 'ios-arrow-down';
  //      this.render.setStyle(this.dateDiv[0],'display','none');
  //     }, 500);
  //   }
    
  // }
  // tattooShowInfoAnimate(){
  //   this.tattooInfo = !this.tattooInfo
  //   if (this.tattooInfo) {
     
  //     this.render.setStyle(this.tattooDiv[0],'display','block');
  //   } else {
  //     setTimeout(() => {
  //      this.render.setStyle(this.tattooDiv[0],'display','none');
  //     }, 500);
  //   }
  // }

  addClasseAnimate() {
    this.menu = !this.menu
    if (this.menu) {
     
       this.render.setStyle(this.menuDiv[0],'display','flex'); 
      this.render.addClass(this.menuDiv[0],'dropped');
    } else {
      setTimeout(() => {
       this.render.setStyle(this.menuDiv[0],'display','none');
       this.render.removeClass(this.menuDiv[0],'dropped');
       
      }, 500);
    }
  }


  pb(){
  }
  obj = {id: null, obj : null}




}






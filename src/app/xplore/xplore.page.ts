import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController, AlertController, Platform, ToastController, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { CustomizePage } from '../customize/customize.page';
import { NotificationsPage } from '../notifications/notifications.page';
import { SignInPage } from '../sign-in/sign-in.page';
import { BookingModalPage } from '../booking-modal/booking-modal.page';
import { DeliverDataService } from '../deliver-data.service';
import { RegisterPage } from '../register/register.page';
import { Storage } from '@ionic/storage';
import { MessagesPage } from '../messages/messages.page';




@Component({
  selector: 'app-xplore',
  templateUrl: './xplore.page.html',
  styleUrls: ['./xplore.page.scss'],
})
export class XplorePage implements OnInit {

 
  Contact=[]
 @ViewChild('slideBanner', {static: false}) slideBanner: IonSlides;

  split: boolean = false;
  tattooView: any;
  splitDiv = document.getElementsByClassName('split-pane');
  loader: boolean = true;
  onboard: boolean = false;
  onbordingDiv = document.getElementsByClassName('onbording');
  tattooDisplay: boolean = false;
  tattooDisplaDiv = document.getElementsByClassName('tattoo-image');


  viewMore: boolean = false;
  viewMoreDiv: any;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    effects: 'cube',
    loop: true,
    autoplay: true
  };

  messages = 0

  category: string  = "art";
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
  Letters = []
  respnses = []
  AcceptedData = [];

  Myname;
  Mynumber;
  Picture= "";
  name_contact = ""
  email_contact = ""
  message = ""


  MyNotifications = 0;

  ShowName=[];

  name = "";
  image = '';

  email: string;
  // Contact=[]
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
  @ViewChild('slides', {static: false}) slides: IonSlides;

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

  tattooForm: FormGroup;
 

  constructor(private fb: FormBuilder, public DeliverDataService : DeliverDataService, public store: Storage, private toastController: ToastController, private plt: Platform, public modalController: ModalController, public alertCtrl: AlertController, private render: Renderer2, private rout:Router) {

    this.respnses = this.DeliverDataService.AcceptedData;

    this.tattooForm = this.fb.group({
      name: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),
      message: new FormControl('', Validators.compose([Validators.required])),
    })

    if(this.plt.width() > 600) {
      this.split = false;
    }
    
   }

   slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
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

   async  viewMessages(){

    const modal = await this.modalController.create({
      component: MessagesPage,
      cssClass:'modalMessages'

    });
    return await  modal.present();

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

 



   ionViewDidEnter(){
    this.viewMoreDiv = document.getElementsByClassName('view-more');



    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        setTimeout(() => {
          

          this.showProfile1 = true;
          this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(item => {
            console.log("User Logged in ", item.data());
            this.Myname = item.data().name;
            this.Mynumber = item.data().number;
            this.Picture=item.data().image;
          })
        
          
        }, 1000);

       

      }

    })
    
    this.showProfile();
    



                // Or to get a key/value pair
        
              this.store.get('onboard').then((val) => {
                if(val == true) {
                  this.onboard = false;
                }else {
                  this.onboard = true;
                }
              });


              setTimeout(() => {
                this.loader = false;


                // this.name = this.DeliverDataService.name;

                    //User's details

                    if(firebase.auth().currentUser) {
                      this.email=firebase.auth().currentUser.email;
                    }
                    
                    this.db.collection("Users").onSnapshot(data => {         
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
                  
              

            }, 1000);

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
  
  }



  nextSlides() {
    this.slideBanner.slideNext();
  }
  prevSlides() {
    this.slideBanner.slidePrev();
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


  viewMoreFunc(cat) {
    this.loader = true;

    setTimeout(() => {
      this.category = cat;
      this.viewMore = !this.viewMore;
      this.loader = false;
    }, 500);
   
   
   
  }

  tattooAnimated(tattoo) {

    this.DeliverDataService.checkValue = 1

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
         
         
        }, 1000);
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
        
         this.db.collection("Response").onSnapshot(data => {
          this.MyNotifications = 0
           data.forEach(item => {
             if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "Pending"){
               this.MyNotifications += 1
             }
           })
         })


         this.db.collection("Message").onSnapshot(data => {
           this.messages = 0
           data.forEach(item => {
             if(item.data().uid == firebase.auth().currentUser.uid && item.data().cmsUid == null  && item.data().status == "NotRead"){
                  this.messages += 1
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


    onboardingFunc() {
      this.onboard = false;
        this.render.setStyle(this.onbordingDiv[0], 'display', 'none');
      this.store.set('onboard', true);
    }
    onNext() {
      this.slides.slideNext(); 
      this.store.set('onboard', true);
    }

  ngOnInit() {

    

   

    this.showProfile();
    

    this.db.collection("Tattoo").onSnapshot(data => {
      this.Sketch = []
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Portraits"){
            
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
          if(item.data().categories === "Art Works"){
            
           this.PreviouseWork.push(item.data());
         
          }
        }
      })
    })
    this.db.collection("Tattoo").onSnapshot(data => {
      this.Letters = []
      data.forEach(item => {
        if(item.exists){
          if(item.data().categories === "Letters"){
            
           this.Letters.push(item.data());
       
          }
        }
      })
    })

            
}



async CreateAccount(){

  this.DeliverDataService.checkValue = 0;

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

  this.name = "";
  this.image = "";
  this.loader = true
  this.split = false;
  this.ShowName=[];

  setTimeout(() => {
    firebase.auth().signOut().then(user => {

      this.loader = false;

     this.presentToast('You are now logged out');
      
     this.DeliverDataService.wantToBook = false
  
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
     

        this.ShowName.push(firebase.auth().currentUser.email);
    
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

      this.DeliverDataService.wantToBook = true
      this.DeliverDataService.dataSaved.category = tattoo.categories;
      this.DeliverDataService.dataSaved.description = tattoo.description;
      this.DeliverDataService.dataSaved.image = tattoo.image;
      this.DeliverDataService.dataSaved.name = tattoo.name;
      this.DeliverDataService.dataSaved.startPrice = tattoo.startPrice;
      this.DeliverDataService.dataSaved.endPrice = tattoo.endPrice;

      this.tattooDisplay = false;
    
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






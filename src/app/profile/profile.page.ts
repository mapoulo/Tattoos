import { SignInPage } from './../sign-in/sign-in.page';
import { RegisterPage } from './../register/register.page';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { DeliverDataService } from 'src/app/deliver-data.service';
import { Router } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController,AlertController, Platform, ToastController } from '@ionic/angular';
import { NotificationsPage } from 'src/app/notifications/notifications.page';
import { DatePipe } from '@angular/common';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [DatePipe]
})
export class ProfilePage implements OnInit {
  respnses=[]
  split: boolean = false;
  splitDiv: any = document.getElementsByClassName('split-pane');


  limitedTattoo = []
  describeDiv: any = document.getElementsByClassName('details');
  decribe: boolean = true;
  arrows: string = 'arrow-back';
  showProfile1;
  category: any = 'accepted';


  UserName =  ""
  UserEmail =  ""
  UserPhoneNumber = ""
  UserImage = ""

  showCustom = {
    name_t: '',
    image_t: '',
    length: '',
    breadth: '',
    desc: '',
    id: ''
  }
  custom: boolean = false;
  customDiv:any = document.getElementsByClassName('customizedTDiv');
  constructor(public alertCtrl: AlertController,private DeliverDataService: DeliverDataService, private toastController: ToastController, public fileOpener : FileOpener, public plt : Platform, private rout: Router, private modalController: ModalController, private rendered: Renderer2, public fileTransfer : FileTransferObject, public file : File ,  private transfer: FileTransfer, private render: Renderer2)  { this.respnses = this.DeliverDataService.AcceptedData; }
  loader = true;
  User=[];
  email: string;
  Requests=[];
  Request=[];
  Bookings=[];
  startingDate;
  endingDate;
  Response=[];
  ViewMore=[];
  userID :string;
  name = "";
  Decline=[];
  DeclineSize=0;
  image = "";
  size=0;
  PendingSize=0;
  pdf;
  edit: boolean = false;
  editDivModal = document.getElementsByClassName('modal');
  Myname = "";
  Mynumber = "";
  link = "";
  MyPdf = "";
  pdfObj = null;
  MyNotifications = 0;
  Customized=[];
  db = firebase.firestore();
  



  ngOnInit() {





    this.showProfile();
    setTimeout(() => {
      this.loader = false;




    }, 1000);


  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
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
   seeDecribe() {
     if(this.decribe) {
      this.arrows = 'arrow-forward';
       this.render.setStyle(this.describeDiv[0], 'right', '0%');
      
       this.decribe = false;
     }else {
      this.arrows = 'arrow-back';
       this.render.setStyle(this.describeDiv[0], 'right', '-30%');
       
       this.decribe = true;
     }
    /*  this.arrows = 'arrow-back'; */
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
  customTattoos() {
    this.custom = !this.custom;
     this.loader = true;
     setTimeout(() => {
        this.loader = false;
     }, 1000);
    if (this.custom) {
     
       this.render.setStyle(this.customDiv[0],'display','flex'); 
     
    } else {
      setTimeout(() => {
       this.render.setStyle(this.customDiv[0],'display','none');
       
       
      }, 500);
    }
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
  
  logout(){
    console.log("Method Called");
    
    this.loader = true;
    this.DeliverDataService.logoutUser().then(()=>{
      this.rout.navigateByUrl('/');
      setTimeout(() => {
        this.loader = false;
      }, 2000);
    })
    }
    Edit(){
      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).update({
        name :this.Myname,
      
        number:this.Mynumber,
      
      });
      this.modalAnimate();
   
    }
  
  
    modalAnimate() {
      this.edit = !this.edit;
      if(this.edit) {
        this.rendered.addClass(this.editDivModal[0], 'modalView');
      }else {
        this.rendered.addClass(this.editDivModal[0], 'modalHide');
      }
    }
  
    async Notifications(){
      console.log("ttttttttt", this.respnses);
     let modal = await this.modalController.create({
        component : NotificationsPage,
        cssClass: 'modalNotification'
      })
      return await modal.present();
    }
    diff;
    diffDays;
 
    downloadPdf() {
      console.log('logg');
      
      this.db.collection("Admin").onSnapshot(data => {
        data.forEach(i => {
          
          this.MyPdf = i.data().pdf;
          this.link = i.data().pdf;
          console.log("weeeeeee ", this.MyPdf);
          
        })
      })
     setTimeout(() => {
      window.location.href = this.link;
     }, 1000);
    
  
    }
    
    
  ionViewWillEnter(){

  
   
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
          data.forEach(item => {
            this.limitedTattoo.push(item.data())
          })
        })

        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).onSnapshot(data => {
          this.UserName = data.data().name;
          this.UserEmail = firebase.auth().currentUser.email;
          this.UserPhoneNumber = data.data().number
          this.UserImage = data.data().image
          console.log("Your data is here ", data.data().name);
          
        })


        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).onSnapshot(item => {
          console.log("User Logged in ", item.data());
          this.Myname = item.data().name;
          this.Mynumber = item.data().number;
          
        })
        this.email=firebase.auth().currentUser.email;
        
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
        
        
    
      }
    })
         //User's details
         this.email=firebase.auth().currentUser.email;
   
         this.db.collection("Bookings").onSnapshot(data => {
        
          
           data.forEach(item => {
             
             if(item.exists){
             
               if(item.data().email === this.email){
                this.DeliverDataService.name = item.data().name;
                this.name = item.data().name;
                this.image = item.data().image;
                 this.User.push(item.data());
              
                 this.User=[];
                 console.log("Testing",item.data().name);
               }
             }
           })
         })
       
      
    if(firebase.auth().currentUser){
    //  console.log("Your  pb data ", Bookings);
      console.log("Your pb here is ", firebase.auth().currentUser.uid);
      console.log("Your email here is ", firebase.auth().currentUser.email);
     // this.User.push(item.data());
        
        
        //User's details
          this.email=firebase.auth().currentUser.email;
          this.db.collection("Bookings").onSnapshot(data => {         
            data.forEach(item => {
              if(item.exists){
                if(item.data().email === this.email){
                  
                  this.User.push(item.data());
                  console.log("Testing",this.User);
                }
              }
            })
          })
        
        
         // this.Date;
        //Response  
      this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(data => {
       
        data.forEach(i => {
          this.Response=[];
          data.forEach(i => {
           
            if(i.exists){
              if(i.data().bookingState === "Accepted"){
                
               
                this.Response.push(i.data());
                this.size=  this.Response.length;
                
                //this.date=i.data().startdate;
                
             
               
              }
             
            }
          })
    
         
          
        })
      })
      
  //Pending
  this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
    this.Request=[];
    this.PendingSize = 0;
   
      data.forEach(i => {
        if(i.exists){
          if(i.data().bookingState === "waiting"){
           
            console.log("ewewew ", i.data());
            this.Request.push(i.data());
          
            this.PendingSize =  this.Request.length;
          }
        }
      })
      
  })
  //Decline
  this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").onSnapshot(data => {
    this.Decline=[];
    this.DeclineSize = 0;
   
      data.forEach(i => {
        if(i.exists){
          if(i.data().bookingState === "Decline"){
           
            console.log("DeclineSize ", i.data());
            this.Decline.push(i.data());
          
            this.DeclineSize =  this.Decline.length;
          }
        }
      })
      
  })
    
     //Customized tattoo
     this.Customized=[];
     this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").limit(6).onSnapshot(data => {
       this.Customized=[];
     
        data.forEach(i => {
          if(i.exists){
            if(i.data().field === "Customized"){
             
              console.log("ewewew ", i.data());
              this.Customized.push({id: i.id, dataTattoo: i.data()});
            
             
            }
          }
        })
  
        
  
    })
    //view More
    this.ViewMore=[];
    this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").onSnapshot(data => {
      this.ViewMore=[];
      
    
       data.forEach(i => {
         if(i.exists){
           if(i.data().field === "Customized"){
          
             console.log("ewewew ", i.data());
             this.ViewMore.push({id: i.id, dataTattoo: i.data()});
           
            
           }
         }
       })
 
       
 
   })
  }
  
}
showTattoo(item) {
  console.log(item);
  this.showCustom.name_t = item.dataTattoo.name;
  this.showCustom.breadth = item.dataTattoo.breadth;
  this.showCustom.length = item.dataTattoo.length;
  this.showCustom.image_t = item.dataTattoo.image;
  this.showCustom.desc = item.dataTattoo.description;
  this.showCustom.id = item.dataTattoo.id
  
}
async DeleteData() {
  console.log();
  
  const alert = await this.alertCtrl.create({
    header: 'DELETE!',
    message: '<strong>Are you sure you want to delete this tattoo?</strong>',
    buttons: [
      {
        text: 'Cancel',
        
        handler: data => {
          console.log('Cancel clicked');
        }
      }, {
        text: 'Delete',
        handler: data => {
          this.db.collection("Bookings").doc().delete();
          
        }
      }
    ]
  });
  await alert.present();
}

}
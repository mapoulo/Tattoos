import { CustomizePage } from './../customize/customize.page';
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
import { MessagesPage } from '../messages/messages.page';


// import { timingSafeEqual } from 'crypto';
declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [DatePipe]
})
export class ProfilePage implements OnInit {
  respnses=[]
  key = ""
  uid = ""
  split: boolean = false;
  splitDiv: any = document.getElementsByClassName('split-pane');
  describeDiv: any = document.getElementsByClassName('details');
  decribe: boolean = true;
  arrows: string = 'arrow-back';
  showProfile1;
  category: any = 'accepted';
  MyImage = ""
  storage = firebase.storage().ref();
  showCustom = {
    name_t: '',
    image_t: '',
    sizes: '',
    color: '',
    desc: '',
    id: ''
  }
  custom: boolean = false;
  customDiv:any = document.getElementsByClassName('customizedTDiv');
  constructor(public alertCtrl: AlertController,private DeliverDataService: DeliverDataService, private toastController: ToastController, public fileOpener : FileOpener, public plt : Platform, private rout: Router, private modalController: ModalController, private rendered: Renderer2, public fileTransfer : FileTransferObject, public file : File ,  private transfer: FileTransfer, private render: Renderer2)  { 
 
    this.respnses = this.DeliverDataService.AcceptedData; }
  loader = true;
  User=[];
  email: string;
  Requests=[];
  Request=[];
  Bookings=[];
  startingDate;
  MyMessages = []
  endingDate;
  Response=[];
  Messages=[] 
  ViewMore=[];
  userID :string;
  name = "";
  Decline=[];
  DeclineSize=0;
  Pending = []
  Accepted = []
  image = "";
  size=0;
  PendingSize=0;
  pdf;
  edit: boolean = false;
  editDivModal = document.getElementsByClassName('modal');
  Myname = "";
  Mynumber = "";
  MyEmail = "";
  link = "";
  MyPdf = "";
  pdfObj = null;
  MyNotifications = 0;
  Customized=[];
  db = firebase.firestore();
  Aid = ""
  
  ngOnInit() {

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(data => {
          this.MyImage = data.data().image
      })
  
      
      this.showProfile();
      setTimeout(() => {
        this.loader = false;
      }, 1000);
  
      this.db.collection("Messages").doc(firebase.auth().currentUser.uid).collection("Message").onSnapshot(data => {
  
  
        let obj = {aid : "", data : {}}
        this.MyMessages = []
  
        data.forEach(item => {
          console.log("Id  dddddddd ",  item.id);
          obj.aid = item.id
          obj.data = item.data()
          // this.Aid = item.data().auid
              this.MyMessages.push(obj)
              obj = {aid : "", data : {}}
        })
      })

      }else {
        console.log('Not logied In');
        
      }
    })
  
   
  }

  async  viewMessages(){

    const modal = await this.modalController.create({
      component: MessagesPage,
      cssClass:'modalMessages'

    });
    return await  modal.present();

  }
  

  async opnModal(){
    let modal = await this.modalController.create({
      component : CustomizePage,
      cssClass: 'modalNotification'
    })
    return await modal.present();
   }


 async DeleteMessage(key){
    console.log("dddddsdsd ", key);

   
    
    const alert = await this.alertCtrl.create({
      header: 'DELETE!',
      message: '<strong>Are you sure you want to delete this message?</strong>',
      buttons: [
        {
          text: 'Cancel',
          
          handler: data => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Delete',
          handler: data => {
         
            this.db.collection("Messages").doc(firebase.auth().currentUser.uid).collection("Message").doc(key).delete()
          }
        }
      ]
    });

    await alert.present();
  }


  changeListener(event): void {
    
    const i = event.target.files[0];
    console.log(i);
    const upload = this.storage.child(i.name).put(i);
    upload.on('state_changed', snapshot => {
  this.loader=true;
     
    setTimeout(() => {
      this.loader = false;
   }, 1000);
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('upload is: ', progress , '% done.');
        
      
      
    }, err => {
    }, () => {
      upload.snapshot.ref.getDownloadURL().then(image => {
        console.log('File avail at: ', image);
        this.MyImage = image;
     
      });
    });


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
 
        /* this.presentToast('You have logged in Successfully') */
        this.showProfile1 = true;
        this.email=firebase.auth().currentUser.email;
        this.userID=firebase.auth().currentUser.uid;
        
        this.db.collection("Response").onSnapshot(data => {
          this.MyNotifications  = 0
          data.forEach(item => {
            if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "Pending"){
              this.MyNotifications += 1
            }
          })
        })

        this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(data => {
          this.Myname = data.data().name
          this.MyImage = data.data().image
          this.Mynumber = data.data().number
          this.MyEmail = data.data().email
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
      
      
      return await modal.present();
    
  
  
  
  }
  
  logout(){
    console.log("Method Called");
    
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 2000);
    this.DeliverDataService.logoutUser().then(()=>{
      this.rout.navigateByUrl('/');
     
    })
    }


    
      async Edit(){
        console.log("Images  ", this.MyImage);
        this.loader = true;
        setTimeout(() => {
          this.db.collection("Users").doc(firebase.auth().currentUser.uid).update({
            name :this.Myname,
            number:this.Mynumber,
            image : this.MyImage
          
          });
          
          setTimeout(() => {
            this.loader = false;
          }, 2000);
    
          this.modalAnimate();
          
        }, 3000)
       
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
   
    //Display Messages
    
 
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        this.showProfile();

        this.showProfile1 = true;
        this.db.collection("Messages").doc(firebase.auth().currentUser.uid).collection("Message").onSnapshot(data => {
       
          data.forEach(i => {
            this.Messages=[];
            data.forEach(i => {
             
              if(i.exists){
                // if(i.data().bookingState === "Accepted"){
                  
                 
                  this.Messages.push(i.data());
                 // this.size=  this.Messages.length;
                  
                // console.log("messages",this.Messages)
                  //this.date=i.data().startdate;
                  
               
                 
                // }
               
              }
            })
           
            
          })
        })
        this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(item => {
          console.log("User Logged in ", item.data());
          this.Myname = item.data().name;
          this.Mynumber = item.data().number;
          this.MyImage=item.data().image;
          
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
        
        this.email=firebase.auth().currentUser.email;
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
       this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").onSnapshot(data => {
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
this.db.collection("Response").onSnapshot(data => {
  this.Decline = []
  data.forEach(item => {
    if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "Declined"){
        this.Decline.push(item.data())
    }
  })
})


this.db.collection("Response").onSnapshot(data => {
  this.Accepted = []
  data.forEach(item => {
    if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "Accepted"){
        this.Accepted.push(item.data())
    }
  })
})


this.db.collection("Bookings").onSnapshot(data => {
  this.Pending = []
  data.forEach(item => {
    if(item.data().uid == firebase.auth().currentUser.uid && item.data().bookingState == "waiting"){
        this.Pending.push(item.data())
    }
  })
})
     
      //Customized tattoo
      this.Customized=[];
      this.db.collection("Bookings").limit(6).onSnapshot(data => {
        this.Customized=[];
      
         data.forEach(i => {
           if(i.exists){
             if(i.data().field === "Customized" && i.data().uid == firebase.auth().currentUser.uid){
              
               console.log("ewewew ", i.data());
               this.Customized.push({id: i.id, dataTattoo: i.data()});
             
              
             }
           }
         })
   
         
   
     })


     //view More
     this.ViewMore=[];

     this.db.collection("Bookings").onSnapshot(data => {
       this.ViewMore=[];
       
     
        data.forEach(i => {
          if(i.exists){
            if(i.data().field === "Customized" && i.data().uid == firebase.auth().currentUser.uid){
           
              console.log("ewewew ", i.data());
              this.ViewMore.push({id: i.id, dataTattoo: i.data()});
            
             
            }
          }
        })
  
        
  
    })
      }
    })
         //User's details
         
   
        
       
      
 
  
}


showTattoo(item) {
  console.log("wwwwwwwww",item.id);
  this.key = item.id
  this.uid = item.dataTattoo.uid
  this.showCustom.name_t = item.dataTattoo.name;
  this.showCustom.sizes = item.dataTattoo.sizes;
  this.showCustom.color = item.dataTattoo.color;
  this.showCustom.image_t = item.dataTattoo.image;
  this.showCustom.desc = item.dataTattoo.description;
  this.showCustom.id = item.dataTattoo.id
  
}

async DeleteData() {

  console.log("key", this.key);
  console.log("uid", this.uid);
  
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
          this.db.collection("Bookings").doc(this.key ).delete()
          this.showCustom.name_t = "";
          this.showCustom.sizes = "";
          this.showCustom.color = "";
          this.showCustom.image_t = "";
          this.showCustom.desc = "";
          this.showCustom.id = "";
          this.del()
          this.seeDecribe()
        }
      }
    ]
  });
  await alert.present();
}

downloadPdf1(){
  this.db.collection("Admin").onSnapshot(data => {
    data.forEach( async(i) => {

      if(i.data().pdf == ""){

        
      const alert = await this.alertCtrl.create({
        header: '',
        message: 'There is no contract to download.',
        buttons: [
          {
            text: 'ok',
            
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
  
    
      await alert.present();

      }else{
        this.MyPdf = i.data().pdf;
        const pdfUrl = this.MyPdf ;
        const pdfName = 'InkScribeTattoo Contract.pdf';
        FileSaver.saveAs(pdfUrl, pdfName);
      }
   
    })
  })
}
async del(){
  const alert = await this.alertCtrl.create({
    header: "",
    subHeader: "",
    message: "Tattoo deleted successfully",
    buttons: ['OK']
  });
  alert.present();
}  
}
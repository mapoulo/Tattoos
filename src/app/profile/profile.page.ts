import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { DeliverDataService } from 'src/app/deliver-data.service';
import { Router } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController, Platform } from '@ionic/angular';
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

  constructor(private DeliverDataService: DeliverDataService, public fileOpener : FileOpener, public plt : Platform, private rout: Router, private modalController: ModalController, private rendered: Renderer2, public fileTransfer : FileTransferObject, public file : File ,  private transfer: FileTransfer, private render: Renderer2)  { this.respnses = this.DeliverDataService.AcceptedData; }

  loader = true;
  User=[];
  email: string;
  Requests=[];
  Bookings=[];
  startingDate;
  endingDate;
  Response=[];
  userID :string;
  name = "";
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
  
  db = firebase.firestore();

  ngOnInit() {

    
  }


  
  addClasseAnimate() {
    this.split = !this.split
    if (this.split) {
     
       this.render.setStyle(this.splitDiv[0],'display','block'); 
     
    } else {
      setTimeout(() => {
       this.render.setStyle(this.splitDiv[0],'display','none');
       
       
      }, 500);
    }
  }
  

  logout(){

    console.log("Method Called");
    
    this.loader = true;
    this.DeliverDataService.logoutUser().then(()=>{
      this.rout.navigateByUrl('xplore');
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

    // download() {

    //   const fileTransfer: FileTransferObject = this.transfer.create();
    //   fileTransfer.download(this.pdf, this.file.dataDirectory + 'file.pdf').then((entry) => {
    //     console.log('download complete: ' + entry.toURL());
    //   }, (error) => {
    //     // handle error
    //   });
      
    // }

    downloadPdf() {
      

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
    

  //     this.fileOpener.open(this.MyPdf, 'application/pdf')
  // .then(() => console.log('File is opened'))
  // .catch(e => console.log('Error opening file', e));

  //     if (this.plt.is('cordova')) {
  //       this.pdfObj.getBuffer((buffer) => {
  //         var blob = new Blob([buffer], { type: 'application/pdf' });
  // ​
  //         // Save the PDF to the data Directory of our App
  //         this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
  //           // Open the PDf with the correct OS tools
  //           this.fileOpener.open(this.MyPdf, 'application/pdf');
  //         });
  //       });
  //     } else {
  //       // On a browser simply use download!
  //       this.pdfObj.download();
  //     }
    }
    
    
  ionViewWillEnter(){

   

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

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

        this.Requests=[];
        this.PendingSize = 0;

       
          data.forEach(i => {
            if(i.exists){
              if(i.data().bookingState === "waiting"){
               
                console.log("ewewew ", i.data());
                this.Requests.push(i.data());
              
                this.PendingSize =  this.Requests.length;
              }
            }
          })
    
          
    

      })
    
      // this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Requests").get().then(data => {
      //   data.forEach(i => {
      //     console.log("ewewew ", i.data());
      //     this.Requests.push(i.data());
          
      //   })
      // })
      
  
      // this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).collection("Response").get().then(data => {
      //   data.forEach(i => {
      //     console.log("Response ", i.data());
      //     this.Response.push(i.data());
          
      //   })
      // })
    
      
  }
}
}

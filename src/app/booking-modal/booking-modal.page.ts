import { DeliverDataService } from './../deliver-data.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Renderer2 } from '@angular/core';
import * as firebase from 'firebase';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { SuccessPagePage } from '../success-page/success-page.page';
import { SuccessPagePageModule } from '../success-page/success-page.module';
import { NotificationsService } from '../notifications.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.page.html',
  styleUrls: ['./booking-modal.page.scss'],
})
export class BookingModalPage implements OnInit {
  SelectedSize: string='';
  color: any=[
    'yes',
    'no',
  ];
  Myemail = ""
  Myimage = ""
  Myname = ""
  Mynumber = ""
  cmsTokenId = ""
  userImage = ""
 
    sizes:""
    describe = false;
    describeDiv = document.getElementsByClassName('description');
    icon = 'ios-arrow-up';
    category = "" 
    description = "" 
    image = "" 
    endPrice = ""
    startPrice = ""
    name = "";
  
    Cname = "";
    number : any = 0;
    db = firebase.firestore()
    tattooForm : FormGroup;
    validation_messages = {
      'sizes': [
        { type: 'required', message: 'sizes  is required.' },
  
      ],
     
    }
  loader: boolean = false;
       
  
 
  constructor(public DeliverDataService: DeliverDataService,private fb: FormBuilder, private modalController: ModalController, private notifications : NotificationsService, public alertController: AlertController,  private render: Renderer2) { 
  this.tattooForm = this.fb.group({
    sizes: new FormControl('', Validators.compose([Validators.required])),
    // Breadth: new FormControl('', Validators.compose([Validators.required])),
  })
}
 radioChangeHandler(event: any){
   this.SelectedSize=event.target.value;
}
  ngOnInit() {
    if(firebase.auth().currentUser){
      this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(data => {
        this.userImage = data.data().image
        console.log("Image ", this.userImage);
        
      })
      setTimeout(() => {
      
  
        this.db.collection("Bookings").doc(firebase.auth().currentUser.uid).update({
          email : this.Myemail,
          image  : this.Myimage,
          name  : this.Myname ,
          number  : this.Mynumber,
          // tokenId : this.notifications.token,
          // cmsTokenId : this.cmsTokenId ,
          // myTokenId : this.notifications.token,
          
  
    })
  
    
      }, 4000);
     }
    
    this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(data => {
      this.Myemail = data.data().email;
      this.Myimage  = data.data().image
      this.Myname  = data.data().name
      this.Mynumber  = data.data().number
 })
    this.db.collection("Admin").onSnapshot(data => {
      data.forEach(item => {
        // this.cmsTokenId = item.data().tokenId
        console.log("Your data is dddddd ", item.data().tokenId);
        
      })
    })
    this.db.collection("Users").doc(firebase.auth().currentUser.uid).get().then(data => {
      this.Cname = data.data().name;  
      this.number = data.data().number;
      this.userImage = data.data().image;
    })
  }
  
  
  ionViewWillEnter(){
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
     
    }, 1000);
    
    this.category = this.DeliverDataService.dataSaved.category ;
    this.description = this.DeliverDataService.dataSaved.description  ;
    this.image = this.DeliverDataService.dataSaved.image  ;
    this.name = this.DeliverDataService.dataSaved.name  ;
    this.startPrice = this.DeliverDataService.dataSaved.startPrice  ;
    this.endPrice = this.DeliverDataService.dataSaved.endPrice;
  
    console.log("Data in the booking modal" ,  this.description );
  }
  closeDescriptionAnimate() {
    this.describe = !this.describe;
    this.loader = true;
    setTimeout(() => {
      if (this.describe) {
     /*    this.render.setStyle(this.describeDiv[0],'display','block'); */
        this.render.setStyle(this.describeDiv[0],'height','80%');
        /*  this.render.setStyle(this.describeDiv[0],'overflow','auto'); */
        this.icon = 'ios-arrow-down';
      } else {
        setTimeout(() => {
         this.render.setStyle(this.describeDiv[0],'height','5%');
         /* this.render.setStyle(this.describeDiv[0],'overflow','hidden'); */
         this.icon = 'ios-arrow-up';
         /* this.render.setStyle(this.describeDiv[0],'display','none'); */
        }, 500);
      }
      this.loader = false;
    }, 1000);
    
    
  }


  senBookig(){



    this.loader = true;
  //  this.notifications.requestPermission();
   console.log("The key Is here ", this.notifications.token);
    setTimeout(async () => {
      if (this.tattooForm.valid ) {
        // if(this.Length != 0 && this.Breadth != 0){
          this.db.collection("Bookings").doc().set({
    
                
            category : this.category,
            description : this.description,
            image : this.image,
           startPrice : this.startPrice,
           endPrice : this.endPrice,
            tattoName: this.name,
            sizes:this.sizes,
            email : firebase.auth().currentUser.email,
            uid : firebase.auth().currentUser.uid,
            customerName : this.Cname,
            number : this.number,
            bookingState : 'waiting',
            field : "Booking",
            // tokenId : this.notifications.token,
            //cmsTokenId : this.cmsTokenId ,
            userImage : this.userImage,
            color:this.SelectedSize
      
          }).then( async() => {
      
            console.log("Your Booking is successful");
            const modal = await this.modalController.create({
              component: SuccessPagePage
            });
            return await  modal.present();
      
          })
      
       
      
          this.modalController.dismiss({
            'dismissed': true
          });
        }else{
          const alert = await this.alertController.create({
            header: '',
            subHeader: '',
            message: 'The legnth and bredth cannot be zero ',
            buttons: ['OK']
          });
      
          await alert.present();
        }
        
      // }
      this.loader = false;
      
    }, 2000);
 
  }


  dismiss() {

    this.modalController.dismiss({
      'dismissed': true
    });
  }

}






import { SignInPage } from './../sign-in/sign-in.page';
import { Component, OnInit } from '@angular/core';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ViewController } from '@ionic/core';
import { ModalController,AlertController, ActionSheetController } from '@ionic/angular';
import { BookingModalPage } from '../booking-modal/booking-modal.page';
import { DeliverDataService } from '../deliver-data.service';
import { Router } from '@angular/router';
// import { NotificationsService } from '../notifications.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  image = ""
  MyValue = 0
  cmsTokenId = ""
  name = '';
  email = '';
  password = '';
  db=firebase.firestore();
  storage = firebase.storage().ref();
  number  = 0;

  
  tattooForm : FormGroup;
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name  is required.' },
    ],
    'number': [
      { type: 'required', message: 'Number  is required.' },
    ],
    'email': [
      {type: 'required', message: 'Email address is required.'},
      {type: 'pattern', message: 'Email address is not Valid.'},
      {type: 'validEmail', message: 'Email address already exists in the system.'},
    ],
    'password': [
      {type: 'required', message: 'Password is required.'},
      {type: 'maxlength', message: 'Password must be minimum of 4 and maximum of  15 char'},
    ]

  }
  
  loader: boolean = false;
  constructor(public Router : Router,public DeliverDataService : DeliverDataService,  private modalController: ModalController, public actionSheetController: ActionSheetController, private fb: FormBuilder, private AlertController: AlertController) { }

  ngOnInit() {

    
  this.MyValue = this.DeliverDataService.checkValue
    this.tattooForm = this.fb.group({

      name: new FormControl('', Validators.compose([Validators.required])),
      
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+$')])),

     password: new FormControl('', Validators.compose( [Validators.required, 
      Validators.minLength(4), Validators.maxLength(15)])),

     
     number: new FormControl('', Validators.compose([Validators.required,
       Validators.maxLength(12)]))

    })

  }
  
  async register(){
    this.loader = true;



setTimeout(() => {
 
 if (this.tattooForm.valid ) {


   firebase.firestore().collection("Admin").onSnapshot(data => {
     data.forEach(item => {
       this.cmsTokenId = item.data().tokenId;
       console.log("sdsddsd ", this.cmsTokenId);
       
     })
   })
   

 firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(( error) =>{
   // Handle Errors here.




this.modalController.dismiss({
  'dismissed': true
  
 });


 setTimeout(() => {
  this.log()
 }, 1000);
 

 this.redirectToSignin()


//  this.modalController.create({
//   component : SignInPage
// })

// this.modalController.create({
//   component : SignInPage
// });

// return await modal.present();

//this.Router.navigateByUrl('/sign-in')
   // var errorCode = error.code;
   // var errorMessage = error.message;
   //this.log2();
   
//     cmsTokenId : this.cmsTokenId,
//  myTokenId : this.notification.token,
   console.log("Email already exist");
   
   // ...

 }).then(() => {
setTimeout(() => {
this.db.collection("Users").doc(firebase.auth().currentUser.uid).set({
 name : this.name,
 email : this.email,
 number : this.number,
 image :   this.image 
})
    console.log("Logged in");
    this.loader=true;
  
 setTimeout(() => {
   this.loader = true;
}, 1000);
this.reg()

this.dismiss()
this.modalController.dismiss({
 'dismissed': true
}); 

console.log("1111111111111111111111", firebase.auth().currentUser.email);
}, 2000)

 });
 
}

this.loader = false;
}, 3000);
/* this.dismiss()
this.modalController.dismiss({
 'dismissed': true
}); */
  

  if(this.MyValue != 0){

    

    const modal = await this.modalController.create({
      component: BookingModalPage
    });
    return await  modal.present();

  }
  

  this.DeliverDataService.checkValue = 0;

  
 


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
        this.image = image;
     
      });
    });
  }



  async SignIn(){
     this.modalController.dismiss({
      'dismissed': true
    });
    let modal = await this.modalController.create({
      component : SignInPage
    });
    return await modal.present();
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
async reg(){
const alert = await this.AlertController.create({
  header: "",
  subHeader: "",
  message: "Successfully registered",
  buttons: ['OK']
});
alert.present();
}
async log(){
  const alert = await this.AlertController.create({
    header: "Registration failed",
    subHeader: "",
    message: "Email address alredy exist login",
    buttons: ['OK'],
    
      
    


  });


  alert.present();



 
  }

  async redirectToSignin(){
    let modal = await this.modalController.create({
      component : SignInPage
    })
    
    return await modal.present();

  }
}
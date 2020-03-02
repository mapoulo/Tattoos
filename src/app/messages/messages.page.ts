import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { AlertController, ModalController } from '@ionic/angular';
import { DeliverDataService } from '../deliver-data.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit  {
  @ViewChild('content', {static: false}) private content: any;
  itemDiv: any = document.documentElement.getElementsByClassName('item');
  contentMessages: any = document.getElementsByClassName('content-messages');

  key = ''
  uid = ''
  response = ""
  messages = 0;
  fonts = 0;
  MessagesId = [];
  messageInfo = {
    name: '',
    email: '',
    message: '',
    time: ''
  };


  ids = []

  MyImages = ""
  MyName = ""
  phoneNumber = ""
  MyMessages = [];
  MyNames = ""
  MyNumber = ""
  AllMessages = 0;
  ReadMessages = 0;
  unReadMessages = 0;
  ShowMessage :boolean = false;
 
  MyImage = ""

  db = firebase.firestore();
  active;
  constructor(private render: Renderer2,  public DeliverDataService : DeliverDataService,  public alertController: AlertController, public modalController: ModalController) {



  }

  back() {
    this.render.setStyle(this.contentMessages[0], 'display', 'none');
    this.messageInfo = {
      name: '',
      email: '',
      message: '',
      time: ''
    };
  }
  scrollToBottomOnInit() {
    this.content.scrollToBottom(300);
    
  }

  ngOnInit() {
    
    setTimeout(() => {
      this.scrollToBottomOnInit(); 
    }, 100);
    

    this.db.collection("Message").get().then(item => {
      item.forEach(data => {
        if(data.data().uid == firebase.auth().currentUser.uid && data.data().cmsUid == null){
          this.db.collection("Message").doc(data.id).set({status : "Read"}, {merge : true})
        }
      })
    })
   
 

    firebase.auth().onAuthStateChanged((user) => {
      if(user){


        this.db.collection("Admin").onSnapshot(data => {
          data.forEach(item => {
            this.MyImages = item.data().image
            this.MyNames = item.data().name
            this.phoneNumber = item.data().phoneNumber
          })
        })

        this.db.collection("Users").doc(firebase.auth().currentUser.uid).onSnapshot(data => {

          this.MyName = data.data().name
          this.MyImage = data.data().image
          this.MyNumber = data.data().number

        })


        this.ShowMessage = true
        this.db.collection("Message").orderBy("time", "asc").onSnapshot(data => {

          this.MyMessages  = []

          data.forEach(item => {
            if(item.data().uid == firebase.auth().currentUser.uid){
              this.MyMessages.push(item.data())
            
              
            }
          })
        })


     


      }
    })





  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.scrollToBottomOnInit(); 
    }, 100);
  }


  async sendMessage(){
  

    
    this.db.collection("Admin").get().then(data => {

      data.forEach(item => {
        console.log("CMS UID ", item.data().uid); 
        this.db.collection("Message").doc().set({

          name : this.MyName,
          image : this.MyImage,
          email : firebase.auth().currentUser.email,
          message : this.response,
          status : "NotRead",
          cmsUid : "CMS",
          number : this.MyNumber,
          time : moment().format('MMMM Do YYYY, h:mm:ss a'),
          uid : firebase.auth().currentUser.uid,
         
        })
  
      })
      setTimeout(() => {
        this.response = "";
      }, 25);

    })

    setTimeout(() => {
      this.scrollToBottomOnInit(); 
    }, 100);
     

   }





  updateMessage(uid, key, data, i) {



    // setTimeout(() => {
    //   console.log("Not Sorted ",this.MyMessages);
    //   this.MyMessages.sort();
    //   console.log("Sorted ",this.MyMessages);

    // }, 1000);

    console.log('Your data is here ', key);


    this.uid = uid;
    this.key = key;

    this.active = i;

    this.messageInfo.name = data.name;
    this.messageInfo.message = data.message;
    this.messageInfo.email = data.email;
    this.messageInfo.time = data.time;


    this.render.setStyle(this.contentMessages[0], 'display', 'flex');

    this.db.collection('Message').doc(key).set({status: 'Read' }, {merge : true});
    console.log('Message updated');

  }


  async deleteMessage() {

    console.log('Key ', this.uid);



    this.db.collection('Message').doc(this.uid).delete();
    console.log('Message Deleted');


    const alert = await this.alertController.create({
      header: '',
      subHeader: '',
      message: 'Message Deleted',
      buttons: [ 'Ok']
    });

    await alert.present();

    this.messageInfo = {
      name: '',
      email: '',
      message: '',
      time: ''
    };


  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  }

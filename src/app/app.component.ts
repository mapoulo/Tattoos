import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import {firebaseConfig} from '../environments/firebaseConfig'
import { AlertController } from '@ionic/angular';
import { NotificationsService } from './notifications.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  

})
export class AppComponent {


one_signal_id = '3ce1cb91-88ef-4205-a5e7-71eb3ceae6b6';
firebase_id = '396095430599';


  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationsService: NotificationsService
  ) {
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        // this.setupPush();
      }

    });
  }

  ngAfterViewInit() {
    
    this.platform.ready().then(async () => {
       await this.notificationsService.requestPermission();
    });
  }
  setupPush() {}
  


  // setupPush() {
  //   // I recommend to put these into your environment.ts
  //   this.oneSignal.startInit('3ce1cb91-88ef-4205-a5e7-71eb3ceae6b6', '614855155179');
 
  //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
  //   // Notifcation was received in general
  //   this.oneSignal.handleNotificationReceived().subscribe(data => {
  //     let msg = data.payload.body;
  //     let title = data.payload.title;
  //     let additionalData = data.payload.additionalData;
  //     this.showAlert(title, msg, additionalData.task);
  //   });


 
    // Notification was really clicked/opened
  //   this.oneSignal.handleNotificationOpened().subscribe(data => {
  //     // Just a note that the data is a different place here!
  //     let additionalData = data.notification.payload.additionalData;
 
  //     this.showAlert('Notification opened', 'You already read this before', additionalData.task);
  //   });
 
  //   this.oneSignal.endInit();
  // }

  async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    })
    alert.present();
  }
  
}

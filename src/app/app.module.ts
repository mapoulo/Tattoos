import { CustomizePageModule } from './customize/customize.module';

import { FileOpener } from '@ionic-native/file-opener/ngx';
import { NotificationsPageModule } from './notifications/notifications.module';


import { BookingModalPageModule } from './booking-modal/booking-modal.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './auth-guard.service';
import { File } from '@ionic-native/file/ngx';


import { SignInPageModule } from './sign-in/sign-in.module';
import { SuccessPagePageModule } from './success-page/success-page.module';
import { RegisterPageModule } from './register/register.module';

import { IonicStorageModule } from '@ionic/storage';
import { ResetPasswordPageModule } from './reset-password/reset-password.module';
import { MessagesPageModule } from './messages/messages.module';





@NgModule({
  declarations: [AppComponent ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),IonicStorageModule.forRoot(), AppRoutingModule, CustomizePageModule, ResetPasswordPageModule,NotificationsPageModule, BookingModalPageModule, RegisterPageModule, MessagesPageModule, SuccessPagePageModule, SignInPageModule],
  providers: [
    FileOpener,
    File,
    StatusBar,
    AuthGuardService,
    FileTransfer, FileTransferObject,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
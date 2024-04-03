import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastNoAnimationModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ToastNoAnimationModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

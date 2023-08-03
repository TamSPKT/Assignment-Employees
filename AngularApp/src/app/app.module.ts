import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { HomeComponent } from './home/home.component';
import { LogInterceptor } from './helpers/logging.interceptor';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EmployeeListComponent,
    CreateDialogComponent,
    UpdateDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpInterceptorFn, HttpClientModule } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { HotelService } from './services/hotel.service';
import { RoomService } from './services/room.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    AuthService,
    HotelService,
    RoomService,
    {
      provide: HttpInterceptorFn,
      useValue: authInterceptor,
      multi: true
    }
  ],
  exports: []
})
export class CoreModule { }
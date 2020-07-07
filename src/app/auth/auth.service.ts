import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $authCheck = new BehaviorSubject<any>(this.checkUserStatus());

  constructor(private _router:Router, private _cookieService: CookieService, private _http: HttpClient) { }

  login(auth_details:any){
    this._http.post('http://localhost:3000/authenticate', auth_details).subscribe((data:any)=>{
    if(data.isLoggedIn){
      alert('login');
      this.$authCheck.next(data.token);
      this._cookieService.set('token', data.token);
      this._router.navigate(['/home']);
    }
    else{
      alert('Wrong credentials.');
    }
  });
}

register(user){
  console.log(user);
  this._http.post('http://localhost:3000/register', user).subscribe((data:any)=>{
  if(data.success){

  }
  else{

  }
  });
};

checkUserStatus(){
  return this._cookieService.get('token');
}
logout(){
  this._cookieService.delete('token');
  this._router.navigate(['/login']);
  this.$authCheck.next(false);
}
};

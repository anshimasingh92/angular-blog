import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user:any = {};
  constructor(private auth:AuthService) { }

  ngOnInit() {


  }

  register(){
    this.auth.register(this.user);
  }


}

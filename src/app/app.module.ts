import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { HomeComponent } from './home/home/home.component';
import { RegisterComponent } from './register/register/register.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { NavigationComponent } from './home/navigation/navigation.component';
import { FormsModule} from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './auth/auth.guard';
import { AuthinterceptorService } from './auth/authinterceptor.service';
import { CreatepostComponent } from './createpost/createpost/createpost.component';
import { PostsComponent } from './posts/posts/posts.component';
import { CommentsComponent } from './comments/comments/comments.component';
import { EditpostComponent } from './editpost/editpost/editpost.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    WelcomeComponent,
    NavigationComponent,
    CreatepostComponent,
    PostsComponent,
    CommentsComponent,
    EditpostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: "home", component: WelcomeComponent, canActivate:[AuthGuard] },
      {path:'create',component:CreatepostComponent,canActivate: [AuthGuard]},
      { path: "login", component: LoginComponent},
      {path:'posts',component:PostsComponent,canActivate: [AuthGuard],
      children: [
        { path: 'editpost/:id', component: EditpostComponent, canActivate: [AuthGuard], outlet:'editpost' },
        { path: "", redirectTo: "posts", pathMatch: "full" }
      ]
    },

      {path: "register", component: RegisterComponent},
      { path: "", redirectTo: "home", pathMatch: "full"},
      {path: "**", redirectTo: "home"}
    ])
  ],
  providers: [AuthService, CookieService, AuthGuard,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthinterceptorService,
    multi: true
  }], 
  bootstrap: [AppComponent]
})
export class AppModule { }

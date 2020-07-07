import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {


  posts: any = [];
  obj:any = {};
  commentForm:any = {};
  commentStatus:[boolean] = [false];
   isOverlayVisible: boolean = false;

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('http://localhost:3000/getposts').subscribe((res: any) => {
      if (res.success) {
        this.posts = res.docs;
        console.log(this.posts);
      } else {
        alert(res.err);
      }

    });
  }

  delete(id) {
    this.obj = {'id':id};
    this._http.post('http://localhost:3000/deletepost/', this.obj).subscribe((res: any) => {
      if (res.success) {
        this._http.get('http://localhost:3000/getposts').subscribe((res: any) => {
          if (res.success) {
            this.posts = res.docs;
            console.log(this.posts);
          } else {
            alert(res.err);
          }
        });
      } else {
        alert(res.err);
      }
    });
  }

  like(id){
    this.obj = {'id':id};
    this._http.post('http://localhost:3000/addlike/', this.obj).subscribe((res: any) => {
      if (res.success) {
        this._http.get('http://localhost:3000/getposts').subscribe((res: any) => {
          if (res.success) {
            this.posts = res.docs;
            console.log(this.posts);
          } else {
            alert(res.err);
          }
        });
      } else {
        alert(res.err);
      }
    });
  }

  addcomment(id){
    this.obj = {'id':id, 'comment':this.commentForm};
    this.commentForm = {};
    this._http.post('http://localhost:3000/addcomment/', this.obj).subscribe((res: any) => {
      if (res.success) {
        this._http.get('http://localhost:3000/getposts').subscribe((res: any) => {
          if (res.success) {
            this.posts = res.docs;
            console.log(this.posts);
          } else {
            alert(res.err);
          }
        });
      } else {
        alert(res.err);
      }
    });
  }

  showcomment(id){
    console.log(id);
    this.commentStatus[id] = !this.commentStatus[id];
  }

  

onActivate(e) {
  this.isOverlayVisible = !this.isOverlayVisible;
}

onDeactivate(e) {
  this._http.get('http://localhost:3000/getposts').subscribe((res: any) => {
    if (res.success) {
      this.posts = res.docs;
    } else {
      alert(res.err);
    }
  });
  this.isOverlayVisible = !this.isOverlayVisible;
}
}

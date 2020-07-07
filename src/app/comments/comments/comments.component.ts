import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() postId: any;
  state: boolean = false;
  commentForm: any = {};
  comments: any = [];

  constructor(private _http: HttpClient) { }

  ngOnInit() {

    this._http.get('http://localhost:3000/getcomments' + '?postid=' + encodeURIComponent(this.postId)).subscribe((res: any) => {
      if (res.status) {
        this.comments = res.docs;
      } else {
        alert(res.err);
      }
    });
  }

  togglecomments() {
    this.state = !this.state;
  }

  /*addcomment(){
    var myobj: any = {};
    myobj.comment = this.commentForm;
    myobj.comment.postid = this.postId;
    this.commentForm={};
    this._http.post('http://localhost:3000/addcomment/', myobj).subscribe((res: any) => {
      if (res.status) {
        this._http.get('http://localhost:3000/getcomments' + '?postid=' + encodeURIComponent(this.postId)).subscribe((res: any) => {
          if (res.status) {
            this.comments = res.docs;
          } else {
            alert(res.err);
          }
        });
      } else {
        alert(res.err);
      }
    });
  }*/

}

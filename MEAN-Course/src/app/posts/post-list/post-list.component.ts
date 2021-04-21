import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { PageEvent } from '@angular/material/paginator';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;

  userId: string;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  public userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit() {
    this.spinner.show();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.spinner.hide();
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }

  onChangePage(pageData: PageEvent) {
    this.spinner.show();
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.spinner.hide();
  }

  onDelete(postId: string) {
    this.spinner.show();
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
    this.spinner.hide();
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AuthModule } from './../auth.module';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: AuthModule[] = [];
  private usersSub: Subscription;

  userId: string;
  totalusers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  public userIsAuthenticated = false;



  displayedColumns: string[] = ['email', 'password'];
  dataSource = new MatTableDataSource<AuthModule>(this.users);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.dataSource.paginator = this.paginator;
    this.authService.getUsers(this.usersPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.usersSub = this.authService.getUserUpdateListener()
      .subscribe((userData: { users: AuthModule[], userCount: number }) => {
        this.totalusers = userData.userCount;
        this.users = userData.users;
        this.dataSource = new MatTableDataSource(this.users);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.usersSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
    this.spinner.hide();
  }

  onChangePage(pageData: PageEvent) {
    this.spinner.show();
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.authService.getUsers(this.usersPerPage, this.currentPage);
    this.dataSource = new MatTableDataSource(this.users);
    this.spinner.hide();
  }


  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.usersSub.unsubscribe();
  }
}


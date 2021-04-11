import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { AccountService } from 'src/services';
import { ADMIN, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent implements OnInit {
  user: User;
  isAdmin: boolean;
  isSuper: boolean;
  showNav: boolean;
  constructor(
    private accountService: AccountService,
    private router: Router,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['']);
      return;
    }
    this.isAdmin = this.user.UserType === ADMIN;
    this.isSuper = this.user.UserType === SUPER;
    if (this.isSuper) {
      // this.router.navigate([`/admin/dashboard/super-categories`]);
    }
  }
  toggleNav() {
    this.showNav = !this.showNav
  }
  list(e){}
  
  logout() {
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }
}

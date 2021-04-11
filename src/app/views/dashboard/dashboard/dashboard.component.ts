import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { User } from 'src/models/user.model';
import { LoaderUx } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedIndex = 3;
  user: User;
  message: string;
  loading: boolean
  loadingUx: LoaderUx;
  constructor(
    private accountService: AccountService,
    private UxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.UxService.uxMessagePopObservable.subscribe(data => {
      this.message = data;
      const id = setTimeout(() => {
        this.message = null;
      }, 3000);
    });
    this.UxService.uxLoadingPopObservable.subscribe(data => {
     
      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

}

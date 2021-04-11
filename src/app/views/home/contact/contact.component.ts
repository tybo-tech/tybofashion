import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { EmailService, UploadService, UserService } from 'src/services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() customer: User;
  // <app-add-customer [user]="user">
  name;
  email;
  massage;
  phone;

  showLoader;
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private emailService: EmailService,
    private router: Router,
  ) { }

  ngOnInit() {
  }


  back() {
    this.router.navigate([``]);
  }

  sendEmail() {
    const emailToSend: Email = {
      Email: 'zowehsalongroup@zoweh.co.za',
      Subject: this.name + ' Enquiry',
      Message: `${this.massage}  | ${this.email} | ${this.phone}`,
      UserFullName: 'Zoweh Team'
    };
    this.showLoader = true;
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          setTimeout(() => {
            this.showLoader = false;
            alert('Thank you for contacting us we will reply as soon as possible');
            this.router.navigate(['']);
          }, 1000);
        }
      });
  }
}

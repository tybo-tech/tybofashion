import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { EmailService, UploadService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { IMAGE_DONE } from 'src/shared/constants';

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
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Done',
    routeTo: '',
    img: undefined
  };
  showLoader;
  constructor(
    private uploadService: UploadService,
    private uxService: UxService,
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
      Email: 'accounts@tybo.co.za',
      Subject: this.name + ' Enquiry',
      Message: `${this.massage}  | ${this.email} | ${this.phone}`,
      UserFullName: this.name
    };
    this.showLoader = true;
    this.uxService.showLoader();
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          setTimeout(() => {
            this.uxService.hideLoader();
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE
            this.modalModel.body.push('Thank you for contacting us we will reply as soon as possible')
          }, 1000);
        }
      });
  }
}

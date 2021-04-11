import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { OrderService } from 'src/services/order.service';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  @Input() orders;
  order: Order;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Done',
    routeTo: '/my-orders',
    img: undefined
  };
  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
  }
  confirmDelivery(order: Order) {
    this.order= order;
    this.order.Status = 'Delivered';
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.routeTo = `my-orders`;
        this.modalModel.body.push(`Thanks for confirming the delivery.`);
        this.order = data;
        this.orderService.updateOrderState(this.order);
      }
    });
  }
}

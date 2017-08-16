import {Component, OnInit}      from '@angular/core';
import {UnsubscriberComponent}  from './unsubscriber.component';
import {NotificationService}    from './notification.service';

@Component({
  selector: '[notifications]',
  template: require('./notifications.component.html')
})
export class NotificationsComponent extends UnsubscriberComponent implements OnInit {
    public notifications;
    private errorMessage;

  constructor(private _notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(
      this._notificationService.notification$.subscribe(notifications => this.notifications = notifications));
    this._notificationService.get();
  }
}

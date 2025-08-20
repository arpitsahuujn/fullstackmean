import { Component, inject } from '@angular/core';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterModule, RouterOutlet } from '@angular/router';

import { AsyncPipe, CommonModule } from '@angular/common';
import { DeviceDetectorService, DeviceType } from '../../core/services/device-detector.service';
import { Observable } from 'rxjs';


import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, 
            RouterModule,RouterOutlet,AsyncPipe,MatButtonModule,CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

  public deviceService = inject(DeviceDetectorService);
  public authService = inject(AuthService);
  public loggedInUser = this.authService.currentUser;

  deviceType$: Observable<DeviceType> = this.deviceService.getDeviceType();

  currentDeviceType: DeviceType = 'desktop';

  constructor() {
    this.deviceType$.subscribe(type => this.currentDeviceType = type);


  }


ngOnInit() {

}

onNavClick(drawer: MatSidenav): void {
    if (this.currentDeviceType === 'mobile') {
      drawer.close();
    }
  }

}

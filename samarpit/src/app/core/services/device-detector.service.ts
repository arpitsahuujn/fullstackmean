import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {
  // Define your custom breakpoint queries
  private readonly MOBILE_QUERY = '(max-width: 599.99px)';
  private readonly TABLET_QUERY = '(min-width: 600px) and (max-width: 959.99px)';
  private readonly DESKTOP_QUERY = '(min-width: 960px)';

  private deviceType$ = new BehaviorSubject<DeviceType>('desktop');

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([this.MOBILE_QUERY, this.TABLET_QUERY, this.DESKTOP_QUERY])
      .pipe(
        map(result => {
          const breakpoints = result.breakpoints;
          if (breakpoints[this.MOBILE_QUERY]) {
            return 'mobile';
          } else if (breakpoints[this.TABLET_QUERY]) {
            return 'tablet';
          } else if (breakpoints[this.DESKTOP_QUERY]) {
            return 'desktop';
          }
          // fallback (in case none matched)
          return 'desktop';
        }),
        distinctUntilChanged()
      )
      .subscribe(type => this.deviceType$.next(type));
  }

  getDeviceType(): Observable<DeviceType> {
    return this.deviceType$.asObservable();
  }
}


// @if(deviceType$ | async){
//  <div>
//       Current device: {{ deviceType$ | async }}
//     </div>
// }


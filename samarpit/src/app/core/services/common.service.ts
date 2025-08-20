import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private dialog: MatDialog) { }

// to find index of array data 
  getIndexOfArrayData(data: any[], property: string, value: any) {
    let result = -1;
    data && data.some(function (item, i): any {
      if (item[property] === value) {
        result = i;
        return true;
      }
    });
    return result;
  }

// to show alert box
  showAlert(data: any) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      autoFocus: false, // to stop auto focus on button when click anywhere
      disableClose: true, // to stop outside touch close
      data: data,
      width: '400px'
    });
    return dialogRef.afterClosed();
  }


}

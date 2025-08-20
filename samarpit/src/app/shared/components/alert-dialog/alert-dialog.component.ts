import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert-dialog',
  imports: [MatIconModule, CommonModule,MatButtonModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {

  readonly dialogRef = inject(MatDialogRef<AlertDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
  ) { }


}

// use this dialog
/*

    this.commonService.showAlert({ icon: 'success', title: 'Success', message: 'you have succesfully work', yesBtn: 'Yes', noBtn: 'NO', okBtn: 'OK' })
      .subscribe(result => {
        if (result) {
          //  your code
        }
      });
      
*/


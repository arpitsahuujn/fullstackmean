import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { EndUserService } from '../../core/services/end-user.service';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { CommonService } from '../../core/services/common.service';


@Component({
  selector: 'app-users',
  imports: [RouterOutlet, RouterLink, MatCardModule, CommonModule, MatToolbarModule, MatChipsModule,
    MatButtonModule, MatDialogModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  readonly dialog = inject(MatDialog);
  public endUserService = inject(EndUserService);
  public commonService = inject(CommonService);

  users: any = [];

  constructor(public router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList() {
    this.endUserService.getUsersList().subscribe((data) => (this.users = data));
  }

  editUser(user: any) {
    this.endUserService.updateUser(user).subscribe(result => {
      if (result) {
        let index = this.commonService.getIndexOfArrayData(this.users, 'usrId', result.usrId)
        if (index != -1)
          this.users.splice(index, 1, result);
      }
    }, err => {
      console.error('failed', err);
    })
  }

  addUser(user: any) {
    // Generate a 4-digit unique userId
    const usrId = 'usr' + Math.floor(1000 + Math.random() * 9000).toString();
    let param = {
      usrnm: user.usrnm,
      name: user.name,
      pass: user.pass,
      email: user.email,
      location: user.location,
      usrId: usrId,
      role: '2'
    }
    this.endUserService.addUser(param).subscribe(result => {
      if (result) {
        this.users.unshift(result);
      }
    }, err => {
      console.error('Registration failed', err);
    })
  }

  deleteUser(usrId:any) {
    this.commonService.showAlert({ icon: 'warning', title: 'Are you sure', message: 'you want to delete this user', yesBtn: 'Yes', noBtn: 'NO' })
      .subscribe(result => {
        if (result) {
          this.endUserService.deleteUser(usrId).subscribe(() => {
            this.users = this.users.filter((u: any) => u.usrId !== usrId);
          });
        }
      });
  }

  openEditUserDialog(user: any) {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      // width: "650px",
      // height: 'auto',
      // panelClass: 'addJobMainDialog',
      autoFocus: false, // to stop auto focus on button when click anywhere
      disableClose: true, // to stop outside touch close
      data: { formType: 'edit', from: 'users', userData: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let param = {
          usrnm: result.usrnm,
          name: result.name,
          pass: result.pass,
          email: result.email,
          location: result.location,
          role: user.role,
          usrId: user.usrId
        }
        this.editUser(param)
      }
    });
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      // width: "650px",
      // height: 'auto',
      // panelClass: 'addJobMainDialog',
      autoFocus: false, // to stop auto focus on button when click anywhere
      disableClose: true, // to stop outside touch close
      data: { formType: 'add', from: 'users' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addUser(result)
      }
    });
  }

  goToOverview(id: any) {
    // const id = id ? id : null;
    //  this.router.navigate(['/users', id]);
    this.router.navigate([`users/${id}/overview`]);
  }

}

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { EndUserService } from '../../core/services/end-user.service';
import { CommonService } from '../../core/services/common.service';
import { AddEditClientComponent } from './add-edit-client/add-edit-client.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-clients',
  imports: [RouterOutlet,RouterLink , MatCardModule, CommonModule, MatToolbarModule, MatChipsModule,
    MatButtonModule, MatDialogModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  
  readonly dialog = inject(MatDialog);
  public endUserService = inject(EndUserService);
  public commonService = inject(CommonService);
  public router = inject(Router);
  public route = inject(ActivatedRoute);

  clients: any = [];

  constructor() {
  }

  ngOnInit(): void {
    this.getClientsList()
    
  }

   getClientsList() {
    this.endUserService.getClientsList().subscribe((data) => (this.clients = data));
  }

  editClient(client: any) {
    this.endUserService.updateClient(client).subscribe(result => {
      if (result) {
        let index = this.commonService.getIndexOfArrayData(this.clients, 'cltId', result.cltId)
        if (index != -1)
          this.clients.splice(index, 1, result);
      }
    }, err => {
      console.error('failed', err);
    })
  }

  addClient(client: any) {
    // Generate a 4-digit unique userId
    const cltId = 'clt' + Math.floor(1000 + Math.random() * 9000).toString();
    let param = {
      usrnm: client.usrnm,
      name: client.name,
      pass: client.pass,
      email: client.email,
      location: client.location,
      cltId: cltId,
      role: '3'
    }
    this.endUserService.addClient(param).subscribe(result => {
      if (result) {
        this.clients.unshift(result);
      }
    }, err => {
      console.error('Registration failed', err);
    })
  }

  deleteClient(cltId:any) {
    this.commonService.showAlert({ icon: 'warning', title: 'Are you sure', message: 'you want to delete this client', yesBtn: 'Yes', noBtn: 'NO' })
      .subscribe(result => {
        if (result) {
          this.endUserService.deleteClient(cltId).subscribe(() => {
            this.clients = this.clients.filter((u: any) => u.cltId !== cltId);
          });
        }
      });
  }

  openEditClientDialog(client: any) {
    const dialogRef = this.dialog.open(AddEditClientComponent, {
      // width: "650px",
      // height: 'auto',
      // panelClass: 'addJobMainDialog',
      autoFocus: false, // to stop auto focus on button when click anywhere
      disableClose: true, // to stop outside touch close
      data: { formType: 'edit', from: 'clients', clientData: client }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let param = {
          usrnm: result.usrnm,
          name: result.name,
          pass: result.pass,
          email: result.email,
          location: result.location,
          role: client.role,
          cltId: client.cltId
        }
        this.editClient(param)
      }
    });
  }

  openAddClientDialog() {
    const dialogRef = this.dialog.open(AddEditClientComponent, {
      // width: "650px",
      // height: 'auto',
      // panelClass: 'addJobMainDialog',
      autoFocus: false, // to stop auto focus on button when click anywhere
      disableClose: true, // to stop outside touch close
      data: { formType: 'add', from: 'clients' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addClient(result)
      }
    });
  }

  goToOverview(id: any) {
    // const id = id ? id : null;
    //  this.router.navigate(['/users', id]);
    this.router.navigate([`clients/${id}/overview`]);
  }
}

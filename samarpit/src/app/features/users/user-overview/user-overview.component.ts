import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-overview',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss'
})
export class UserOverviewComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('User ID:', id);
  }

  goBack() {
    this.router.navigate(['users']);
  }

}

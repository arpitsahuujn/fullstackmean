import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client-profile',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss'
})
export class ClientProfileComponent {


    goToItems() {
      // this.router.navigate(['dashboard']);   //-> http://localhost:4200/dashboard
      // this.router.navigate(['users/usroverview']);  //-> http://localhost:4200/users/usroverview
      // this.router.navigate(['items'], { relativeTo: this.route });  //-> http://localhost:4200/users/items
  }


}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import * as Global from '../resources/global';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public currentUser = signal<any | null>(null); // Replace `any` with a proper user interface

  constructor(private http: HttpClient) { 
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
 
  }


// Register
	register(paramData:any): Observable<any> {
		return this.http.post(
			Global.register,
			paramData
		);
	}

// Login
  login(paramData:any): Observable<any> {
		return this.http.post(
			Global.login,
			paramData
		);
	}

  logout() {
    localStorage.removeItem('user'); // Clear the user session
    this.currentUser.set(null);
    this.router.navigate(['']); // Redirect to login page
    // localStorage.clear(); // Clears all keys in localStorage
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getToken() {
    return this.currentUser()?.token;
  }


}

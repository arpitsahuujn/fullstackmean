import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Global from '../resources/global';

@Injectable({
  providedIn: 'root'
})
export class EndUserService {

  constructor(private http: HttpClient) {}

// --------- user Module api call --------
  
  // Add new user
 addUser(paramData:any): Observable<any> {
   return this.http.post(
     Global.addUser,
     paramData
   );
 }

  // Get all users
  getUsersList(): Observable<any> {
    return this.http.get(Global.getUsersList);
  }
  
  // Update user
  updateUser(user:any): Observable<any> {
    return this.http.put(Global.updateUser + '/' + user.usrId, user); // pass user id as route param
  } 

  // Delete user
  deleteUser(usrId:any): Observable<any> {
    return this.http.delete(Global.deleteUser + '/' + usrId); // pass user id as route param
  }

// --------- client Module api call --------

  // Add new client
   addClient(paramData:any): Observable<any> {
     return this.http.post(
       Global.addClientByUser,
       paramData
     );
   }

  // Get all client
  getClientsList(): Observable<any> {
    return this.http.get(Global.getClientsList);
  }

  // Update client
  updateClient(client: any): Observable<any> {
    return this.http.put(Global.updateClient + '/' + client.cltId, client); // pass client id as route param
  } 

  // Delete clients
  deleteClient(cltId:any): Observable<any> {
    return this.http.delete(Global.deleteClient + '/' + cltId); // pass client id as route param
  }

  // get client detail
  getClientDetail(paramData: any): Observable<any> {
    return this.http.post(
      Global.getClientDetail,
      paramData
    );
  }

// ------------- image crud api call --------------------
  uploadImage(file: File, id: any): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(Global.upload + '/' + id, formData);
  }

  updateImage(file: File, id: any): Observable<any>  {
    const formData = new FormData();
    formData.append("image", file);
    return this.http.put(Global.updateImage + '/' + id, formData);
  }

  deleteImage(id: any): Observable<any>  {
    return this.http.delete(Global.deleteImage + '/' + id);
  }

// ------------- file crud api call --------------------
  uploadFile(file: File, id: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(Global.uploadFile + '/' + id, formData);
  }

  updateFile(file: File, id: any): Observable<any>  {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.put(Global.updateFile + '/' + id, formData);
  }

  deleteFile(id: any): Observable<any>  {
    return this.http.delete(Global.deleteFile + '/' + id);
  }


}

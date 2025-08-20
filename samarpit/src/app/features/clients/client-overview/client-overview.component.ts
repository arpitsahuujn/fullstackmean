import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EndUserService } from '../../../core/services/end-user.service';

@Component({
  selector: 'app-client-overview',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './client-overview.component.html',
  styleUrl: './client-overview.component.scss'
})
export class ClientOverviewComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public endUserService = inject(EndUserService);

  public selectedFile!: File;
  public cltId :any;
  public clientDetail:any

  constructor() {
  }

  ngOnInit() {
    this.cltId = this.route.snapshot.paramMap.get('id');
    this.getClientDetail()
  }

  getClientDetail(){
    this.endUserService.getClientDetail({cltId:this.cltId}).subscribe(res => {
      console.log(res)
      this.clientDetail = res
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
// -----------------------------image
  upload() {
    if (!this.selectedFile) return;
    this.endUserService.uploadImage(this.selectedFile,this.cltId).subscribe(res => {
      console.log(res)
      this.clientDetail.image1Url = res.imageUrl;
      this.clientDetail.image1publicId = res.publicId;
    });
  }

  download(publicId: string) {
    console.log(publicId)
  }

  updateImg() {
  if (!this.selectedFile) return;
  this.endUserService.updateImage(this.selectedFile, this.cltId).subscribe(res => {
      console.log(res);
  this.clientDetail.image1Url = res.imageUrl;
      this.clientDetail.image1publicId = res.publicId;
    });
}

deleteImage() {
  this.endUserService.deleteImage(this.cltId).subscribe(res => {
      this.clientDetail.image1Url = res.imageUrl;
      this.clientDetail.image1publicId = res.publicId;
    });
}
// -----------------------------file
  onUploadfile() {
    if (this.selectedFile) {
      this.endUserService.uploadFile(this.selectedFile, this.cltId).subscribe((res: any) => {
        console.log(res)
        this.clientDetail.uploadedFileUrl = res.fileUrl;
        this.clientDetail.uploadedFilePublicId = res.publicId;
      });
    }
  }

   downloadFile(publicId: string) {
    console.log(publicId)
  }

  updateFile() {
    if (!this.selectedFile) return;
    this.endUserService.updateFile(this.selectedFile, this.cltId).subscribe(res => {
        this.clientDetail.uploadedFileUrl = res.fileUrl;
        this.clientDetail.uploadedFilePublicId = res.publicId;
    });
  }

  deleteFile(){
    this.endUserService.deleteFile(this.cltId).subscribe(res => {
        this.clientDetail.uploadedFileUrl = res.fileUrl;
        this.clientDetail.uploadedFilePublicId = res.publicId;
    });
  }
//-----------------------------------------------------

  goBack() {
    this.router.navigate(['clients']);
  }

}

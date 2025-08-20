import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-edit-user',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent {
  userForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<AddEditUserComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      usrnm: ['', Validators.required],
      name: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(3)]],
      cpass: ['', Validators.required],
      email: ['', [Validators.required]],
      location: ['', Validators.required]
    }, {
      validators: this.matchPasswords
    });

    if(this.data.formType == 'edit' && this.data.from == 'users'){
      this.setUserData()
    }

  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('pass')?.value;
    const confirm = group.get('cpass')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  setUserData(){
    this.userForm.setValue({
      usrnm: this.data.userData.usrnm,
      name: this.data.userData.name,
      pass: this.data.userData.pass,
      cpass: '',
      email: this.data.userData.email,
      location: this.data.userData.location
    })
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close(); // passes -> undefined
  }

}

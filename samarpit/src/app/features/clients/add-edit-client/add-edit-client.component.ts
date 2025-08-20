import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-client',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './add-edit-client.component.html',
  styleUrl: './add-edit-client.component.scss'
})
export class AddEditClientComponent {

  clientForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<AddEditClientComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.clientForm = this.fb.group({
      usrnm: ['', Validators.required],
      name: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(3)]],
      cpass: ['', Validators.required],
      email: ['', [Validators.required]],
      location: ['', Validators.required]
    }, {
      validators: this.matchPasswords
    });

    if(this.data.formType == 'edit' && this.data.from == 'clients'){
      this.setClientData()
    }

  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('pass')?.value;
    const confirm = group.get('cpass')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  setClientData(){
    this.clientForm.setValue({
      usrnm: this.data.clientData.usrnm,
      name: this.data.clientData.name,
      pass: this.data.clientData.pass,
      cpass: '',
      email: this.data.clientData.email,
      location: this.data.clientData.location
    })
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.dialogRef.close(this.clientForm.value);
    } else {
      this.clientForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close(); // passes -> undefined
  }

}

import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css'],
})
export class CreateDialogComponent implements OnInit {
  id = 'createModal';

  createForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    description: ['', Validators.required],
  });

  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {}

  // convenience getter for easy access to form fields
  get f() {
    return this.createForm.controls;
  }

  resetForm() {
    this.createForm.reset({ firstName: '', lastName: '', description: '' });
    this.submitted = false;
    this.loading = false;
    this.error = '';
  }

  closeModal() {
    document.getElementById(`${this.id}CloseBtn`)?.click();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    this.loading = true;
    this.employeeService
      .addEmployee({
        firstName: this.f.firstName.value!,
        lastName: this.f.lastName.value!,
        description: this.f.description.value!,
      })
      .pipe(first())
      .subscribe({
        next: (val) => {
          this.resetForm();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
          this.loading = false;
        },
      });
  }
}

import {
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Employee, EmployeeResource } from '../models/employee';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.css'],
})
export class UpdateDialogComponent implements OnInit {
  @Input() employeeResponse!: HttpResponse<EmployeeResource>;

  updateForm = this.fb.group({
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

  ngOnInit(): void {
    this.updateForm.reset(this.employee);
  }

  get employee() {
    return this.employeeResponse.body!;
  }

  get id() {
    const url = this.employee._links.self.href;
    return 'Update' + url.substring(url.lastIndexOf('/'));
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.updateForm.controls;
  }

  resetForm(defaultValues: Employee) {
    this.updateForm.reset({
      firstName: defaultValues.firstName,
      lastName: defaultValues.lastName,
      description: defaultValues.description,
    });
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
    if (this.updateForm.invalid) {
      return;
    }

    this.loading = true;
    this.employeeService
      .updateEmployee(this.employeeResponse, {
        firstName: this.f.firstName.value!,
        lastName: this.f.lastName.value!,
        description: this.f.description.value!,
      })
      .pipe(first())
      .subscribe({
        next: (val) => {
          this.resetForm(val);
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case HttpStatusCode.PreconditionFailed:
              this.error = `DENIED: Unable to update ${this.employee._links.self.href} - Your copy is stale.`;
              break;
            case HttpStatusCode.NotFound:
              this.error = `NOT FOUND: ${this.employee._links.self.href} no longer exists.`;
              break;
            case HttpStatusCode.Forbidden:
              this.error = `ACCESS DENIED: You are not authorized to update ${this.employee._links.self.href}`;
              break;
            default:
              this.error = err.message;
              break;
          }
          this.loading = false;
        },
      });
  }
}

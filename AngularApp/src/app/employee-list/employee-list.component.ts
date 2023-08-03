import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  EmployeeResource,
  XSpringDataCompactJsonLink,
} from '../models/employee';
import { AuthenticationService } from '../services/authentication.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  @Input()
  employeeResponses!: HttpResponse<EmployeeResource>[];

  @Input() navLinks!: XSpringDataCompactJsonLink[];
  @Output() onNavigate = new EventEmitter<string>();

  @Input() pageSize!: number;
  @Output() pageSizeChange = new EventEmitter<number>();

  pageForm = this.fb.group({
    pageSize: [2, [Validators.required, Validators.min(1)]],
  });
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.resetForm(this.pageSize);
  }

  getId(employeeResponse: HttpResponse<EmployeeResource>) {
    const url = employeeResponse.body!._links.self.href;
    return url.substring(url.lastIndexOf('/') + 1);
  }

  isManagerCorrect(employeeResponse: HttpResponse<EmployeeResource>) {
    const name = employeeResponse.body!.manager.name;
    return name === this.auth.getTokenSubject;
  }

  getNavLink(rel: 'first' | 'prev' | 'next' | 'last') {
    return this.navLinks.filter((link) => link.rel === rel).pop()?.href;
  }

  handleNavLink(rel: 'first' | 'prev' | 'next' | 'last') {
    const href = this.navLinks.filter((link) => link.rel === rel).pop()?.href;
    if (href) {
      this.onNavigate.emit(href);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.pageForm.controls;
  }

  resetForm(pageSize: number) {
    this.pageForm.reset({ pageSize: pageSize });
    this.loading = false;
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.pageForm.invalid) {
      return;
    }

    this.loading = true;
    const value = this.f.pageSize.value as number;
    this.pageSizeChange.emit(value);
    this.resetForm(value);
  }

  onDelete(employeeUrl: string) {
    this.employeeService.deleteEmployeeByUrl(employeeUrl).subscribe();
  }
}

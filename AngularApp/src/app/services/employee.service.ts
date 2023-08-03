import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Employee,
  EmployeeEmbeddedResource,
  EmployeeResource,
  EmployeeXSpringDataCompactJson,
} from '../models/employee';
import { JsonSchemaDraft04 } from '../models/json-schema/json-schema-draft-04';
import { Pageable } from '../models/page-metadata';

const root = `${environment.apiUrl}/api`;

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private employeeAddedSubject = new Subject<string>();
  public employeeAdded = this.employeeAddedSubject.asObservable();

  private employeeUpdatedSubject = new Subject<string>();
  public employeeUpdated = this.employeeUpdatedSubject.asObservable();

  private employeeDeletedSubject = new Subject<string>();
  public employeeDeleted = this.employeeDeletedSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get getHttpClient() {
    return this.http;
  }

  getJsonSchema() {
    return this.http.get<JsonSchemaDraft04>(`${root}/profile/employees`, {
      headers: { Accept: 'application/schema+json' },
    });
  }

  getEmployeeCollection(pageable: Pageable) {
    return this.http.get<EmployeeEmbeddedResource>(`${root}/employees`, {
      params: pageable,
    });
  }

  getEmployeeCollectionCompactJson(pageable: Pageable) {
    return this.http.get<EmployeeXSpringDataCompactJson>(`${root}/employees`, {
      params: pageable,
      headers: { Accept: 'application/x-spring-data-compact+json' },
    });
  }

  getEmployeeCollectionCompactJsonByUrl(url: string) {
    return this.http.get<EmployeeXSpringDataCompactJson>(url, {
      headers: { Accept: 'application/x-spring-data-compact+json' },
    });
  }

  getEmployeeByUrl(employeeUrl: string) {
    return this.http.get<EmployeeResource>(employeeUrl, {
      observe: 'response',
    });
  }

  addEmployee(newEmployee: Employee) {
    return this.http
      .post<EmployeeResource>(`${root}/employees`, newEmployee)
      .pipe(
        map((response) => {
          this.employeeAddedSubject.next(response._links.self.href);
          return response;
        })
      );
  }

  updateEmployee(
    employee: HttpResponse<EmployeeResource>,
    updatedEmployee: Employee
  ) {
    return this.http
      .patch<EmployeeResource>(
        employee.body!._links.self.href,
        updatedEmployee,
        {
          headers: { 'If-Match': employee.headers.get('Etag')! },
        }
      )
      .pipe(
        map((response) => {
          this.employeeUpdatedSubject.next(response._links.self.href);
          return response;
        })
      );
  }

  deleteEmployeeByUrl(employeeUrl: string) {
    return this.http.delete<EmployeeResource>(employeeUrl).pipe(
      map((response) => {
        this.employeeDeletedSubject.next(response._links.self.href);
        return response;
      })
    );
  }
}

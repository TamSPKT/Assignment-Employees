import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, mergeMap } from 'rxjs';
import {
  EmployeeResource,
  EmployeeXSpringDataCompactJson,
} from '../models/employee';
import { HalLink } from '../models/hal-types/hal';
import { JsonSchemaDraft04 } from '../models/json-schema/json-schema-draft-04';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'SpringBoot-Jwt-RestRepositories-JPA-H2';
  loading = false;

  pageSize: number;
  employeeCompact?: EmployeeXSpringDataCompactJson;
  employeeResponses!: HttpResponse<EmployeeResource>[];
  schema?: JsonSchemaDraft04;

  employeeAddedSubscription = this.employeeService.employeeAdded.subscribe(
    (url) => this.onCreate(url)
  );
  employeeUpdatedSubscription = this.employeeService.employeeUpdated.subscribe(
    (url) => this.onUpdate(url)
  );
  employeeDeletedSubscription = this.employeeService.employeeDeleted.subscribe(
    (url) => this.onDelete(url)
  );

  constructor(private employeeService: EmployeeService) {
    this.pageSize = 2;
  }

  ngOnInit() {
    this.loading = true;
    this.loadFromServer(this.pageSize);
  }

  ngOnDestroy(): void {
    // prevent memory leak when component is destroyed
    this.employeeAddedSubscription.unsubscribe();
    this.employeeUpdatedSubscription.unsubscribe();
    this.employeeDeletedSubscription.unsubscribe();
  }

  get employeeLinks() {
    // return this.employeeCollection?._embedded.employees ?? [];
    return (
      this.employeeCompact?.links
        .filter((link) => link.rel === 'employee')
        .map(
          (link) =>
            <HalLink>{
              href: link.href,
              name: link.rel,
            }
        ) ?? []
    );
  }

  get navLinks() {
    return (
      this.employeeCompact?.links.filter(
        (link) =>
          link.rel === 'first' ||
          link.rel === 'last' ||
          link.rel === 'next' ||
          link.rel === 'prev'
      ) ?? []
    );
  }

  loadFromServer(pageSize: number) {
    this.employeeService
      .getEmployeeCollectionCompactJson({ size: pageSize })
      .pipe(
        mergeMap((compact) => {
          this.employeeCompact = compact;
          return forkJoin(
            compact.links
              .filter((link) => link.rel === 'employee')
              .map((link) => this.employeeService.getEmployeeByUrl(link.href))
          );
        })
      )
      .subscribe((responses) => {
        this.employeeResponses = responses;
      });
  }

  onCreate(newEmployeeUrl: string) {
    this.employeeService
      .getEmployeeCollectionCompactJson({ size: this.pageSize })
      .subscribe((employeeCompact) => {
        // Navigate to last page
        const lastHref = employeeCompact.links
          .filter((link) => link.rel === 'last')
          .map((link) => link.href)
          .pop();
        if (lastHref) {
          // this.onNavigate(employeeCollection._links.last.href);
          this.onNavigate(lastHref);
        } else {
          const selfHref = employeeCompact.links
            .filter((link) => link.rel === 'self')
            .map((link) => link.href)
            .pop();
          // this.onNavigate(employeeCollection._links.self.href);
          this.onNavigate(selfHref!);
        }
      });
  }

  onUpdate(updatedEmployeeUrl: string) {
    this.loadFromServer(this.pageSize);
  }

  onDelete(deletedEmployeeUrl: string) {
    this.loadFromServer(this.pageSize);
  }

  onNavigate(navUri: string) {
    this.employeeService
      .getEmployeeCollectionCompactJsonByUrl(navUri)
      .pipe(
        mergeMap((compact) => {
          this.employeeCompact = compact;
          return forkJoin(
            compact.links
              .filter((link) => link.rel === 'employee')
              .map((link) => this.employeeService.getEmployeeByUrl(link.href))
          );
        })
      )
      .subscribe((responses) => {
        this.employeeResponses = responses;
      });
  }

  updatePageSize(pageSize: number) {
    if (pageSize !== this.pageSize) {
      this.pageSize = pageSize;
      this.loadFromServer(pageSize);
    }
  }
}

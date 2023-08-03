import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SpringBoot-Jwt-RestRepositories-JPA-H2';
  token!: string | null;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.token.subscribe((x) => (this.token = x));
  }

  logout() {
    this.authenticationService.logout();
  }
}

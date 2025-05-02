import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationService } from '../service/user-information.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  standalone: false,
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  // 1) Define a user object to bind to the form
  user = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  };

  constructor(
    private userInformationService: UserInformationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
    this.getUserInfo(email);
  }

  onSubmit(): void {
    // call the updateUserInfo service
    this.userInformationService
      .updateUserInfo({
        email: this.user.email,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone_number: this.user.phone_number,
      })
      .subscribe({
        next: (res) => {
          console.log('Profile updated:', res.message);
          // Optionally show a toast or some UI feedback here
        },
        error: (err) => {
          console.error('Update failed:', err);
          // Optionally show an error message to the user
        },
      });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.userInformationService.logout();
    this.router.navigate(['/login']);
  }

  private getUserInfo(email: string): void {
    this.userInformationService.getUserInfo(email).subscribe({
      next: (response: any) => {
        // 2) Patch the user object → fields will update in the form
        this.user = response;
      },
      error: (error: any) => {
        console.error('Error fetching user info:', error);
      },
    });
  }
}

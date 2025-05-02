import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInformationService } from '../../service/user-information.service';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'], // Correct!
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userInformationService: UserInformationService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone_number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    console.log('Form submitted:', this.signupForm.value);

    if (
      this.signupForm.value.password !== this.signupForm.value.confirmPassword
    ) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare payload without confirmPassword
    const payload = { ...this.signupForm.value };
    delete payload.confirmPassword;

    this.userInformationService.registerUser(payload).subscribe({
      next: (val: any) => {
        console.log('Registration successful', val);
        this.signupForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Registration failed', err);
      },
    });
  }
}

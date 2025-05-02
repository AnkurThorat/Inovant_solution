import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  // …any other fields your back end returns
}

@Injectable({
  providedIn: 'root',
})
export class UserInformationService {
  private readonly baseUrl = 'http://localhost:3000/auth/getInformation';

  // internal state
  private userSubject = new BehaviorSubject<User | null>(null);

  // publicly exposed streams
  user$: Observable<User | null> = this.userSubject.asObservable();

  isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map((u: User | null) => !!u)
  );

  constructor(private http: HttpClient) {}

  loginUser(credentials: {
    username: string;
    password: string;
  }): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/loginUser`, credentials)
      .pipe(tap((user: User) => this.userSubject.next(user)));
  }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/createUser`, data);
  }

  logout(): void {
    // clear local state (and optionally inform the server or clear tokens)
    this.userSubject.next(null);
  }

  getUserInfo(email: string): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/getUserInfo`, { email })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  /**
   * Update the current user’s profile.
   * Returns success message, and updates local userSubject.
   */
  updateUserInfo(profile: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.http
      .put<{ success: boolean; message: string }>(
        `${this.baseUrl}/updateUserProfile`,
        profile
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            // reflect changes locally
            const current = this.userSubject.value;
            if (current && current.email === profile.email) {
              this.userSubject.next({
                ...current,
                ...profile,
              });
            }
          }
        })
      );
  }
}

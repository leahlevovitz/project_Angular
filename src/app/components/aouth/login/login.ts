import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // חייב ReactiveFormsModule עבור FormGroup
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  // הוספנו ReactiveFormsModule במקום FormsModule כדי לעבוד עם FormGroup
  imports: [CommonModule, CardModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  // הגדרות שירותים
  private userService = inject(UserService);
  private router = inject(Router);

  loginForm!: FormGroup; // שינינו את השם ל-loginForm כדי שיהיה ברור יותר

  ngOnInit() {
    // יצירת הטופס עם ולידציה
    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // שליחת הערכים של הטופס (this.loginForm.value) לשרת
      this.userService.login(this.loginForm.value).subscribe({
        next: (res) => {
          // המידע (טוקן ותפקיד) נשמר ב-Service דרך ה-pipe(tap)
          const role = this.userService.getRole();
          console.log('User role detected:', role);

          // ניתוב לפי תפקיד המשתמש
          if (role === 'admin') {
            this.router.navigate(['/gifts']);
          } else {
            this.router.navigate(['/gifts']);
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          alert('שם משתמש או סיסמה שגויים');
        }
      });
    } else {
      alert('נא למלא את כל השדות בצורה תקינה');
    }
  }
}
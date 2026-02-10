import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

// ייבוא הרכיבים של PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../service/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'] // וודא שהקובץ קיים או השאר []
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  private userService = inject(UserService);
  private router = inject(Router);
  ngOnInit() {
    this.registerForm = new FormGroup({
      FullName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      PasswordHash: new FormControl('', [Validators.required, Validators.minLength(6)]),
      adress: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // שליחת הנתונים מהטופס לשרת
      this.userService.register(this.registerForm.value).subscribe({
        next: (response) => {
          alert('נרשמת בהצלחה!');
          this.router.navigate(['/login']); // או נתיב אחר שתבחר
        },
        error: (err) => {
          // טיפול בשגיאות מהשרת
          this.handleError(err);
        }
      });
    }

  }
  // פונקציה מסודרת להצגת שגיאות
  private handleError(error: any) {
    if (error.status === 400) {
      alert('נתונים לא תקינים, בדוק שוב את הפרטים.');
    } else if (error.status === 409) {
      alert('שם המשתמש או האימייל כבר קיימים במערכת.');
    } else {
      alert('אירעה שגיאה בשרת, נסה שוב מאוחר יותר.');
    }
    console.error('Server Error:', error);
  }
} // סוגר את ה-Class
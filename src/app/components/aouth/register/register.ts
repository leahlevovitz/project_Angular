import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../service/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  private userService = inject(UserService);
  public router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.registerForm = new FormGroup({
      FullName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
      ]), PasswordHash: new FormControl('', [Validators.required, Validators.minLength(6)]),
      adress: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Cא-ת\\s]+$")
      ]),

      phone: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]{9,10}$")
      ])
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'שגיאה',
        detail: 'נא למלא את כל השדות בצורה תקינה'
      });
      return;
    }
    this.userService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        const message = typeof res === 'string' ? res : res.message || 'נרשמת בהצלחה!';
        this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: message });
        setTimeout(() => this.router.navigate(['/login']), 700);
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(error: any) {
    if (error.status === 400) {
      this.messageService.add({
        severity: 'warn',
        summary: 'שגיאה',
        detail: 'נתונים לא תקינים, בדוק שוב את הפרטים.'
      });
    } else if (error.status === 409) {
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'שם המשתמש או האימייל כבר קיימים במערכת.'
      });
    } else if (error.status === 500) {
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה בשרת',
        detail: 'שם המשתמש כבר קיים או קרתה שגיאה פנימית.'
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'אירעה שגיאה בשרת, נסה שוב מאוחר יותר.'
      });
    }
    console.error('Server Error:', error);
  }

}
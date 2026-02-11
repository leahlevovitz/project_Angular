import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// שירות משתמשים
import { UserService } from '../../../service/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe({
        next: () => {
          const role = this.userService.getRole();
          this.messageService.add({severity:'success', summary:'התחברות', detail:'התחברת בהצלחה!'});
          // ניתוב לפי תפקיד
          if (role === 'manager') {
            this.router.navigate(['/gifts']);
          } else {
            this.router.navigate(['/gifts']);
          }
        },
        error: () => {
          this.messageService.add({severity:'error', summary:'שגיאה', detail:'שם משתמש או סיסמה שגויים'});
        }
      });
    } else {
      this.messageService.add({severity:'warn', summary:'שגיאה', detail:'נא למלא את כל השדות בצורה תקינה'});
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

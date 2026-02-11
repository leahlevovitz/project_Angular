import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AdminNavbar } from './components/admin-navbar/admin-navbar'; // ← ודא שהנתיב נכון!
// import { GiftList } from './components/gift-list/gift-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, MenubarModule, AdminNavbar],
  template: `
    <admin-navbar></admin-navbar>
    <router-outlet></router-outlet>
    <p-toast></p-toast>
  `,
  styleUrls: ['./app.scss'],
  providers: [MessageService] // הוספת AdminNavbar לספקים
})
export class App {
  protected readonly title = signal('project');
}

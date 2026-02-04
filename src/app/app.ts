import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { GiftList } from './components/gift-list/gift-list';
import { ToastModule } from 'primeng/toast'; // 1. ייבוא המודול
import { MessageService } from 'primeng/api'; // 2. ייבוא השירות
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService]
})
export class App {
  protected readonly title = signal('project');
}

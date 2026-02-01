import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { GiftList } from './components/gift-list/gift-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('project');
}

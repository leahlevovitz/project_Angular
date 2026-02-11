import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { UserService } from '../../service/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
  <nav class="navbar">
    <!-- צד שמאל: ניווט -->
    <div class="nav-section nav-left">
      <button *ngFor="let item of leftMenu" (click)="navigate(item)" class="nav-btn">
        {{item.label}}
      </button>
    </div>

    <!-- אמצע: לוגו -->
    <div class="nav-section nav-center">

    </div>

    <!-- צד ימין: התחברות/יציאה -->
    <div class="nav-section nav-right">
      <button *ngFor="let item of rightMenu" (click)="navigate(item)" class="nav-btn">
        {{item.label}}
      </button>
    </div>
  </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
background: linear-gradient(135deg, #ff9a9e, #fbc2eb, #a1c4fd, #c2e9fb, #f6d365, #ff9a9e);
      padding: 10px 30px;
      color: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .nav-left { flex: 1; }
    .nav-center { flex: 0 0 auto; display: flex; align-items: center; gap: 10px; }
    .nav-right { flex: 1; justify-content: flex-end; display: flex; }

    .logo-circle {
      font-size: 2rem;
      background: #007bff;
      border-radius: 50%;
      width: 55px; height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(29, 98, 124, 0.13);
    }

    .brand-text { color: #fff; display: flex; flex-direction: column; }
    .main-title { font-weight: 900; font-size: 1.3rem; }
    .sub-title { font-size: 0.85rem; color: #5c9f6455; }

    .nav-btn {
      background: #74527e6d;
      border: none;
      padding: 8px 20px;
      border-radius: 25px;
      color: #000;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .nav-btn:hover {
      background: #c7c3b4;
      transform: scale(1.05);
    }
  `]
})
export class AdminNavbar implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  leftMenu: any[] = [];
  rightMenu: any[] = [];

  ngOnInit() {
    this.buildMenu();

    const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.buildMenu());
    this.subscription.add(routerSub);
  }

  buildMenu() {
    const role = this.userService.getRole();

    // צד שמאל
    this.leftMenu = [];
    if (role === 'manager') {
      this.leftMenu = [
        { label: 'מתנות', link: '/gifts' },
        { label: 'תורמים', link: '/donors' },
        { label: 'רוכשים', link: '/purchaser' }
      ];
    } else if (role === 'client') {
      this.leftMenu = [
        { label: 'מתנות', link: '/gifts' },
        { label: 'סל קניות', link: '/cart' }
      ];
    }

    // צד ימין
    this.rightMenu = [];
    if (role) {
      this.rightMenu = [
        { label: 'יציאה', action: () => this.onLogout() }
      ];
    } else {
      this.rightMenu = [
        { label: 'התחברות', link: '/login' }
      ];
    }
  }

  navigate(item: any) {
    if (item.link) this.router.navigate([item.link]);
    if (item.action) item.action();
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['']).then(() => this.buildMenu());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

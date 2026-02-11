import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../service/user-service';
import { Router, NavigationEnd } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'admin-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
template: `
  <div class="navbar-wrapper">
    <div class="navbar-container shadow-4">
      <div class="app-brand">
        <div class="logo-circle">🎁</div>
        <div class="brand-text">
          <span class="main-title">LUCKY CHINESE</span>
          <span class="sub-title">הזדמנות של פעם בחיים</span>
        </div>
      </div>
      <p-menubar [model]="menuItems" class="custom-menu"></p-menubar>
    </div>
  </div>
`,
styles: [`
  .navbar-wrapper {
    padding: 15px 20px;
    background: rgba(0,0,0,0.2);
  }
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(15px);
    border-radius: 50px; /* צורה מעוגלת ועדכנית */
    padding: 5px 25px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .logo-circle {
    font-size: 2rem;
    background: #fff;
    border-radius: 50%;
    width: 45px; height: 45px;
    display: flex; align-items: center; justify-content: center;
  }
  .brand-text { display: flex; flex-direction: column; margin-right: 15px; }
  .main-title { font-weight: 900; color: #fff; letter-spacing: 1px; }
  .sub-title { font-size: 0.7rem; color: #b8860b; }
`]
})
export class AdminNavbar implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();

  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    // 1. עדכון ראשוני
    this.rebuildMenu();

    // 2. האזנה לשינויי ניווט כדי למנוע את היעלמות התפריט
    const routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.rebuildMenu();
    });

    this.subscription.add(routerSub);
  }

  rebuildMenu(): void {
    const role = this.userService.getRole();

    // ניקוי מוחלט לפני בנייה - מונע את הכפילות שראית בתמונה
    const items: MenuItem[] = [];

    if (role === 'manager') {
      items.push(
        { label: 'מתנות', icon: 'pi pi-gift', routerLink: '/gifts' },
        { label: 'תורמים', icon: 'pi pi-users', routerLink: '/donors' },
        { label: 'רוכשים', icon: 'pi pi-shopping-cart', routerLink: '/purchaser' },
        { label: 'דוחות', icon: 'pi pi-file', routerLink: '/reportComp' },
      );
    } else if (role === 'client') {
      items.push(
        { label: 'מתנות', icon: 'pi pi-gift', routerLink: '/gifts' },
        { label: 'סל קניות', icon: 'pi pi-shopping-cart', routerLink: '/cart' }
      );
    }

    // כפתור מערכת
    if (role) {
      items.push({
        label: 'יציאה',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      });
    } else {
      items.push({
        label: 'התחברות',
        icon: 'pi pi-sign-in',
        routerLink: '/login'
      });
    }

    // עדכון המשתנה הראשי במכה אחת
    this.menuItems = items;
  }

  onLogout(): void {
    this.userService.logout();
    this.router.navigate(['']).then(() => {
      this.rebuildMenu();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
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
    <div class="navbar-container" style="width: 100%;">
      <p-menubar *ngIf="menuItems.length > 0" [model]="menuItems"></p-menubar>
    </div>
  `
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
        { label: 'הגרלה', icon: 'pi pi-star', routerLink: '/lottery' }
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
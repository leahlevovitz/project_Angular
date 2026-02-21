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
  <!-- מרכז: תפריטים -->
  <div class="nav-section nav-center">
    <button 
      *ngFor="let item of leftMenu" 
      (click)="navigate(item)" 
      class="nav-btn"
      routerLinkActive="active">
      {{item.label}}
    </button>
  </div>

  <!-- ימין: לוגו -->
  <div class="nav-section nav-right-logo">
    <img src="logo.png" class="logo" alt="logo"/>
  </div>

  <!-- ימין נוסף: כפתורים -->
  <div class="nav-section nav-right">
    <button 
      *ngFor="let item of rightMenu" 
      (click)="navigate(item)" 
      class="nav-btn primary">
      {{item.label}}
    </button>
  </div>
</nav>
  `,
  styles: [`
/* Navbar בסיסי עם מראה מלכותי */
.navbar {
  direction: rtl;
  position: sticky;
  top: 0;
  z-index: 1000;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 40px;
  height: 80px;

  /* רקע כהה מלכותי עם gradient עדין */
  background: linear-gradient(90deg, #1a1f4b, #2c2f6b, #d5d6ee);
  color: white;
  border-bottom: 1px solid rgba(255,255,255,0.2);

  font-family: 'Heebo', sans-serif;
}

/* אזורים */
.nav-section {
  display: flex;
  align-items: center;
  gap: 28px;
}

/* תפריטים במרכז */
.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

/* לוגו בצד ימין */
.nav-right-logo {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  height: 90px;
  width: 110px;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.7)) 
          drop-shadow(0 0 20px rgba(0, 150, 255,0.5));
}

.logo:hover {
  transform: scale(1.08);
  filter: drop-shadow(0 0 15px rgba(255,255,255,0.8))
          drop-shadow(0 0 25px rgba(0, 150, 255,0.6));
}

/* כפתורים */
.nav-btn {
  position: relative;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  text-shadow: 0 0 2px rgba(0,0,0,0.4);
}

/* קו תחתון אנימטיבי */
.nav-btn::after {
  content: "";
  position: absolute;
  bottom: -6px;
  right: 0;
  width: 0%;
  height: 2px;
  background: #ffd700; /* זהב מלכותי */
  transition: width 0.3s ease;
}

.nav-btn:hover {
  color: #ffd700;
  text-shadow: 0 0 5px #ffd700;
}

.nav-btn:hover::after {
  width: 100%;
}

.nav-btn.active::after {
  width: 100%;
}

/* כפתור ימני מודגש */
.primary {
  padding: 8px 18px;
  border-radius: 50px;
  border: 1px solid #ffd700;
  transition: all 0.3s ease;
}

.primary:hover {
  background: #ffd700;
  color: #1a1f4b;
  box-shadow: 0 0 10px rgba(255,215,0,0.7);
}

/* רספונסיבי */
@media (max-width: 900px) {
  .navbar {
    padding: 0 20px;
  }

  .nav-section {
    gap: 16px;
  }

  .logo {
    height: 60px;
    width: 80px;
  }
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

    // צד שמאל - תפריטים
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
        { label: 'הכרטיסים שנבחרו ', link: '/cart' }
      ];
    }

    // צד ימין - כפתורים התחברות/יציאה
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

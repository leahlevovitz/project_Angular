# 🎁 Chinese Auction: Angular Client

> The front end of an online **Chinese auction (raffle)** platform: buyers browse gifts and buy tickets; admins manage gifts, donors, purchasers and run the lottery.

![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20-2DD4BF)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)

## ✨ Features
**For buyers**
- 🎁 Gift catalog with images and details
- 🛒 Shopping basket for raffle tickets
- 🔐 Registration and login

**For admins**
- ➕ Add, edit and delete gifts
- 🤝 Manage donors
- 👥 View purchasers per gift
- 🎰 Run the lottery and see the winners
- 💰 Total revenue report

## 🏗️ Structure
```
src/app/
├── components/     # gift-list, basket, donors, purchasers, add-gift, admin-navbar, auth/login & register
├── service/        # auth, gift, donor, lottery, purchasers, user (HTTP services)
├── models/         # Gift, Donor, Lottery, Purchasers, User, TotalRevenueDTO
└── app.routes.ts   # client-side routing
```
- **Standalone components** and Angular Router
- **Service layer** separating HTTP logic from the UI
- **Typed models** shared across the app
- **PrimeNG** components for tables, dialogs and forms

## 🔌 Back end
Works against a REST API for gifts, donors, purchases and the lottery.
The same domain is also implemented as a full microservices system: **[doker_project_AI](https://github.com/leahlevovitz/doker_project_AI)**.

## 🚀 Run locally
```bash
npm install
ng serve
```
Open **http://localhost:4200**.

---
👩‍💻 Built by **Leah Levovitz** · [LinkedIn](https://www.linkedin.com/in/leahlevovitz) · [GitHub](https://github.com/leahlevovitz)

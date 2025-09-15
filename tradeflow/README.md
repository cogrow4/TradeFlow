# TradeFlow - Professional Trade Business Management Platform

TradeFlow is a comprehensive SaaS platform designed specifically for electrical contractors, plumbers, HVAC technicians, and other trade professionals. It provides both web and mobile applications to manage all aspects of a trade business.

## 🚀 Features

### Core Business Management
- **Customer Relationship Management (CRM)** - Complete customer profiles, job history, and communication tracking
- **Job Management** - Create, schedule, and track jobs with GPS location and time tracking
- **Quoting & Invoicing** - Professional quote generation with PDF export and payment tracking
- **Inventory Management** - Parts and materials tracking with barcode scanning and reorder alerts
- **Scheduling & Calendar** - Interactive calendar with drag-and-drop scheduling
- **Financial Management** - P&L tracking, cash flow management, and expense tracking
- **Reporting & Analytics** - Business performance dashboards and export capabilities
- **Team Management** - Employee profiles, skills tracking, and timesheet management

### Mobile-Specific Features
- **Offline Functionality** - Full offline support with automatic sync when online
- **GPS Tracking** - Location services for job sites and time tracking
- **Camera Integration** - Photo documentation for before/after work
- **Push Notifications** - Real-time job updates and reminders
- **Barcode Scanning** - Inventory management with barcode scanning
- **Biometric Authentication** - Secure login with fingerprint/face recognition

### Technical Features
- **Real-time Updates** - Live data synchronization across all devices
- **Multi-tenant Architecture** - Support for multiple companies and users
- **Role-based Access Control** - Owner, Manager, and Employee roles
- **White-label Customization** - Customizable branding and settings
- **API Integration** - RESTful APIs with real-time capabilities
- **Secure Authentication** - Clerk-powered authentication with MFA

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Vue.js 3 with Composition API
- TypeScript for type safety
- Tailwind CSS for styling
- Pinia for state management

**Mobile:**
- Capacitor for native functionality
- Offline-first architecture
- Native device integrations

**Backend:**
- Convex for database and real-time backend
- Clerk for authentication and user management
- Clerk for subscription billing and payments

**Deployment:**
- Convex hosting for backend
- Web app deployment ready
- Mobile app builds for iOS/Android

### Project Structure

```
tradeflow/
├── website/          # Vue.js web application
├── mobile-app/       # Vue.js + Capacitor mobile application
├── backend/          # Convex backend functions and schema
└── docs/            # Documentation and guides
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Convex account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/tradeflow.git
   cd tradeflow
   ```

2. **Install dependencies**
   ```bash
   # Install website dependencies
   cd website
   npm install
   
   # Install mobile app dependencies
   cd ../mobile-app
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp website/.env.example website/.env
   cp mobile-app/.env.example mobile-app/.env
   ```

4. **Configure Environment Variables**
   
   Update the `.env` files with your credentials:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
   
   # Convex Backend
   VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
   ```

5. **Start Development Servers**
   ```bash
   # Start website (runs on http://localhost:5173)
   cd website
   npm run dev
   
   # Start mobile app (runs on http://localhost:5174)
   cd ../mobile-app
   npm run dev
   
   # Start backend (runs on http://localhost:3000)
   cd ../backend
   npx convex dev
   ```

## 📱 Mobile App Setup

### iOS Development
```bash
cd mobile-app
npm run build
npx cap add ios
npx cap open ios
```

### Android Development
```bash
cd mobile-app
npm run build
npx cap add android
npx cap open android
```

## 🚀 Deployment

### Web Application
```bash
cd website
npm run build
# Deploy dist/ folder to your hosting provider
```

### Mobile Applications
```bash
cd mobile-app
npm run build
npx cap build ios    # For iOS App Store
npx cap build android # For Google Play Store
```

### Backend
```bash
cd backend
npx convex deploy
```

## 📊 Database Schema

The application uses Convex with the following main entities:

- **Users** - Authentication and user profiles
- **Companies** - Organization settings and branding
- **Customers** - Customer information and history
- **Jobs** - Job details, scheduling, and tracking
- **Quotes** - Quote generation and management
- **Invoices** - Invoice creation and payment tracking
- **Inventory** - Parts, materials, and equipment
- **Suppliers** - Supplier information and management
- **Employees** - Team member profiles and timesheets
- **Documents** - File storage and management

## 🔐 Security

- **Authentication** - Clerk-powered with MFA support
- **Authorization** - Role-based access control
- **Data Encryption** - End-to-end encryption for sensitive data
- **GDPR Compliance** - Data protection and privacy controls
- **Secure APIs** - JWT-based authentication for all API calls

## 📈 Performance

- **<3s Load Times** - Optimized for fast initial loading
- **60fps Animations** - Smooth user interface interactions
- **Offline-First** - Full functionality without internet connection
- **Real-time Sync** - Instant updates across all devices
- **99.9% Uptime** - Reliable service availability

## 🧪 Testing

```bash
# Run tests for website
cd website
npm run test

# Run tests for mobile app
cd mobile-app
npm run test

# Run tests for backend
cd backend
npm test
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Mobile App Guide](./docs/mobile.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.tradeflow.com](https://docs.tradeflow.com)
- **Community**: [Discord](https://discord.gg/tradeflow)
- **Email**: support@tradeflow.com
- **Issues**: [GitHub Issues](https://github.com/your-org/tradeflow/issues)

## 🎯 Roadmap

- [ ] Advanced reporting and analytics
- [ ] Integration with accounting software
- [ ] Multi-language support
- [ ] Advanced inventory forecasting
- [ ] Customer portal
- [ ] Advanced scheduling algorithms
- [ ] IoT device integration
- [ ] AI-powered insights

---

**TradeFlow** - Empowering trade professionals with modern business management tools.
# 🏢 Core Staff

> A modern, comprehensive HR management platform built for the digital age

Core Staff is a full-featured human resources management system designed to streamline HR operations, enhance employee experience, and empower organizations to manage their workforce effectively. Built with Next.js and modern web technologies, Core Staff provides an intuitive interface for handling all aspects of human resource management.

## ✨ Features
### 👥 Employee Management

- **Comprehensive Employee Profiles** - Manage detailed employee information, documentation, and records
- **Organizational Hierarchy** - Visualize and manage company structure and reporting relationships
- **Role & Permission Management** - Fine-grained access control for different user roles

### 📅 Time & Attendance

- **Time Tracking** - Easy clock-in/clock-out functionality
- **Leave Management** - Request, approve, and track various types of leave
- **Attendance Reports** - Detailed analytics and reporting on attendance patterns

### 📊 Performance Management

- **Goal Setting & Tracking** - Set objectives and track progress
- **Performance Reviews** - Conduct regular performance evaluations
- **360° Feedback** - Comprehensive feedback from peers, managers, and direct reports

### 📈 Analytics & Reporting

- **HR Dashboards** - Real-time insights into workforce metrics
- **Custom Reports** - Generate detailed reports for informed decision-making
- **Data Export** - Export data in various formats for external analysis

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd core-staff
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework for production
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Database**: TBD - Your choice of database solution
- **Authentication**: TBD - Secure authentication system

## 📁 Project Structure

```
core-staff/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── (dashboard)/         # Dashboard routes (protected)
│   │   │   ├── employees/       # Employee management
│   │   │   ├── attendance/      # Time & attendance
│   │   │   ├── performance/     # Performance reviews
│   │   │   └── reports/         # Analytics & reports
│   │   ├── api/                 # API routes
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Layout components
│   │   ├── employees/           # Employee components
│   │   ├── attendance/          # Attendance components
│   │   └── performance/         # Performance components
│   ├── lib/
│   │   ├── actions/             # Server actions
│   │   ├── hooks/               # Custom React hooks
│   │   ├── validations/         # Zod schemas
│   │   └── utils.ts             # Utility functions
│   ├── types/                   # TypeScript types
│   ├── config/                  # App configuration
│   └── constants/               # Constants & enums
├── public/                      # Static assets
└── components.json              # shadcn/ui config
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌟 Support

If you find this project helpful, please give it a ⭐️!

---

Built with ❤️ for modern HR teams

# Authentication Components

A comprehensive set of modular authentication UI components built with shadcn/ui for the Core Staff platform.

## Components Overview

### 🔐 Core Components

#### AuthCard
Main wrapper component for authentication pages with branding and layout.
- **Props**: title, description, children
- **Features**: Logo display, centered layout, responsive design
- **Location**: `auth-card.tsx`

#### LoginForm
Complete login form with email/password and social authentication.
- **Features**: 
  - Email and password fields
  - Social login (Google, GitHub)
  - Remember me checkbox
  - Forgot password link
  - Sign up redirect
- **Location**: `login-form.tsx`

#### RegisterForm
Registration form for new user account creation.
- **Features**:
  - First and last name fields
  - Work email input
  - Company name field
  - Password and confirmation
  - Terms & conditions acceptance
  - Social registration options
  - Sign in redirect
- **Location**: `register-form.tsx`

#### FormField
Reusable form input field component.
- **Props**: id, label, type, placeholder, required
- **Features**: Label with required indicator, styled input
- **Location**: `form-field.tsx`

#### SocialAuthButton
Button for social authentication providers.
- **Props**: provider, icon
- **Features**: Icon support, consistent styling
- **Location**: `social-auth-button.tsx`

#### AuthSeparator
Visual separator with "Or continue with" text.
- **Features**: Centered text, horizontal line
- **Location**: `auth-separator.tsx`

## Pages

### Login Page
**Route**: `/login`
**File**: `src/app/(auth)/login/page.tsx`

Features:
- Email/password login
- Social authentication (Google, GitHub)
- Remember me option
- Forgot password link
- Sign up redirect

### Register Page
**Route**: `/register`
**File**: `src/app/(auth)/register/page.tsx`

Features:
- User information collection
- Company details
- Password creation
- Terms acceptance
- Social registration
- Sign in redirect

## Usage

```tsx
import { AuthCard, LoginForm } from "@/components/auth";

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account"
    >
      <LoginForm />
    </AuthCard>
  );
}
```

## Styling

All components use:
- **shadcn/ui** for base components (Button, Input, Card, etc.)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Responsive design (mobile-first)
- Gradient background on auth layout
- Dark mode support

## Form Components Used

- ✅ Button
- ✅ Input
- ✅ Label
- ✅ Checkbox
- ✅ Card
- ✅ Separator

## Layout

The auth pages use a route group `(auth)` with:
- Centered card layout
- Gradient background
- Responsive max-width container
- Logo and branding at top
- Social login options
- Form separator
- Links to alternate pages

## Notes

⚠️ **UI Only** - These components are currently for UI presentation only. Authentication logic, validation, and API integration need to be implemented separately.

## Future Enhancements

- Form validation with Zod
- Error handling and display
- Loading states
- Success/error messages
- Password strength indicator
- Email verification flow
- Two-factor authentication UI

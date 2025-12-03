## Role-Based Access Control (RBAC) Implementation Guide

This document outlines the complete role-based access control system implemented in the Revealian app.

---

## ✅ What Has Been Implemented

### 1. **Role Types and Context Extensions** (`src/hooks/useAppContext.ts`)

**Added:**
- `UserRole` type: `"user" | "admin" | "delivery"`
- `userRole` state: Stores current user's role
- `isLoadingUserRole` state: Loading indicator for role fetch
- `fetchUserRole()` function: Fetches role from Firestore `users` collection
- `hasRole()` helper: Checks if user has a specific role or roles
- `canAccessDashboard()` helper: Validates dashboard access

**Usage:**
```typescript
const { userRole, hasRole, canAccessDashboard } = useAppContext();

// Check single role
if (hasRole("admin")) { /* admin stuff */ }

// Check multiple roles
if (hasRole(["admin", "delivery"])) { /* restricted stuff */ }

// Check dashboard access
if (canAccessDashboard("admin")) { /* allow admin dashboard */ }
```

---

### 2. **Firestore Database Setup** (`src/backend/setup.ts`)

**Added:**
- Firestore instance export: `db`
- New collection: `users`

**Users Collection Structure:**
```
/users/{uid}
  ├── email: string
  ├── displayName: string
  ├── photoURL: string
  ├── role: "user" | "admin" | "delivery"
  ├── createdAt: timestamp
  └── status: "active" | "inactive"
```

---

### 3. **Automatic Role Initialization** (`src/backend/authentication.ts`)

**Added:**
- `createUserRoleDocument()` function: Creates user role document in Firestore
- Integration with `firebaseSignUp()`: Creates role doc on email/password signup
- Integration with `firebaseSignIn()`: Verifies/creates role doc on email/password login
- Integration with `googleSignIn()`: Verifies/creates role doc on Google OAuth

**Default Behavior:**
- New users automatically get `role: "user"` on first login
- Existing users keep their assigned role
- User documents include: email, displayName, photoURL, createdAt, status

---

### 4. **RoleGuard Component** (`src/components/RoleGuard.tsx`)

**Purpose:** Reusable component to protect routes and UI elements

**Features:**
- Checks user authentication and role
- Shows loading state while fetching role
- Shows custom fallback content or generic error message
- Prevents unauthorized access with back-to-home button

**Usage:**
```tsx
<RoleGuard requiredRole="admin">
  <AdminDashboard />
</RoleGuard>

// With multiple roles
<RoleGuard requiredRole={["admin", "delivery"]}>
  <RestrictedContent />
</RoleGuard>

// With custom fallback
<RoleGuard 
  requiredRole="admin"
  fallback={<UnauthorizedView />}
>
  <AdminPanel />
</RoleGuard>
```

---

### 5. **Role-Based Menu Visibility** (`src/components/Header.tsx`)

**Updated:**
- Dashboard menu items now conditionally render based on user role
- Only relevant dashboard option displays for each user role

**Menu Behavior:**
- Users with `role: "user"` see: "My Dashboard"
- Users with `role: "admin"` see: "Admin Panel"
- Users with `role: "delivery"` see: "Delivery Dashboard"

---

### 6. **Dashboard Route Protection**

**Protected Pages:**
- `UserDashboard.tsx` → Requires `role: "user"`
- `AdminDashboard.tsx` → Requires `role: "admin"`
- `DeliveryDashboard.tsx` → Requires `role: "delivery"`

**Protection Method:**
- Wrapped entire component with `<RoleGuard requiredRole="role">`
- Unauthorized users see "Access Denied" message and back-to-home button

---

## 🔐 How It Works

### User Login Flow:

```
1. User logs in (email/password, Google, etc.)
   ↓
2. Firebase Auth creates/verifies user account
   ↓
3. createUserRoleDocument() is called with user object
   ↓
4. Function checks if /users/{uid} exists in Firestore
   ↓
5a. If NOT exists → Create new doc with role: "user"
5b. If exists → Keep existing role
   ↓
6. useAppContext fetches role from Firestore
   ↓
7. Role is stored in state and available to all components
   ↓
8. Menu items and dashboards render conditionally based on role
```

### Dashboard Access Flow:

```
1. User navigates to /user-dashboard
   ↓
2. RoleGuard component checks user role
   ↓
3a. If role is "user" → Render dashboard content
3b. If role is NOT "user" → Show "Access Denied" page
   ↓
4. Direct URL access is prevented by RoleGuard
```

---

## 📋 Role Hierarchy

Current role structure:

| Role | Default | Can Access | Cannot Access |
|------|---------|------------|---------------|
| **user** | Yes | User Dashboard, Browse, Orders | Admin Panel, Delivery Dashboard |
| **admin** | No | Admin Dashboard, Admin Panel | - (full system access) |
| **delivery** | No | Delivery Dashboard | Admin Panel, User Dashboard |

---

## ⚙️ Assigning Roles to Users

Currently, role assignment is manual via Firestore. To change a user's role:

### Via Firestore Console:

1. Navigate to `users` collection
2. Find the user document by their UID
3. Change the `role` field value:
   - `"user"` → Standard user
   - `"admin"` → Administrator
   - `"delivery"` → Delivery personnel

4. On next login, user will see their new dashboard

### Programmatically:

```typescript
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./backend/setup";

async function promoteUserToAdmin(uid: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { role: "admin" });
}
```

---

## 🎯 Testing Role-Based Access

### Test Scenarios:

1. **User Role:**
   - Login with user account
   - Verify "My Dashboard" appears in menu
   - Verify "Admin Panel" and "Delivery Dashboard" NOT in menu
   - Verify can access `/user-dashboard`
   - Try accessing `/admin-dashboard` → Should see "Access Denied"

2. **Admin Role:**
   - Update user's role to "admin" in Firestore
   - Login or refresh
   - Verify "Admin Panel" appears in menu
   - Verify "My Dashboard" and "Delivery Dashboard" NOT in menu
   - Verify can access `/admin-dashboard`

3. **Delivery Role:**
   - Update user's role to "delivery" in Firestore
   - Login or refresh
   - Verify "Delivery Dashboard" appears in menu
   - Verify "Admin Panel" and "My Dashboard" NOT in menu
   - Verify can access `/delivery-dashboard`

---

## 🚀 Future Enhancements

### Recommended Next Steps:

1. **Admin Panel for Role Management**
   - Create UI in Admin Dashboard to manage user roles
   - Allow admins to promote/demote users
   - Add audit logging for role changes

2. **Role-Based Data Access**
   - Firestore security rules to restrict data access by role
   - Example: Delivery users only see their assigned orders

3. **Additional Roles**
   - `"manager"` for store managers
   - `"vendor"` for product vendors
   - Implement role hierarchy

4. **Multi-Role Support**
   - Allow users to have multiple roles
   - Example: User who is also a delivery person
   - Change role switcher in UI

5. **Session Expiry and Role Refresh**
   - Periodically refresh role from Firestore
   - Handle role changes during active session

---

## 📁 Files Modified

| File | Changes |
|------|---------|
| `src/hooks/useAppContext.ts` | Added UserRole type, role state, fetchUserRole(), hasRole(), canAccessDashboard() |
| `src/backend/setup.ts` | Added Firestore db export |
| `src/backend/authentication.ts` | Added createUserRoleDocument(), integrated with all auth methods |
| `src/components/RoleGuard.tsx` | Created new component for route protection |
| `src/components/Header.tsx` | Added conditional rendering for dashboard menu items |
| `src/pages/UserDashboard.tsx` | Wrapped with RoleGuard |
| `src/pages/AdminDashboard.tsx` | Wrapped with RoleGuard |
| `src/pages/DeliveryDashboard.tsx` | Wrapped with RoleGuard |

---

## ✨ Key Features Summary

✅ Automatic role assignment on signup (default: "user")  
✅ Role persistence across sessions (stored in Firestore)  
✅ Conditional menu rendering based on role  
✅ Dashboard access protection with RoleGuard  
✅ Loading states during role fetch  
✅ Unauthorized access prevention with friendly error messages  
✅ Reusable RoleGuard component for future use  
✅ Helper functions for role checking (hasRole, canAccessDashboard)  

---

## 🔗 Related Code Examples

### Check User Role in Any Component:

```typescript
import { useAppContext } from "../hooks/useAppContext";

export function MyComponent() {
  const { userRole, hasRole } = useAppContext();
  
  return (
    <div>
      {hasRole("admin") && <AdminFeature />}
      {hasRole(["admin", "delivery"]) && <SpecialFeature />}
      {userRole === "user" && <UserFeature />}
    </div>
  );
}
```

### Protect a Route:

```typescript
import RoleGuard from "./components/RoleGuard";
import AdminPage from "./pages/AdminPage";

<RoleGuard requiredRole="admin">
  <AdminPage />
</RoleGuard>
```

### Update User Role (Admin Only):

```typescript
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./backend/setup";

async function updateUserRole(uid: string, newRole: string) {
  try {
    await updateDoc(doc(db, "users", uid), { role: newRole });
    console.log(`User role updated to: ${newRole}`);
  } catch (error) {
    console.error("Failed to update role:", error);
  }
}
```

---

**Last Updated:** December 2025  
**Status:** ✅ Fully Implemented and Tested

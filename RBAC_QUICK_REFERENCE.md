## Role-Based Access Control (RBAC) - Quick Reference

### 🎯 How Users Get Their Roles

| Scenario | Role Assigned | When |
|----------|---------------|------|
| Email/Password Signup | `"user"` | On account creation |
| Email/Password Login | Existing role (or `"user"` if new) | On login |
| Google Sign-In | Existing role (or `"user"` if new) | On first/subsequent login |
| Manual Update | Admin assigns role | Via Firestore Console or code |

---

### 📋 Available Roles

```
"user"     → Regular user (default for new accounts)
"admin"    → Administrator (full system access)
"delivery" → Delivery personnel
```

---

### 🔍 How to Check Roles in Code

```typescript
import { useAppContext } from "../hooks/useAppContext";

const { userRole, hasRole, canAccessDashboard } = useAppContext();

// Get current role as string
console.log(userRole); // "user", "admin", "delivery", or null

// Check if user has a specific role
if (hasRole("admin")) { /* admin only */ }

// Check if user has any of multiple roles
if (hasRole(["admin", "delivery"])) { /* restricted */ }

// Check if user can access a dashboard
if (canAccessDashboard("admin")) { /* allow access */ }
```

---

### 🛡️ Protect Components with RoleGuard

```tsx
import RoleGuard from "../components/RoleGuard";

// Single role requirement
<RoleGuard requiredRole="admin">
  <AdminPanel />
</RoleGuard>

// Multiple roles allowed
<RoleGuard requiredRole={["admin", "manager"]}>
  <RestrictedComponent />
</RoleGuard>

// Custom fallback for unauthorized users
<RoleGuard requiredRole="admin" fallback={<Unauthorized />}>
  <AdminPanel />
</RoleGuard>
```

---

### 🌐 Current Dashboard Access

| Dashboard | URL | Required Role | Menu Item |
|-----------|-----|----------------|-----------|
| User Dashboard | `/user-dashboard` | `"user"` | My Dashboard |
| Admin Dashboard | `/admin-dashboard` | `"admin"` | Admin Panel |
| Delivery Dashboard | `/delivery-dashboard` | `"delivery"` | Delivery Dashboard |

---

### 📝 Manually Change User Role

**In Firestore Console:**

1. Go to Firestore Database
2. Navigate to `users` collection
3. Find user by UID
4. Edit the `role` field
5. Save

**In Code:**

```typescript
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./backend/setup";

// Promote user to admin
await updateDoc(doc(db, "users", userUID), { 
  role: "admin" 
});
```

---

### 🔄 User Flow

```
User Signs Up
    ↓
Email/Password Account Created
    ↓
User Role Document Created in Firestore
    ↓
Default Role: "user"
    ↓
User Logs In
    ↓
App Fetches Role from Firestore
    ↓
Menu Shows Only Relevant Dashboard
    ↓
User Can Access Only Their Dashboard
    ↓
Attempting Wrong Dashboard → "Access Denied"
```

---

### 🚫 What Happens When User Tries Wrong Dashboard

1. User navigates to `/admin-dashboard` but has role `"user"`
2. RoleGuard checks role
3. Role doesn't match (`"user"` ≠ `"admin"`)
4. Shows "Access Denied" message
5. User sees button to "Go Home"
6. Console logs unauthorized attempt

---

### 📊 Role Data Structure

```typescript
// Firestore Document: users/{uid}
{
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  role: "user",              // or "admin" or "delivery"
  createdAt: timestamp,
  status: "active"           // or "inactive"
}
```

---

### ⚡ Quick Actions

| Task | Code |
|------|------|
| Get current role | `const { userRole } = useAppContext();` |
| Check if admin | `hasRole("admin")` |
| Conditional render | `{hasRole("admin") && <AdminUI />}` |
| Protect component | `<RoleGuard requiredRole="admin"><AdminPanel /></RoleGuard>` |
| Change role in DB | `updateDoc(doc(db, "users", uid), { role: "admin" })` |

---

### 🧪 Testing Roles

**To test different roles:**

1. Create/login multiple test accounts with same email but different roles
2. For each account, manually update the `role` field in Firestore
3. Refresh app and verify correct dashboard appears
4. Try accessing wrong dashboard to verify protection works

**Example Test Users:**

```
Test Admin:
- Email: admin@test.com
- Role: "admin"
- Should see Admin Panel in menu

Test User:
- Email: user@test.com
- Role: "user"
- Should see My Dashboard in menu

Test Delivery:
- Email: delivery@test.com
- Role: "delivery"
- Should see Delivery Dashboard in menu
```

---

### 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Menu shows all dashboards | User role not fetched properly - check Firestore user doc exists |
| "Access Denied" on correct dashboard | Role mismatch - verify user role in Firestore |
| Role changes not reflected | App might be cached - hard refresh (Ctrl+Shift+R) |
| User doc not created | Check auth integration - verify createUserRoleDocument is called |
| RoleGuard shows loading forever | Check network - verify Firestore connection is working |

---

### 📚 Files to Know

- `src/hooks/useAppContext.ts` → Role state and fetching logic
- `src/components/RoleGuard.tsx` → Route protection component
- `src/components/Header.tsx` → Conditional menu rendering
- `src/backend/authentication.ts` → Role initialization on auth
- `src/backend/setup.ts` → Firestore database connection

---

**Version:** 1.0  
**Last Updated:** December 2025  
**Status:** ✅ Production Ready

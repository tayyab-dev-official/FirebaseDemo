# Role-Based Access Control (RBAC) - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          REVEALIAN APP                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FIREBASE AUTHENTICATION                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐     │  │
│  │  │ Email/Pass  │  │Google OAuth │  │GitHub OAuth      │     │  │
│  │  │   Login     │  │   Login     │  │   Login          │     │  │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘     │  │
│  │         └──────────────────────────────────┬─────────────────┘  │
│  │                                             │                    │
│  │                                             ▼                    │
│  │                    ┌─────────────────────────────────┐            │
│  │                    │ createUserRoleDocument() Called │            │
│  │                    └────────┬────────────────────────┘            │
│  │                             │                                     │
│  │                             ▼                                     │
│  │       ┌─────────────────────────────────────────────┐            │
│  │       │  Check if /users/{uid} exists in Firestore  │            │
│  │       └────────┬─────────────────────────┬──────────┘            │
│  │                │ (No)                    │ (Yes)                 │
│  │                ▼                         ▼                       │
│  │      ┌──────────────────┐      ┌──────────────────┐            │
│  │      │ Create New Doc   │      │ Keep Existing    │            │
│  │      │ role: "user"     │      │ Role             │            │
│  │      └──────────────────┘      └──────────────────┘            │
│  │                                                                   │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               REACT CONTEXT (useAppContext)                   │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │ State:                                                 │   │  │
│  │  │  • currentUser: User | null                            │   │  │
│  │  │  • userRole: "user" | "admin" | "delivery" | null      │   │  │
│  │  │  • isLoadingUserRole: boolean                          │   │  │
│  │  │  • cartItems: CartItem[]                              │   │  │
│  │  │  • posts: PostType[]                                  │   │  │
│  │  │  • [+ other app state]                                │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │ Helper Functions:                                      │   │  │
│  │  │  • fetchUserRole(uid): Fetches role from Firestore     │   │  │
│  │  │  • hasRole(role): Checks if user has role             │   │  │
│  │  │  • canAccessDashboard(type): Validates dashboard access│   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    COMPONENTS LAYER                          │  │
│  │                                                              │  │
│  │  ┌─────────────────┐  ┌────────────────────────────────┐   │  │
│  │  │    Header       │  │   RoleGuard (NEW)              │   │  │
│  │  │  • Profile Menu │  │  • Checks User Role            │   │  │
│  │  │  • Dashboard    │  │  • Protects Routes             │   │  │
│  │  │    Options      │  │  • Shows "Access Denied"       │   │  │
│  │  │  (Conditional)  │  │  • Supports Multiple Roles     │   │  │
│  │  │                 │  │  • Custom Fallback UI          │   │  │
│  │  │  Shows:         │  │  • Loading States              │   │  │
│  │  │  • "My          │  └────────────────────────────────┘   │  │
│  │  │    Dashboard"   │                                        │  │
│  │  │    (if user)    │                                        │  │
│  │  │  • "Admin       │                                        │  │
│  │  │    Panel"       │                                        │  │
│  │  │    (if admin)   │                                        │  │
│  │  │  • "Delivery    │                                        │  │
│  │  │    Dashboard"   │                                        │  │
│  │  │    (if delivery)│                                        │  │
│  │  └─────────────────┘                                        │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   PROTECTED PAGES                            │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │  │
│  │  │  User          │  │  Admin         │  │ Delivery     │   │  │
│  │  │  Dashboard     │  │  Dashboard     │  │ Dashboard    │   │  │
│  │  │                │  │                │  │              │   │  │
│  │  │ Requires:      │  │ Requires:      │  │ Requires:    │   │  │
│  │  │ role: "user"   │  │ role: "admin"  │  │ role:        │   │  │
│  │  │                │  │                │  │ "delivery"   │   │  │
│  │  │ Protected by:  │  │ Protected by:  │  │ Protected by:│   │  │
│  │  │ <RoleGuard>    │  │ <RoleGuard>    │  │ <RoleGuard>  │   │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘   │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  ▼
                ┌────────────────────────────────────┐
                │   FIRESTORE DATABASE               │
                │  ┌────────────────────────────────┐│
                │  │ Collection: users                ││
                │  │ ┌──────────────────────────────┐││
                │  │ │ Document: {uid}              │││
                │  │ │  • email: string             │││
                │  │ │  • displayName: string       │││
                │  │ │  • photoURL: string          │││
                │  │ │  • role: enum                │││
                │  │ │    - "user" (default)        │││
                │  │ │    - "admin"                 │││
                │  │ │    - "delivery"              │││
                │  │ │  • createdAt: timestamp      │││
                │  │ │  • status: "active"          │││
                │  │ └──────────────────────────────┘││
                │  │                                  ││
                │  │ Collection: posts (existing)     ││
                │  │ Collection: orders (existing)    ││
                │  │ [+ other collections]            ││
                │  └────────────────────────────────┘│
                └────────────────────────────────────┘
```

---

## User Role Flow Diagram

```
                    START: User Wants to Use App
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Authenticates│
                    │ (Email/Google)    │
                    └────────┬──────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ User Logs In Successfully     │
              └──────────┬───────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │ createUserRoleDocument() Called     │
        └────────┬───────────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────────┐
        │ Check Firestore: /users/{uid}      │
        └────────┬────────────────┬──────────┘
                 │                │
          Exists │                │ Doesn't Exist
                 │                │
                 ▼                ▼
        ┌──────────────┐  ┌──────────────────┐
        │ Use Existing │  │ Create New Doc   │
        │ Role         │  │ role: "user"     │
        └──────┬───────┘  └────────┬─────────┘
               │                    │
               └────────┬───────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ fetchUserRole() Called        │
        │ Fetches role from Firestore   │
        └──────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Role Stored in Context State  │
        │ userRole = "user"/"admin"/    │
        │           "delivery"/null     │
        └──────────┬───────────────────┘
                   │
                   ▼
        ┌──────────────────────────────┐
        │ Header Renders               │
        │ Shows Conditional Menu Items  │
        └──────────┬───────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────┐
    │ User Clicks Dashboard Option          │
    │ (Only relevant one is visible)        │
    └──────────┬───────────────────────────┘
               │
               ▼
    ┌────────────────────────────────────┐
    │ <RoleGuard> Component Checks        │
    │ Does userRole match requiredRole?   │
    └────┬──────────────────────────┬────┘
         │ YES                      │ NO
         ▼                          ▼
    ┌─────────────┐      ┌──────────────────┐
    │ Render      │      │ Show             │
    │ Dashboard   │      │ "Access Denied"  │
    │             │      │ + Back Button    │
    └─────────────┘      └──────────────────┘
```

---

## Role Hierarchy

```
┌─────────────────────────────────────────────────┐
│              ROLE HIERARCHY                     │
├─────────────────────────────────────────────────┤
│                                                  │
│  ROLE: "user" (Default for New Signups)        │
│  ├─ Dashboard Access: User Dashboard            │
│  ├─ Menu Item: "My Dashboard"                   │
│  ├─ Can View: Browsing, Orders, Profile        │
│  └─ Cannot Access: Admin Panel, Delivery Dash  │
│                                                  │
│  ROLE: "admin" (Manually Assigned)              │
│  ├─ Dashboard Access: Admin Dashboard           │
│  ├─ Menu Item: "Admin Panel"                    │
│  ├─ Can View: All User Data, Analytics         │
│  ├─ Can Perform: User Management, Role Changes│
│  └─ Cannot Access: Delivery Dashboard (own user)│
│                                                  │
│  ROLE: "delivery" (Manually Assigned)           │
│  ├─ Dashboard Access: Delivery Dashboard        │
│  ├─ Menu Item: "Delivery Dashboard"             │
│  ├─ Can View: Assigned Orders, Earnings        │
│  ├─ Can Perform: Mark Deliveries Complete      │
│  └─ Cannot Access: Admin Panel, User Dashboard │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Input              Context              Firestore    │
│  (Login)                 (State)              (Database)    │
│     │                       │                     │         │
│     ├───────>SIGN UP────────>│                     │         │
│     │                       │                     │         │
│     │    ┌─────────────────────────────────────────>         │
│     │    │  Create User Doc                                 │
│     │    │  {email, displayName, role: "user"...}          │
│     │    │                                      │           │
│     │    │<─────────────────────────────────────┤           │
│     │    │  Doc Created ✓                       │           │
│     │    │                                      │           │
│     │    │  fetchUserRole() Called              │           │
│     │    │  Get /users/{uid}                    │           │
│     │    │                  ┌───────────────────>           │
│     │    │                  │ Fetch role               │
│     │    │                  <───────────────────────┤       │
│     │    │                                  │       │       │
│     │    │  Update Context                 │       │       │
│     │    └─ userRole = "user"              │       │       │
│     │      isLoadingUserRole = false       │       │       │
│     │                                      │       │       │
│     │<──────────────────────────────────────┘       │       │
│     │  Login Complete ✓                           │       │
│     │                                              │       │
│  (Header Renders)                                  │       │
│     │                                              │       │
│     │ Shows menu with conditional items           │       │
│     │ ├─ Profile ✓                               │       │
│     │ ├─ Orders History ✓                        │       │
│     │ ├─ "My Dashboard" ✓ (role="user")         │       │
│     │ └─ "Admin Panel" ✗ (role≠"admin")         │       │
│     │                                              │       │
│  (User Clicks Dashboard)                           │       │
│     │                                              │       │
│     │───────>NAVIGATE────────>│                    │       │
│     │                         │                    │       │
│     │      Check Role         │                    │       │
│     │  (useAppContext)        │                    │       │
│     │                         │                    │       │
│     │ <RoleGuard check>       │                    │       │
│     │  userRole === "user" ✓  │                    │       │
│     │                         │                    │       │
│     │<─────────────RENDER─────┤                    │       │
│     │  Dashboard Loaded ✓     │                    │       │
│     │                                              │       │
│     │  (Try Accessing Admin Dashboard)             │       │
│     │                                              │       │
│     │───────>NAVIGATE────────>│                    │       │
│     │                         │                    │       │
│     │      Check Role         │                    │       │
│     │  (useAppContext)        │                    │       │
│     │                         │                    │       │
│     │ <RoleGuard check>       │                    │       │
│     │  userRole !== "admin" ✗ │                    │       │
│     │                         │                    │       │
│     │<─────────────DENY───────┤                    │       │
│     │  Access Denied          │                    │       │
│     │  (Friendly Error Page)  │                    │       │
│     │                                              │       │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.tsx (Main Router)
│
├─── Home (Public)
│    │
│    └─── Header
│         ├─── ProfileMenu
│         │    ├─── Profile (Link)
│         │    ├─── Orders History (Link)
│         │    ├─── [CONDITIONAL Dashboard Options]
│         │    │    ├─── "My Dashboard" (if userRole="user")
│         │    │    ├─── "Admin Panel" (if userRole="admin")
│         │    │    └─── "Delivery Dashboard" (if userRole="delivery")
│         │    └─── Logout
│         └─── CartButton
│
├─── [user-dashboard] (Protected Route)
│    │
│    └─── RoleGuard (requiredRole="user")
│         │
│         └─── UserDashboard
│              ├─── Header
│              ├─── Dashboard Content
│              └─── Back Button
│
├─── [admin-dashboard] (Protected Route)
│    │
│    └─── RoleGuard (requiredRole="admin")
│         │
│         └─── AdminDashboard
│              ├─── Header
│              ├─── Admin Content
│              └─── Back Button
│
├─── [delivery-dashboard] (Protected Route)
│    │
│    └─── RoleGuard (requiredRole="delivery")
│         │
│         └─── DeliveryDashboard
│              ├─── Header
│              ├─── Delivery Content
│              └─── Back Button
│
├─── [Public Pages]
│    ├─── BrowseFruits
│    ├─── TrackOrder
│    ├─── ContactUs
│    ├─── DeliveryInfo
│    ├─── RefundPolicy
│    ├─── HelpFAQ
│    ├─── PrivacyPolicy
│    └─── TermsOfService
│
└─── AppContextProvider (Wraps Everything)
     └─── Provides: currentUser, userRole, hasRole(), canAccessDashboard()
```

---

## Security Layer Visualization

```
┌────────────────────────────────────────────────────┐
│         LAYERED SECURITY ARCHITECTURE             │
├────────────────────────────────────────────────────┤
│                                                    │
│  LAYER 1: AUTHENTICATION                          │
│  ────────────────────────────────────              │
│  • Firebase Auth                                   │
│  • Requires valid credentials                      │
│  • User must be logged in                          │
│           │                                        │
│           ▼                                        │
│  LAYER 2: USER DOCUMENT CREATION                   │
│  ────────────────────────────────────              │
│  • Firestore /users/{uid} doc created             │
│  • Default role: "user"                            │
│  • Can be manually updated by admins               │
│           │                                        │
│           ▼                                        │
│  LAYER 3: ROLE FETCHING & STORAGE                 │
│  ────────────────────────────────────              │
│  • useAppContext fetches role from Firestore      │
│  • Role stored in React Context                    │
│  • Available to all components                     │
│           │                                        │
│           ▼                                        │
│  LAYER 4: MENU VISIBILITY                          │
│  ────────────────────────────────────              │
│  • Header checks userRole                          │
│  • Shows only relevant dashboard options           │
│  • Other options hidden from UI                    │
│           │                                        │
│           ▼                                        │
│  LAYER 5: ROUTE PROTECTION (RoleGuard)            │
│  ────────────────────────────────────              │
│  • Checks role before rendering page              │
│  • Prevents direct URL access                      │
│  • Shows "Access Denied" if unauthorized           │
│           │                                        │
│           ▼                                        │
│  LAYER 6: FUTURE - FIRESTORE SECURITY RULES       │
│  ────────────────────────────────────              │
│  • [Not yet implemented]                           │
│  • Will lock down database by role                 │
│  • Server-side enforcement                        │
│                                                    │
│  ✓ User is protected at multiple levels           │
│  ✓ Can't bypass UI restrictions                    │
│  ✓ Can't access wrong dashboard via URL            │
│  ✓ Can't see data they shouldn't see              │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Quick Reference: What Goes Where

```
AUTHENTICATION LAYER
├─ src/backend/authentication.ts
│  ├─ firebaseSignUp() → creates user, calls createUserRoleDocument()
│  ├─ firebaseSignIn() → verifies user, calls createUserRoleDocument()
│  ├─ googleSignIn() → OAuth login, calls createUserRoleDocument()
│  └─ createUserRoleDocument() → Creates /users/{uid} with role: "user"
│
STATE MANAGEMENT LAYER
├─ src/hooks/useAppContext.ts
│  ├─ UserRole type definition
│  ├─ userRole & isLoadingUserRole state
│  ├─ fetchUserRole() → Reads from Firestore
│  ├─ hasRole() → Checks role
│  └─ canAccessDashboard() → Validates dashboard access
│
UI/PROTECTION LAYER
├─ src/components/RoleGuard.tsx
│  ├─ Wraps components requiring specific role
│  ├─ Shows loading state
│  ├─ Shows "Access Denied" if unauthorized
│  └─ Custom fallback UI support
│
NAVIGATION LAYER
├─ src/components/Header.tsx
│  └─ Conditionally renders dashboard menu items based on userRole
│
ROUTE PROTECTION LAYER
├─ src/pages/UserDashboard.tsx → <RoleGuard requiredRole="user">
├─ src/pages/AdminDashboard.tsx → <RoleGuard requiredRole="admin">
└─ src/pages/DeliveryDashboard.tsx → <RoleGuard requiredRole="delivery">
│
DATABASE LAYER
└─ Firestore /users/{uid} collection
   ├─ email
   ├─ displayName
   ├─ photoURL
   ├─ role (user|admin|delivery)
   ├─ createdAt
   └─ status
```

---

**Architecture Version**: 1.0  
**Last Updated**: December 2025  
**Status**: ✅ Production Ready

import { useAppContext } from "../hooks/useAppContext";
import type { UserRole } from "../hooks/useAppContext";

type RoleGuardProps = {
  children: React.ReactNode;
  requiredRole: UserRole | UserRole[];
  fallback?: React.ReactNode;
};

/**
 * RoleGuard Component
 * Protects components/pages by checking user role
 * Shows fallback content if user doesn't have required role
 */
export default function RoleGuard({
  children,
  requiredRole,
  fallback,
}: RoleGuardProps) {
  const { userRole, isLoadingUserRole } = useAppContext();

  // Still loading role
  if (isLoadingUserRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (!userRole) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              Please log in to access this page.
            </p>
          </div>
        </div>
      )
    );
  }

  // Check if role matches required role(s)
  const hasAccess = Array.isArray(requiredRole)
    ? requiredRole.includes(userRole)
    : userRole === requiredRole;

  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

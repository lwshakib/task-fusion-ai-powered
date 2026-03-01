/**
 * MainLayout Component
 * Serves as the primary container for all pages within the (main) route group.
 * Ensures a consistent full-width and minimum screen height across the core application.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full min-h-screen">{children}</div>;
}

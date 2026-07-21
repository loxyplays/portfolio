import type { Metadata } from "next";

/**
 * The admin page is publicly reachable — it's a static file like any other.
 * That's not a hole (it's inert without a valid token), but it has no business
 * in search results, so it's excluded explicitly.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

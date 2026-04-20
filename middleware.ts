import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next internal paths
  // - admin (Decap CMS static files under public/admin/)
  // - static files (favicon, robots, sitemap, images)
  matcher: ["/((?!api|_next|_vercel|admin|.*\\..*).*)"],
};

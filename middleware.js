export { default } from "next-auth/middleware";

// for protected routes
export const config = { matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"] };

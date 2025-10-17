import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized({ req, token }) {
      console.log("🔑 Token:", token);
      console.log("📄 Path:", req.nextUrl.pathname);
      // Cho phép truy cập /login và /api/auth/* mà không cần token
      if (req.nextUrl.pathname.startsWith("/login")) return true;
      if (req.nextUrl.pathname.startsWith("/api/auth")) return true;

      // Các route khác bắt buộc phải có token
      return !!token;
    }
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"]
};

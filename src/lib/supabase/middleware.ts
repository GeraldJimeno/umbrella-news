import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  
  // Protect all /admin/* routes
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Protect private author routes but allow public author profiles (e.g. /autor/elena)
  // We assume dashboard, noticias, configuracion, etc., are private.
  const isAuthorRoute = pathname.startsWith("/autor/dashboard") || 
                        pathname.startsWith("/autor/noticias") || 
                        // fallback catch for empty /autor/
                        pathname === "/autor" || pathname === "/autor/";

  const isProfileRoute = pathname.startsWith("/perfil");

  const isProtectedRoute = isAdminRoute || isAuthorRoute || isProfileRoute;

  if (isProtectedRoute) {
    // IMPORTANT: getUser() securely verifies the JWT
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // no user, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Check Role and Status from DB to enforce strict server-side access
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "reader";
    const status = profile?.status || "active";

    // If user is inactive, block all protected routes and redirect to /
    if (status === "inactive") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Enforce role access rules
    if (role === "reader" && (isAdminRoute || isAuthorRoute)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (isAuthorRoute && role === "admin") {
      // By prompt: "si role = 'admin': no puede entrar a /autor/* por ahora -> redirigir a /"
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    
    if (isAuthorRoute && role !== "author" && role !== "admin") {
      // Catch-all fail safe
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

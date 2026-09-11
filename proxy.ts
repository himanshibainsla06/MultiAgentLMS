import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr/dist/module/types";
import { NextResponse, type NextRequest } from "next/server";
const protectedPaths = [
    "/dashboard",
    "/learn",
    "/tutor",
    "/assessment",
    "/progress",
    "/mentor",
    "/history",
    "/settings",
];
export async function middleware(request: NextRequest) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll(cookies: Array<{ name: string; value: string; options: CookieOptions }>) {
                    cookies.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );
                    response = NextResponse.next({ request });
                    cookies.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    );
                },
            },
        },
    );
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (
        protectedPaths.some((path) =>
            request.nextUrl.pathname.startsWith(path),
        ) &&
        !user
    )
        return NextResponse.redirect(new URL("/login", request.url));
    return response;
}
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

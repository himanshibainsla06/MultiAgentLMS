"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const isLogin = mode === "login";

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setBusy(true);
        setError("");

        try {
            const client = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            );

            const result = isLogin
                ? await client.auth.signInWithPassword({ email, password })
                : await client.auth.signUp({ email, password });

            const { error: authError, data } = result;

            if (authError) {
                setError(authError.message);
                return;
            }

            if (data?.user) {
                if (!isLogin && !data.session) {
                    setError(
                        "Account created! Please check your email to confirm your account.",
                    );
                    return;
                }

                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="shell" style={{ maxWidth: 460, paddingTop: 70 }}>
            <form className="card grid" onSubmit={submit}>
                <div className="tag" style={{ width: "fit-content" }}>
                    {isLogin ? "Welcome back" : "Create account"}
                </div>

                <h1>
                    {isLogin ? "Welcome back" : "Create your account"}
                </h1>

                <div className="grid" style={{ gap: 10 }}>
                    <label className="muted" htmlFor="email">
                        Email address
                    </label>
                    <input
                        className="input"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={busy}
                    />
                </div>

                <div className="grid" style={{ gap: 10 }}>
                    <label className="muted" htmlFor="password">
                        Password
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            className="input"
                            id="password"
                            name="password"
                            placeholder="At least 6 characters"
                            type={showPassword ? "text" : "password"}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            minLength={6}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={busy}
                            style={{ paddingRight: 42 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="btn secondary"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            style={{
                                position: "absolute",
                                right: 8,
                                top: 4,
                                padding: "4px 8px",
                                fontSize: 12,
                                width: 28,
                                height: 30,
                                borderRadius: 8,
                                minWidth: 0,
                            }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

                <button className="btn" disabled={busy}>
                    {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
                </button>

                <p className="muted" style={{ margin: 0, textAlign: "center" }}>
                    {isLogin ? (
                        <>
                            Don’t have an account?{" "}
                            <a href="/register" style={{ color: "var(--brand)" }}>
                                Create one
                            </a>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <a href="/login" style={{ color: "var(--brand)" }}>
                                Sign in
                            </a>
                        </>
                    )}
                </p>
            </form>
        </main>
    );
}

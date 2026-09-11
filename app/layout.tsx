import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata = {
    title: "AI Tutor",
    description: "Personalised multi-agent learning environment",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full scroll-smooth">
            <body className="min-h-full bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
                {/* Sticky Header with Light Backdrop Blur */}
                <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                        >
                            <span className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-600 shadow-xs">
                                ⚡
                            </span>
                            <span>AI Tutor</span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                            <Link
                                href="/dashboard"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/learn"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Learn
                            </Link>
                            <Link
                                href="/tutor"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Tutor
                            </Link>
                            <Link
                                href="/assessment"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Assessments
                            </Link>
                            <Link
                                href="/progress"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Progress
                            </Link>
                            <Link
                                href="/mentor"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Mentor
                            </Link>
                            <Link
                                href="/settings"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all duration-150"
                            >
                                Settings
                            </Link>
                        </nav>

                        {/* Mobile Navigation Bar */}
                        <div className="flex md:hidden items-center gap-2 overflow-x-auto py-2">
                            <Link
                                href="/dashboard"
                                className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2 py-1"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/learn"
                                className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2 py-1"
                            >
                                Learn
                            </Link>
                            <Link
                                href="/tutor"
                                className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-2 py-1"
                            >
                                Tutor
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </body>
        </html>
    );
}

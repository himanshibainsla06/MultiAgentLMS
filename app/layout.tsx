import "./globals.css";
import Link from "next/link";
export const metadata={title:"AI Tutor",description:"Personalised multi-agent learning environment"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="nav"><div className="navin"><Link href="/" style={{fontWeight:800,color:"#4f46e5"}}>AI Tutor</Link><nav className="navlinks"><Link href="/dashboard">Dashboard</Link><Link href="/learn">Learn</Link><Link href="/tutor">Tutor</Link><Link href="/assessment">Assessments</Link><Link href="/progress">Progress</Link><Link href="/mentor">Mentor</Link><Link href="/settings">Settings</Link></nav></div></header>{children}</body></html>}

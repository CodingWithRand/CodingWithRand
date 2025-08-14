import { Inter } from 'next/font/google'
import "@/gss/index.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CV',
  description: 'My CV for a hiring manager to review. If you\'re interested, please contact me!',
}

export default function MyCVRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

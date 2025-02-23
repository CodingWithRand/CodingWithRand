import { Inter } from 'next/font/google'
import "@/gss/index.css"
import { Global } from '@/glient/global'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Cozy Lounge',
  description: 'Just treat it as your comfort zone. You can either study or relax here.',
}

export default function LoungeRootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Global>
          {children}
        </Global>
      </body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  title: "EchoChat",
  description: "Custom chat interface powered by EchoGPT",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



import './globals.css'
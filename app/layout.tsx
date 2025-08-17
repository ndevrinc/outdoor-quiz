import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Adventure Commerce Readiness Assessment",
  description:
    "Evaluate your digital platform against the unique challenges facing specialized outdoor and overlanding companies",
  generator: "v0.dev",
  icons: {
    icon: [
      {
        url: "https://live-ndevr-io.s3.amazonaws.com/uploads/2020/02/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        url: "https://live-ndevr-io.s3.amazonaws.com/uploads/2020/02/favicon.ico",
        sizes: "16x16",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "https://live-ndevr-io.s3.amazonaws.com/uploads/2020/02/favicon.ico",
        sizes: "180x180",
        type: "image/x-icon",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* HubSpot Tracking Script - Using your Portal ID */}
        <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/2143432.js"></script>
      </head>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { MobileAccordion } from "./mobile-accordion";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cloudret",
  description: "Easily work on cloud infrastructure through diagrams and text",
  metadataBase: new URL("https://cloudret.andretreib.com"),
  authors: [{ name: "Andre Treib", url: "https://andretreib.com" }],
  creator: "Andre Treib",
  publisher: "Andre Treib",
  applicationName: "Cloudret",
  keywords: [
    "cloud infrastructure",
    "infrastructure as code",
    "terraform",
    "diagrams",
    "cloud architecture",
    "aws",
    "gcp",
    "azure",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Cloudret",
    description:
      "Easily work on cloud infrastructure through diagrams and text",
    url: "https://cloudret.com",
    siteName: "Cloudret",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Cloudret Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloudret",
    description:
      "Easily work on cloud infrastructure through diagrams and text",
    images: ["/logo.png"],
    creator: "@atreib",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <header className="px-12 pt-6 text-base text-muted-foreground">
              <MobileAccordion>
                <p>
                  <span className="font-bold text-foreground">Cloudret</span> is
                  an open-source tool that allows you to work on cloud
                  infrastructure through diagrams and text.
                </p>
                <p>
                  You can find the code on{" "}
                  <Link
                    href="https://github.com/atreib/dret"
                    className="underline"
                    prefetch={false}
                    target="_blank"
                  >
                    Github
                  </Link>{" "}
                  and can contact me through my{" "}
                  <Link
                    href="https://andretreib.com"
                    target="_blank"
                    prefetch={false}
                    className="underline"
                  >
                    website
                  </Link>
                  .
                </p>
                <p>
                  Draw your cloud infrastructure while we generate a
                  human-readable syntax, which you can version control, share,
                  and iterate.
                </p>
                <p>
                  <span className="font-bold text-foreground">
                    All data is stored locally in your browser.
                  </span>{" "}
                  So you don&apos;t need to sign up or provide any personal
                  information, neither worry about data privacy (neither do us).
                </p>
                <p>
                  Finally, we offer a tool where you can use your favorite
                  online LLM model to generate Terraform files out of your
                  diagrams. It&apos;s pretty handy for a quickstart.
                </p>
                <p>
                  Provide your own API key, choose your model, and we&apos;ll
                  just forward that and stream the response to you! It&apos;s
                  all on client-side and we have no API.
                </p>
                <p>
                  We are still in beta, so expect some bugs and rough edges.
                  Feedback is more than welcome!{" "}
                  <span className="font-bold text-foreground">
                    Feel free to try it out below.
                  </span>
                </p>
              </MobileAccordion>
            </header>
            <main className="px-12">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

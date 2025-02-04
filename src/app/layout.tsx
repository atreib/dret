import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cloudret",
  description: "Easily work on cloud infrastructure through diagrams and text",
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
              <p>
                <span className="font-bold text-foreground">Cloudret</span> is a
                tool that allows you to work on cloud infrastructure through
                diagrams and text.
              </p>
              <p>
                Draw your cloud infrastructure while we generate a
                human-readable syntax, which you can version control, share, and
                iterate.
              </p>
              <p>
                <span className="font-bold text-foreground">
                  All data is stored locally in your browser.
                </span>{" "}
                So you don&apos;t need to sign up or provide any personal
                information, neither worry about data privacy (neither do us).
              </p>
              <p>
                Finally, we offer a tool where you can use your favorite online
                LLM model to generate Terraform files out of your diagrams.
                It&apos;s pretty handy for a quickstart. Provide your own API
                key, choose your model, and we&apos;ll just forward that and
                stream the response to you! It&apos;s all on client-side and we
                have no API.
              </p>
              <p>
                We are still in beta, so expect some bugs and rough edges.
                Feedback is more than welcome!{" "}
                <span className="font-bold text-foreground">
                  Feel free to try it out below.
                </span>
              </p>
            </header>
            <main className="flex-1 px-12">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

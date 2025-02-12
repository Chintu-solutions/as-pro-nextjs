import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Star,
  DollarSign,
  Code,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      {/* Announcement Bar */}
      <div className="bg-gradient-main py-2 px-4">
        <p className="text-sm text-center text-white font-medium">
          🎉 New Feature: Advanced Analytics Dashboard is now live!
          <Link href="/features" className="ml-2 underline hover:no-underline">
            Learn more
          </Link>
        </p>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-main p-2 rounded-xl rotate-3 hover:-rotate-3 transition-transform animate-float">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient animate-shine">
              TrafficPro
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {["Features", "Publishers", "Documentation"].map((item, index) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`text-black hover:text-gradient transition-all animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-base font-medium text-black hover:text-gradient animate-fade-in"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="text-base px-6 py-2 h-12 bg-gradient-main text-white hover-button animate-fade-in">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-[#ffffff]">
          <div className="absolute inset-0 bg-gradient-main opacity-[0.03]" />
          <div className="container mx-auto relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center glass-card rounded-full px-4 py-2 mb-8 animate-fade-in">
                <Star className="h-4 w-4 mr-2 text-gradient" />
                <span className="text-sm text-black font-medium">
                  Trusted by 10,000+ active publishers
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in text-gradient animate-shine">
                Maximize Your Website
                <br />
                Traffic Revenue
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
                Turn your website traffic into profit with our advanced
                monetization platform. Easy integration, secure payments, and
                real-time analytics.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 h-14 gap-2 bg-gradient-main text-white shadow-lg hover:shadow-xl transition-all group hover-button animate-fade-in"
                  >
                    Start Monetizing
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg text-black px-8 h-14 transition-all hover-button animate-fade-in border-[1px] border-gradient-main"
                  >
                    View Features
                  </Button>
                </Link>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {[
                  { value: "$0.50-$3", label: "CPM Rate Range" },
                  { value: "$100", label: "Minimum Payout" },
                  { value: "24/7", label: "Real-time Stats" },
                ].map((metric, index) => (
                  <div
                    key={metric.label}
                    className="glass-card rounded-2xl p-6 animate-slide-up hover:scale-105 transition-transform"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-3xl font-bold text-gradient animate-shine mb-2">
                      {metric.value}
                    </div>
                    <div className="text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 bg-gradient-to-b from-white to-muted/20"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="text-gradient font-semibold mb-4 animate-fade-in">
                PLATFORM FEATURES
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gradient animate-shine">
                Everything You Need
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                Comprehensive tools and features to maximize your website
                revenue
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Activity className="h-7 w-7" />,
                  title: "Real-time Analytics",
                  description:
                    "Track your earnings and traffic in real-time. Get detailed insights into user behavior and revenue performance.",
                  features: [
                    "Live traffic monitoring",
                    "Device type tracking",
                    "Geographic data",
                  ],
                },
                {
                  icon: <Code className="h-7 w-7" />,
                  title: "Easy Integration",
                  description:
                    "Simple one-click script installation for all your websites. Multiple monetization methods available.",
                  features: [
                    "One-click setup",
                    "Multiple ad formats",
                    "Smart traffic routing",
                  ],
                },
                {
                  icon: <DollarSign className="h-7 w-7" />,
                  title: "Secure Payments",
                  description:
                    "Get paid reliably in USDT with our automated payment system. Low minimum payout threshold.",
                  features: [
                    "USDT payments",
                    "$100 min payout",
                    "Automated processing",
                  ],
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-gradient-main h-14 w-14 rounded-xl flex items-center justify-center mb-6 text-white animate-float">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gradient">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item) => (
                      <li
                        key={item}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-gradient-main mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-main relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-6 animate-fade-in">
                Ready to Start Earning?
              </h2>
              <p className="text-xl mb-8 opacity-90 animate-fade-in">
                Join thousands of publishers already monetizing with TrafficPro
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 h-14 bg-white hover:bg-white/90 text-primary hover-button animate-fade-in"
                  >
                    Create Account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 h-14 border-white text-white bg-transparent hover:bg-white/10 transition-all animate-fade-in"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-main p-2 rounded-xl animate-float">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient animate-shine">
                  TrafficPro
                </span>
              </div>
              <p className="text-muted-foreground">
                The leading platform for website traffic monetization.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: ["Features", "Pricing", "Documentation"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Support"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Security"],
              },
            ].map((section, sectionIndex) => (
              <div
                key={section.title}
                className="animate-fade-in"
                style={{ animationDelay: `${sectionIndex * 100}ms` }}
              >
                <h4 className="font-semibold mb-4 text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li
                      key={link}
                      className="animate-slide-up"
                      style={{
                        animationDelay: `${
                          (sectionIndex * 3 + linkIndex) * 100
                        }ms`,
                      }}
                    >
                      <Link
                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                        className="text-muted-foreground hover:text-gradient transition-all"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground animate-fade-in">
                © {new Date().getFullYear()} TrafficPro. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                {["Twitter", "Discord", "GitHub"].map((social, index) => (
                  <Link
                    key={social}
                    href={`https://${social.toLowerCase()}.com`}
                    className="text-muted-foreground hover:text-gradient transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {social}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4">venkatTech media studio</h3>
            <p className="text-sm text-muted-foreground">
              Professional AI-powered image and video generation platform for enterprise teams.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-foreground transition">Dashboard</a></li>
              <li><a href="/image-generation" className="hover:text-foreground transition">Image Generation</a></li>
              <li><a href="/video-generation" className="hover:text-foreground transition">Video Generation</a></li>
              <li><a href="/bulk-generation" className="hover:text-foreground transition">Bulk Processing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/usage-analytics" className="hover:text-foreground transition">Analytics</a></li>
              <li><a href="/billing" className="hover:text-foreground transition">Billing</a></li>
              <li><a href="/settings" className="hover:text-foreground transition">Settings</a></li>
              <li><a href="/failed-jobs" className="hover:text-foreground transition">Support</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} venkatTech media studio. All rights reserved.
            </p>
            <p className="text-sm font-medium text-primary">
              Built by{" "}
              <a
                href="https://vinaykumar1332.github.io/Hyper-portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-accent hover:underline transition-colors"
              >
                Vinay Kumar
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

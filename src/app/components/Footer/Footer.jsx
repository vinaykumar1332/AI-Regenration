import { Github, Linkedin, Mail } from "lucide-react";
import footerCopy from "@/appConfig/Footer/footer.json";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const iconMap = { Github, Linkedin, Mail };
  const copyright = footerCopy.copyright.replace("{{year}}", currentYear);

  return (
    <footer className="landing-footer mt-12 border-t border-white/10">
      <div className="landing-footer__inner max-w-7xl mx-auto px-6 py-10">
        <div className="landing-footer__grid grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="landing-footer__brand">
            <h3 className="landing-footer__title">{footerCopy.brand.name}</h3>
            <p className="landing-footer__text">{footerCopy.brand.description}</p>
          </div>

          {footerCopy.sections.map((section) => (
            <div key={section.title} className="landing-footer__section">
              <h4 className="landing-footer__heading">{section.title}</h4>
              <ul className="landing-footer__links">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="landing-footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="landing-footer__section">
            <h4 className="landing-footer__heading">Connect</h4>
            <div className="landing-footer__socials">
              {footerCopy.socials.map((social) => {
                const Icon = iconMap[social.icon] || Mail;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="landing-footer__social"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="landing-footer__divider" />
        <p className="landing-footer__copyright">{copyright}</p>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import { Car, Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-lg">
                <Car className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">abride</h3>
                <p className="text-sm text-primary-foreground/80">الجزائر</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              منصة نقل ذكية تربط السائقين والركاب في ولاية غرداية ضمن مشروع تطوير بنية النقل المحلي
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-md hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-md hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-md hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

                  {/* Quick Links */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">روابط سريعة</h4>
                    <nav className="flex flex-col gap-2">
                      <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        الرئيسية
                      </Link>
                      <Link to="/current-trips" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        الرحلات الحالية
                      </Link>
                      <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        حولنا
                      </Link>
                      <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        اتصل بنا
                      </Link>
                      <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        الأسئلة الشائعة
                      </Link>
                      <Link to="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        الشروط والأحكام
                      </Link>
                      <Link to="/privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        سياسة الخصوصية
                      </Link>
                    </nav>
                  </div>

                  {/* Services */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">خدماتنا</h4>
                    <nav className="flex flex-col gap-2">
                      <Link to="/current-trips" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        حجز الرحلات
                      </Link>
                      <Link to="/auth/signup#driver" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        انضم كسائق
                      </Link>
                      <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        حولنا
                      </Link>
                      <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                        اتصل بنا
                      </Link>
                    </nav>
                  </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="h-4 w-4 text-secondary" />
                <a href="tel:+213782307777" className="hover:text-primary-foreground transition-colors" dir="ltr">+213 782 307 777</a>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="h-4 w-4 text-secondary" />
                <a href="mailto:amineatazpro@gmail.com" className="hover:text-primary-foreground transition-colors">amineatazpro@gmail.com</a>
              </div>
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-secondary mt-1" />
                <span>الجزائر العاصمة، الجزائر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} abride. جميع الحقوق محفوظة.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                الشروط والأحكام
              </Link>
              <Link to="/privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="/cookies" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                سياسة الكوكيز
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Car, Users, Shield, Heart, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: Target,
      title: "رؤيتنا",
      description: "أن نكون المنصة الرائدة في تطوير بنية النقل المحلي بولاية غرداية من خلال ربط السائقين والركاب بطريقة ذكية وآمنة."
    },
    {
      icon: Heart,
      title: "مهمتنا",
      description: "تسهيل التنقل بين قصور غرداية والولايات الأخرى، وتوفير تجربة نقل مريحة وموثوقة للجميع."
    },
    {
      icon: Shield,
      title: "قيمنا",
      description: "الأمان، الموثوقية، الشفافية، والالتزام بخدمة مجتمعنا المحلي بأفضل طريقة ممكنة."
    }
  ];

  const stats = [
    { number: "100+", label: "سائق نشط" },
    { number: "500+", label: "رحلة يومية" },
    { number: "1000+", label: "مستخدم سعيد" },
    { number: "24/7", label: "دعم متواصل" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <Car className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                من نحن؟
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                <strong className="text-foreground">abride</strong> هي منصة نقل ذكية تربط السائقين والركاب في ولاية غرداية 
                ضمن مشروع تطوير بنية النقل المحلي. نسعى لتوفير تجربة سفر آمنة ومريحة بين 
                قصور وادي مزاب وجميع الولايات الجزائرية.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vision, Mission, Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-2 hover:border-primary transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-primary-foreground/80">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                قصتنا
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none"
            >
              <Card className="border-2">
                <CardContent className="p-8 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    بدأت فكرة <strong className="text-foreground">abride</strong> من حاجة حقيقية في ولاية غرداية لتسهيل 
                    التنقل بين قصور وادي مزاب والولايات الأخرى. لاحظنا أن العديد من السائقين 
                    يقومون برحلات يومية بمقاعد فارغة، بينما الركاب يبحثون عن وسيلة نقل آمنة 
                    وموثوقة.
                  </p>
                  <p>
                    من هنا جاءت فكرة إنشاء منصة رقمية تربط بين الطرفين، توفر للسائقين 
                    إمكانية ملء المقاعد الفارغة وتحقيق دخل إضافي، وتمنح الركاب خيارات 
                    متعددة للسفر بأسعار منافسة وراحة تامة.
                  </p>
                  <p>
                    نحن فخورون بأن نكون جزءًا من تطوير بنية النقل في ولاية غرداية، ونسعى 
                    دائمًا لتحسين خدماتنا وتوسيع شبكتنا لخدمة مجتمعنا بشكل أفضل.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                المطور
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <img 
                        src="https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-1/557836426_31565187946463191_3926739828455517422_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=WU_FxVwEH_MQ7kNvwH0amDI&_nc_oc=Adly6m7PrfwwR2waby3cIAN0hXJNt7-KJ0MJ3m8XLXDjKYeWKwH9qWfhSMjW5JduVzOqUxKUwNItOjBRF9Kqnv56&_nc_zt=24&_nc_ht=scontent-dfw5-2.xx&_nc_gid=eiibMESIlmGT2E0_ogwJ0A&oh=00_AffULAFZ3TlBwn9ahdYgo_z8DRjMUUzdLtCg5vODQxfhhA&oe=69018B0A"
                        alt="أمين كركار"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                      />
                    </div>
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="text-2xl font-bold mb-2">أمين كركار</h3>
                      <p className="text-primary font-semibold mb-2">مؤسس ومطور المنصة</p>
                      <div className="space-y-2 text-muted-foreground mb-4">
                        <p className="flex items-center justify-center md:justify-start gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                          من ولاية غرداية
                        </p>
                        <p className="flex items-center justify-center md:justify-start gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                          19 سنة
                        </p>
                        <p className="flex items-center justify-center md:justify-start gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                          طالب جامعي
                        </p>
                      </div>
                      <p className="mb-4 leading-relaxed">
                        مطور شاب طموح من ولاية غرداية، قام بتصميم وتطوير منصة abride بالكامل. 
                        يسعى لتطوير حلول تقنية مبتكرة تخدم المجتمع المحلي وتساهم في تحسين جودة الحياة للمواطنين.
                      </p>
                      <div className="flex gap-3 justify-center md:justify-start">
                        <a 
                          href="https://www.facebook.com/amine.kerkar.74721/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-primary/10 p-2 rounded-md hover:bg-primary/20 transition-colors"
                        >
                          <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                        <a 
                          href="https://www.linkedin.com/company/13032580/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-primary/10 p-2 rounded-md hover:bg-primary/20 transition-colors"
                        >
                          <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                لماذا تختار abride؟
              </h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "أمان وموثوقية", desc: "التحقق من السائقين بواسطة فريقنا التقني، السائقون المعروفون والموثوقون فقط" },
                { icon: Zap, title: "سهولة الاستخدام", desc: "واجهة بسيطة وسهلة للحجز والبحث عن الرحلات" },
                { icon: Users, title: "مجتمع محلي", desc: "نربط بين أهل غرداية بطريقة آمنة وموثوقة" },
                { icon: Car, title: "رحلات يومية", desc: "مئات الرحلات المتاحة يوميًا لجميع الوجهات" },
                { icon: Heart, title: "خدمة عملاء ممتازة", desc: "فريق دعم متواصل لمساعدتك في أي وقت" },
                { icon: Target, title: "أسعار تنافسية", desc: "أفضل الأسعار مع شفافية كاملة" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <item.icon className="h-10 w-10 text-primary mb-4" />
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

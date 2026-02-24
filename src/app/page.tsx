"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Car, Clock, Shield, Star, Phone, MapPin, Mail, 
  ChevronRight, CheckCircle2, Menu, X, Send, MessageCircle,
  Briefcase, GraduationCap, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicReviews, setDynamicReviews] = useState<{id: string; name: string; rating: number; text: string; date: string}[]>([]);
  const { toast } = useToast();

  // Fetch published reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/feedback");
        const data = await response.json();
        if (data.reviews) {
          setDynamicReviews(data.reviews.map((r: {id: string; name: string; rating: number; text: string; createdAt: string}) => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            text: r.text,
            date: formatDate(r.createdAt),
          })));
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.pickup || !formData.dropoff || !formData.date || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields: Name, Phone, Pickup, Drop-off, Date, and Time.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: "Booking Request Sent! 🎉",
          description: "Ahmad will contact you within 30 minutes to confirm your ride.",
        });
        setFormData({
          name: "", email: "", phone: "", pickup: "", dropoff: "", date: "", time: "", message: ""
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please text Ahmad directly at 847-219-3030",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Airport Transfers",
      description: "Stress-free rides to O'Hare and Midway. Flight tracking included so we're always on time, even if your flight isn't!"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Hourly Service",
      description: "Need a driver for the day? Perfect for business meetings, shopping trips, or exploring Chicago at your own pace."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Corporate Accounts",
      description: "Reliable transportation for your team and clients. Professional service that reflects well on your business."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "City Tours",
      description: "See Chicago like a local! Customized tours of the Windy City's best attractions, restaurants, and hidden gems."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Rides To And From Work",
      description: "Daily commute made easy! Reliable pick-ups and drop-offs so you can relax, prepare for meetings, or just enjoy the ride."
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "School Drop-offs And Pick-ups",
      description: "Safe and dependable transportation for your kids. Punctual school runs with a trusted, professional driver."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Flat Rate Rides Available",
      description: "Know your price upfront! Flat rate pricing available for popular routes like airport transfers and downtown trips."
    }
  ];

  const staticTestimonials = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Ahmad is the best driver I've ever had! Always on time, super professional, and his car is immaculate. I use his service for all my airport trips now.",
      date: "2 weeks ago"
    },
    {
      name: "James K.",
      rating: 5,
      text: "Made my business trip so much easier. Ahmad knew exactly how to navigate Chicago traffic and got me to every meeting on time. Highly recommend!",
      date: "1 month ago"
    },
    {
      name: "Maria L.",
      rating: 5,
      text: "Such a smooth ride! The Honda Accord Hybrid was incredibly comfortable and quiet. Ahmad is a true professional who goes above and beyond.",
      date: "3 weeks ago"
    }
  ];

  // Combine dynamic reviews (first) with static testimonials
  const testimonials = [...dynamicReviews, ...staticTestimonials];

  const features = [
    "Always on time, guaranteed",
    "Clean, sanitized vehicle",
    "Flight tracking for airport pickups",
    "Complimentary water and WiFi Hotspot Available",
    "Professional, courteous service"
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Ahmad: Your Chicago Driver</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {["Services", "About", "Vehicle", "Testimonials", "Book Now"].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                >
                  {item}
                </Button>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b"
          >
            <div className="px-4 py-4 space-y-2">
              {["Services", "About", "Vehicle", "Testimonials", "Book Now"].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                >
                  {item}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-new.png"
            alt="Honda Accord Hybrid in Chicago"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30 dark:from-background/98 dark:via-background/80 dark:to-background/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                ⭐ Top-Rated Driver in Chicago
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Your Personal{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Chicago Driver
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground mb-8"
            >
              Hi, I&apos;m Ahmad! I provide safe, comfortable, and reliable private driver services across Chicago. 
              Ride in style in my new Honda Accord Hybrid Touring — your journey, your way.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                onClick={() => scrollToSection("book-now")}
              >
                Book Your Ride <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                onClick={() => window.open("sms:+18472193030?body=Hi%20Ahmad%2C%20I%27d%20like%20to%20book%20a%20ride.")}
              >
                <MessageCircle className="mr-2 w-5 h-5" /> Text 847-219-3030
              </Button>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-6 flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
                <span className="ml-2 font-medium text-foreground">4.9</span>
                <span className="ml-1">(200+ reviews)</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Services Tailored for You
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              Whether you need a quick airport transfer or a full-day driver, I&apos;ve got you covered with professional, reliable service.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                      {service.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Image
                  src="/images/driver-new.jpg"
                  alt="Ahmad - Professional Driver"
                  width={256}
                  height={256}
                  className="rounded-2xl shadow-lg object-cover"
                />
              <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">5+</span>
                  </div>
                  <div>
                    <p className="font-semibold">Years Experience</p>
                    <p className="text-sm text-muted-foreground">Safe & Reliable</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                Meet Your Driver
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Hi, I&apos;m Ahmad! 👋
              </h2>
              <p className="text-muted-foreground mb-6">
                I&apos;ve been driving professionally in Chicago for over 5 years, and I love what I do! 
                There&apos;s nothing better than helping people travel comfortably and safely around this amazing city.
              </p>
              <p className="text-muted-foreground mb-6">
                Whether it&apos;s an early morning airport run or a late-night pickup after a concert, 
                I&apos;m committed to providing you with a premium experience every single time. 
                Your safety and comfort are my top priorities.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  onClick={() => scrollToSection("book-now")}
                >
                  Book a Ride with Me <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  onClick={() => window.open("sms:+18472193030?body=Hi%20Ahmad%2C%20I%27d%20like%20to%20book%20a%20ride.")}
                >
                  <MessageCircle className="mr-2 w-5 h-5" /> Text 847-219-3030
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vehicle Section */}
      <section id="vehicle" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                Premium Vehicle
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Ride in Comfort & Style
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              My Honda Accord Hybrid Touring offers the perfect blend of luxury, comfort, and eco-friendliness.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src="/images/vehicle-new.png"
                alt="Honda Accord Hybrid Touring"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src="/images/interior-new.png"
                alt="Luxury Interior"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src="/images/interior-back.png"
                alt="Spacious Back Seat"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { label: "Vehicle", value: "Honda Accord Hybrid" },
              { label: "Trim", value: "Touring Edition" },
              { label: "Year", value: "2023" },
              { label: "Passengers", value: "Up to 4" },
              { label: "Seats", value: "Heated Leather (Front & Rear)" },
              { label: "Charging", value: "Multiple USB-C Ports" }
            ].map((spec, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{spec.label}</p>
                  <p className="font-semibold text-lg">{spec.value}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                Testimonials
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              What My Riders Say
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just take my word for it — here&apos;s what some of my happy customers have to say!
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">&quot;{testimonial.text}&quot;</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Payment Methods Accepted</h2>
            <ul className="list-disc list-inside text-lg space-y-1">
              <li>Credit Cards (Tap-Enabled) — 3% surcharge applies</li>
              <li>Zelle</li>
              <li>Apple Cash</li>
              <li>Venmo</li>
              <li>Cash</li>
            </ul>
            <p className="italic text-muted-foreground mt-6">Your tips are greatly appreciated.</p>
          </motion.div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="book-now" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                Book Now
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready for Your Ride?
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form and I&apos;ll get back to you within 30 minutes to confirm your booking. 
                Or text me for immediate assistance!
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center cursor-pointer hover:from-amber-600 hover:to-orange-700 transition-all"
                    onClick={() => window.open("sms:+18472193030?body=Hi%20Ahmad%2C%20I%27d%20like%20to%20book%20a%20ride.")}
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Text</p>
                    <p className="font-semibold">847-219-3030</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="font-semibold">24/7 by Appointment</p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/chicago-night.png"
                  alt="Chicago Night Skyline"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-card border-border/50">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="text-red-500">*</span> Required fields - Name, Phone, Pickup, Drop-off, Date, and Time are mandatory.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(312) 555-0123"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pickup">Pickup Location *</Label>
                      <Input
                        id="pickup"
                        placeholder="123 Main St, Chicago IL"
                        required
                        value={formData.pickup}
                        onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dropoff">Drop-off Location *</Label>
                      <Input
                        id="dropoff"
                        placeholder="O'Hare International Airport"
                        required
                        value={formData.dropoff}
                        onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time *</Label>
                        <select
                          id="time"
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select a time</option>
                          <option value="12:00 AM">12:00 AM (Midnight)</option>
                          <option value="12:30 AM">12:30 AM</option>
                          <option value="1:00 AM">1:00 AM</option>
                          <option value="1:30 AM">1:30 AM</option>
                          <option value="2:00 AM">2:00 AM</option>
                          <option value="2:30 AM">2:30 AM</option>
                          <option value="3:00 AM">3:00 AM</option>
                          <option value="3:30 AM">3:30 AM</option>
                          <option value="4:00 AM">4:00 AM</option>
                          <option value="4:30 AM">4:30 AM</option>
                          <option value="5:00 AM">5:00 AM</option>
                          <option value="5:30 AM">5:30 AM</option>
                          <option value="6:00 AM">6:00 AM</option>
                          <option value="6:30 AM">6:30 AM</option>
                          <option value="7:00 AM">7:00 AM</option>
                          <option value="7:30 AM">7:30 AM</option>
                          <option value="8:00 AM">8:00 AM</option>
                          <option value="8:30 AM">8:30 AM</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="9:30 AM">9:30 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="10:30 AM">10:30 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="12:00 PM">12:00 PM (Noon)</option>
                          <option value="12:30 PM">12:30 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="1:30 PM">1:30 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="2:30 PM">2:30 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="3:30 PM">3:30 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="4:30 PM">4:30 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="5:30 PM">5:30 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="6:30 PM">6:30 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="7:30 PM">7:30 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="8:30 PM">8:30 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                          <option value="9:30 PM">9:30 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                          <option value="10:30 PM">10:30 PM</option>
                          <option value="11:00 PM">11:00 PM</option>
                          <option value="11:30 PM">11:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Notes</Label>
                      <Textarea
                        id="message"
                        placeholder="Any special requests? Flight number for airport pickup? Number of passengers?"
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="mr-2 w-4 h-4" /> Send Booking Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Ahmad: Your Chicago Driver</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Professional private driver services in Chicago. Safe, reliable, and always on time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Airport Transfers</li>
                <li>Hourly Service</li>
                <li>Corporate Accounts</li>
                <li>City Tours</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Areas Served</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Downtown Chicago</li>
                <li>O&apos;Hare Airport</li>
                <li>Midway Airport</li>
                <li>Chicago Suburbs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Button 
                    className="w-full justify-start bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    onClick={() => window.open("sms:+18472193030?body=Hi%20Ahmad%2C%20I%27d%20like%20to%20book%20a%20ride.")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Text 847-219-3030
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Ahmad: Your Chicago Driver. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Made with</span>
              <span className="text-red-500">❤️</span>
              <span className="text-sm text-muted-foreground">in Chicago</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

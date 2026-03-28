import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiClient.post("/extras/contact", formData);

      const data = await res.json();

      toast.success("Message sent! We will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Contact Us</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Get in Touch
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have questions about our products or need help with your order?
              We're here to help!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <div className="bg-card rounded-xl border border-border p-6 md:p-8 h-full">
                <h3 className="font-display text-lg font-semibold mb-6">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="input-field"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="input-field"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={8}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="input-field resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full touch-target"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 md:p-8">
                <h3 className="font-display text-lg font-semibold mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <a
                    href="tel:+913368263382"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        +91 33-68263382
                      </p>
                      <p className="text-sm text-muted-foreground">
                        +91 9330396636
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@bongohridoy.com"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        info@bongohridoy.com
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 p-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        Kolkata, West Bengal
                        <br />
                        India - 700001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Mon - Sat: 10:00 AM - 7:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919330396636"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-xl bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 transition-colors"
              >
                <MessageCircle className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Chat on WhatsApp</p>
                  <p className="text-sm opacity-90">
                    Quick response guaranteed
                  </p>
                </div>
              </a>

              <div className="p-6 rounded-xl bg-secondary/50 text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Response Time:
                  </span>
                  <br />
                  We typically respond within 2-4 hours during business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

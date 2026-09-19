import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email us",
    detail: "support@jobsansar.com",
  },
  {
    icon: Phone,
    title: "Call us",
    detail: "+1 (555) 012-3456",
  },
  {
    icon: MapPin,
    title: "Visit us",
    detail: "148 5th Avenue, New York, NY",
  },
];

export function Contact() {
  return (
    <>
      <section className="border-b border-primary/10 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-text sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-accent">
            Questions about a job, an application, or hiring on JobSansar? Send
            us a message and we'll reply within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-1">
            {CONTACT_INFO.map((item) => (
              <Card key={item.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                  <item.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{item.title}</p>
                  <p className="mt-0.5 text-sm text-accent">{item.detail}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-text">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-accent">
              Fill out the form below and our team will get back to you shortly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

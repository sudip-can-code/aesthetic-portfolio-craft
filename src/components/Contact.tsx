
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Github, Linkedin, Instagram } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="section bg-background text-foreground">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss a collaboration? Feel free to reach out.
            I'm always interested in new projects and creative challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">sudeepsnwr8@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm">9840401157</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-sm">Kathmandu, Nepal</p>
                </div>
              </div>

              <div className="pt-6">
                <h4 className="text-base font-semibold mb-3">Connect with me</h4>
                <div className="flex space-x-4">
                  <a href="https://github.com/sudip-can-code" target="_blank" rel="noopener noreferrer" 
                     className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
                    <Github size={20} />
                  </a>
                  <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer"
                     className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
                    <Linkedin size={20} />
                  </a>
                  <a href="https://www.instagram.com/mr_jijicha?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                     target="_blank" rel="noopener noreferrer"
                     className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="bg-muted/50 border-border"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                type="email"
                required
                className="bg-muted/50 border-border"
              />
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="bg-muted/50 border-border"
              />
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                className="bg-muted/50 border-border min-h-32"
              />
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Send Message →
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

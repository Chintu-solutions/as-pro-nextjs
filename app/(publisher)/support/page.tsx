"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Phone, Mail, FileQuestion } from "lucide-react";

const faqs = [
  {
    question: "How do I add a new website?",
    answer: "Go to the Websites section and click on 'Add Website'. Follow the verification steps to complete the process.",
  },
  {
    question: "When are payouts processed?",
    answer: "Payouts are processed on the 25th of each month for balances over $100.",
  },
  {
    question: "How is my website's performance tracked?",
    answer: "We use advanced analytics to track visitors, engagement, and earnings in real-time.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support bank transfers, PayPal, and cryptocurrency payments.",
  },
];

export default function SupportPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add support ticket submission logic here
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team
            </p>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Call us at +1 (555) 123-4567
            </p>
            <Button variant="outline" className="w-full">
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              support@adnetwork.com
            </p>
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit a Support Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter the subject of your inquiry" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail"
                className="min-h-[150px]"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
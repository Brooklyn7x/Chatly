"use client";


import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export default function FAQsTwo() {
  const faqItems = [
    {
      id: "item-1",
      question: "Is Chatly free to use?",
      answer:
        "Yes! Chatly offers a free plan with unlimited 1:1 and group messaging. Premium features are available for teams and businesses.",
    },
    {
      id: "item-2",
      question: "How secure is my data on Chatly?",
      answer:
        "Your privacy is our top priority. All messages are encrypted in transit and at rest. For sensitive conversations, you can enable end-to-end encryption.",
    },
    {
      id: "item-3",
      question: "Can I use Chatly on my phone and computer?",
      answer:
        "Absolutely! Chatly works seamlessly on web, iOS, and Android. Your chats stay in sync across all your devices.",
    },
    {
      id: "item-4",
      question: "Does Chatly support file and image sharing?",
      answer:
        "Yes, you can share images, documents, and other files directly in your chats. All shared files are securely stored.",
    },
    {
      id: "item-5",
      question: "How do I get support if I have an issue?",
      answer:
        "You can reach our support team 24/7 via the in-app help center or by emailing support@chatly.com. We’re here to help!",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Find answers to common questions about Chatly’s features, security,
            and support.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Can&apos;t find what you&apos;re looking for? Contact our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              support team
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

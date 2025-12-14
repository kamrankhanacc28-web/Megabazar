import { BlueprintData } from './types';

export const APP_NAME = "Vanguard Launchpad";

export const INITIAL_BLUEPRINT: BlueprintData = {
  phases: [
    {
      id: 0,
      title: "Phase 1: Foundation & Setup",
      subtitle: "Platform Architecture",
      categories: [
        {
          title: "Google Sites Configuration",
          tasks: [
            {
              id: "p1-c1-t1",
              title: "Create Google Site",
              description: "Select 'Business' template, set site name, and connect custom domain (.com.pk or .com).",
              completed: false
            },
            {
              id: "p1-c1-t2",
              title: "Branding Setup",
              description: "Upload logo, favicon, and set theme colors (Primary/Secondary). Configure fonts (Roboto/Open Sans).",
              completed: false
            }
          ]
        },
        {
          title: "Ecwid Integration",
          tasks: [
            {
              id: "p1-c2-t1",
              title: "Setup Ecwid Store",
              description: "Create account, set currency to PKR, tax settings to Pakistan GST, and timezone to PKT.",
              completed: false
            },
            {
              id: "p1-c2-t2",
              title: "Embed Store",
              description: "Embed Ecwid code into Google Sites (Full Store, Single Product, or Cart functionality).",
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 1,
      title: "Phase 2: Product & Inventory",
      subtitle: "Catalog Management",
      categories: [
        {
          title: "Product Management",
          tasks: [
            {
              id: "p2-c1-t1",
              title: "Add Products",
              description: "Add title (En/Urdu), bulleted description, high-quality images, SKU, and weight.",
              completed: false,
              aiPrompt: "Write a high-converting product description for a [Product Name]. Include 5 bullet points highlighting benefits, specifications, and a call to action. Tone: Professional and persuasive.",
              aiActionLabel: "Generate Description"
            },
            {
              id: "p2-c1-t2",
              title: "Bulk Upload",
              description: "Use CSV template to upload 100+ products efficiently.",
              completed: false
            }
          ]
        },
        {
          title: "Inventory Control",
          tasks: [
            {
              id: "p2-c2-t1",
              title: "Configure Stock Tracking",
              description: "Enable low stock alerts (5 units) and auto-hide out-of-stock items.",
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Phase 3: Payments & Shipping",
      subtitle: "Pakistan Logistics",
      categories: [
        {
          title: "Payment Gateways",
          tasks: [
            {
              id: "p3-c1-t1",
              title: "EasyPaisa & JazzCash",
              description: "Integrate Merchant accounts or setup manual payment instructions/links.",
              completed: false
            },
            {
              id: "p3-c1-t2",
              title: "Bank Transfer & COD",
              description: "Display bank details (IBAN/Branch) and enable Cash on Delivery with terms.",
              completed: false
            }
          ]
        },
        {
          title: "Shipping Configuration",
          tasks: [
            {
              id: "p3-c2-t1",
              title: "Set Delivery Areas",
              description: "Define rates for Lahore, Karachi, Islamabad, and Remote areas.",
              completed: false
            },
            {
              id: "p3-c2-t2",
              title: "Courier Integration",
              description: "Partner with TCS, Leopard, or Trax. Set up manual shipping calculation.",
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Phase 4: Site Structure",
      subtitle: "Pages & UX",
      categories: [
        {
          title: "Essential Pages",
          tasks: [
            {
              id: "p4-c1-t1",
              title: "Build Homepage",
              description: "Hero Banner, Featured Categories, Best Sellers, and Special Offers sections.",
              completed: false
            },
            {
              id: "p4-c1-t2",
              title: "Create Legal Pages",
              description: "Privacy Policy, Shipping Policy, Returns & Refunds, Terms of Service.",
              completed: false,
              aiPrompt: "Generate a Refund & Returns Policy for a Pakistani e-commerce store. Stipulate a 7-day return window, condition of items, and process for contacting support via WhatsApp.",
              aiActionLabel: "Draft Policies"
            },
            {
              id: "p4-c1-t3",
              title: "About & Contact",
              description: "Brand story, Trust badges, Google Maps embed, and Contact Form.",
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Phase 5: Marketing Engine",
      subtitle: "Growth & Automation",
      categories: [
        {
          title: "Automation",
          tasks: [
            {
              id: "p5-c1-t1",
              title: "Email & SMS",
              description: "Setup Mailchimp (Welcome, Order Confirm) and SMS API (Telenor/Jazz) for alerts.",
              completed: false
            },
            {
              id: "p5-c1-t2",
              title: "Social Auto-Posting",
              description: "Configure Buffer/Hootsuite for daily product updates.",
              completed: false
            }
          ]
        },
        {
          title: "Traffic Acquisition",
          tasks: [
            {
              id: "p5-c2-t1",
              title: "SEO Optimization",
              description: "Optimize page titles, meta descriptions, and image alt tags for local keywords.",
              completed: false,
              aiPrompt: "Generate a list of 20 high-traffic SEO keywords for an online store in Pakistan selling [Category]. Focus on intent like 'buy online', 'price in Pakistan', and 'cash on delivery'.",
              aiActionLabel: "Keyword Research"
            },
            {
              id: "p5-c2-t2",
              title: "WhatsApp Commerce",
              description: "Add WhatsApp chat widget, build Business Catalog, and set up quick replies.",
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Phase 6: Launch Protocol",
      subtitle: "Go-Live Checklist",
      categories: [
        {
          title: "Pre-Launch",
          tasks: [
            { id: "p6-c1-t1", title: "Test Orders", description: "Verify full checkout flow, payment processing, and email notifications.", completed: false },
            { id: "p6-c1-t2", title: "Mobile Audit", description: "Ensure responsive design and fast loading on mobile networks.", completed: false }
          ]
        },
        {
          title: "Launch Day",
          tasks: [
            { id: "p6-c2-t1", title: "Marketing Blast", description: "Social media announcements, WhatsApp broadcast, Email list send.", completed: false },
            { id: "p6-c2-t2", title: "Monitor Operations", description: "Track real-time analytics and respond to incoming inquiries immediately.", completed: false }
          ]
        }
      ]
    }
  ]
};
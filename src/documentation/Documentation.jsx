import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  FileText,
  Globe2,
  Layers3,
  LockKeyhole,
  Map,
  Menu,
  MessageSquare,
  Package,
  PanelLeft,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

/* =========================================================
   STOCKLINKER DOCUMENTATION
   Single-page product documentation
   ========================================================= */

const DOCUMENTATION = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    icon: BookOpen,
    description:
      "Understand StockLinker, the problem it solves, the platform workflow, and the roles that use the system.",
    sections: [
      {
        id: "what-is-stocklinker",
        title: "What is StockLinker?",
        eyebrow: "Platform Overview",
        content: (
          <>
            <p>
              StockLinker is a B2B wholesale commerce and product discovery
              platform designed to connect shopkeepers with wholesalers and
              make wholesale product discovery, seller comparison,
              communication, and ordering more structured.
            </p>

            <p>
              Instead of requiring a shopkeeper to search for suppliers
              manually, compare different sources independently, and manage
              communication through disconnected channels, StockLinker brings
              these activities into one connected platform experience.
            </p>

            <p>
              The platform is built around a simple business relationship:
              shopkeepers need products, quantities, suitable prices, and
              reliable suppliers; wholesalers need a structured way to
              present products, manage buyer relationships, receive orders,
              and process business enquiries.
            </p>
          </>
        ),
        highlights: [
          "B2B wholesale product discovery",
          "Shopkeeper and wholesaler workflows",
          "Product and seller discovery",
          "Price and quantity comparison",
          "Order management",
          "Business communication",
        ],
      },
      {
        id: "problem-solved",
        title: "The Problem StockLinker Solves",
        eyebrow: "Why StockLinker Exists",
        content: (
          <>
            <p>
              Traditional wholesale purchasing can involve searching through
              multiple suppliers, calling different businesses, asking for
              prices, checking minimum quantities, and manually tracking
              orders.
            </p>

            <p>
              This creates fragmented information and makes it difficult for
              buyers to quickly understand which supplier is suitable for a
              particular product and quantity.
            </p>

            <p>
              StockLinker addresses this fragmentation by bringing product
              discovery, seller discovery, pricing information, quantity
              validation, enquiries, messaging, and order workflows into a
              single platform.
            </p>
          </>
        ),
        steps: [
          {
            title: "Discover",
            text: "Find products and relevant wholesale sellers.",
          },
          {
            title: "Compare",
            text: "Review available seller options, pricing, and quantity requirements.",
          },
          {
            title: "Connect",
            text: "Communicate with sellers through enquiries and messaging.",
          },
          {
            title: "Order",
            text: "Create and manage wholesale orders.",
          },
          {
            title: "Track",
            text: "Follow order and delivery progress.",
          },
        ],
      },
      {
        id: "how-stocklinker-works",
        title: "How StockLinker Works",
        eyebrow: "Core Workflow",
        content: (
          <>
            <p>
              StockLinker follows a connected discovery-to-order workflow.
              The exact experience depends on the user's role, but the
              platform is designed around the same core business flow.
            </p>
          </>
        ),
        flow: [
          "Account",
          "Role",
          "Onboarding",
          "Discovery",
          "Seller",
          "Communication",
          "Order",
          "Delivery",
          "Invoice",
        ],
      },
      {
        id: "platform-roles",
        title: "Platform Roles",
        eyebrow: "Users",
        content: (
          <>
            <p>
              StockLinker primarily supports two business roles: Shopkeeper
              and Wholesaler.
            </p>

            <p>
              The role determines the user's business workflow, available
              features, permissions, and the type of information presented
              throughout the application.
            </p>
          </>
        ),
        roleCards: [
          {
            icon: Store,
            title: "Shopkeeper",
            text: "Discovers products and sellers, compares purchasing options, communicates with suppliers, and manages orders.",
          },
          {
            icon: Building2,
            title: "Wholesaler",
            text: "Manages wholesale products, pricing, buyer relationships, enquiries, orders, and business coverage.",
          },
        ],
      },
    ],
  },

  {
    id: "getting-started",
    number: "02",
    title: "Getting Started",
    icon: Zap,
    description:
      "Learn how users enter StockLinker, authenticate, select their business role, and complete onboarding.",
    sections: [
      {
        id: "account-creation",
        title: "Account Creation",
        eyebrow: "Getting Started",
        content: (
          <>
            <p>
              StockLinker supports an account lifecycle where a user can
              initially authenticate and then complete the information
              required for their business role.
            </p>

            <p>
              A newly authenticated user does not necessarily have a fully
              configured business profile immediately. The platform can guide
              the user through role selection and onboarding before allowing
              access to role-specific workflows.
            </p>
          </>
        ),
      },
      {
        id: "google-login",
        title: "Google Authentication",
        eyebrow: "Authentication",
        content: (
          <>
            <p>
              StockLinker supports Google OAuth authentication. This allows a
              user to authenticate through their Google account rather than
              manually creating and remembering another password.
            </p>

            <p>
              After successful authentication, StockLinker determines whether
              the user already has an account and whether additional setup is
              required.
            </p>
          </>
        ),
        steps: [
          {
            title: "Authenticate",
            text: "The user starts Google authentication.",
          },
          {
            title: "Verify",
            text: "The backend receives and validates the authenticated identity.",
          },
          {
            title: "Account",
            text: "An existing account is loaded or a new account is initialized.",
          },
          {
            title: "Continue",
            text: "The user continues to role selection or the appropriate application area.",
          },
        ],
      },
      {
        id: "phone-otp",
        title: "Phone OTP Authentication",
        eyebrow: "Authentication",
        content: (
          <>
            <p>
              StockLinker also supports phone-based authentication using a
              one-time password workflow.
            </p>

            <p>
              The user enters a phone number, receives an OTP, and submits the
              verification code. The application validates the verification
              result before establishing an authenticated session.
            </p>

            <p>
              Firebase services are used as part of the phone verification
              flow.
            </p>
          </>
        ),
        steps: [
          {
            title: "Enter phone number",
            text: "The user provides the phone number used for authentication.",
          },
          {
            title: "Send OTP",
            text: "The verification process sends a one-time verification code.",
          },
          {
            title: "Verify OTP",
            text: "The submitted code is validated.",
          },
          {
            title: "Create or load account",
            text: "StockLinker continues with the user's account lifecycle.",
          },
        ],
      },
      {
        id: "guest-access",
        title: "Guest Access",
        eyebrow: "Entry",
        content: (
          <>
            <p>
              StockLinker can provide guest access for users who want to enter
              the platform before completing the normal account setup flow.
            </p>

            <p>
              Guest access is treated differently from a fully registered
              business account. Features that require an authenticated
              business identity can require the user to complete account
              setup before continuing.
            </p>
          </>
        ),
      },
      {
        id: "role-selection",
        title: "Role Selection",
        eyebrow: "Account Lifecycle",
        content: (
          <>
            <p>
              After authentication, a user can be required to select the
              business role they will operate under.
            </p>

            <p>
              The primary roles are <strong>Shopkeeper</strong> and{" "}
              <strong>Wholesaler</strong>.
            </p>

            <p>
              Role selection is important because StockLinker uses
              role-specific workflows and permissions throughout the
              application.
            </p>
          </>
        ),
        statusFlow: [
          "Authenticated",
          "Pending Role",
          "Role Selected",
          "Pending Onboarding",
          "Ready",
        ],
      },
      {
        id: "onboarding",
        title: "Onboarding",
        eyebrow: "Account Setup",
        content: (
          <>
            <p>
              Onboarding collects and establishes the information required to
              make the user's StockLinker experience useful for their selected
              business role.
            </p>

            <p>
              The onboarding state is separate from authentication. A user can
              be authenticated while still requiring role selection or
              onboarding.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "shopkeeper",
    number: "03",
    title: "Shopkeeper",
    icon: ShoppingBag,
    description:
      "Everything a shopkeeper can use to discover products, find sellers, communicate with suppliers, and manage purchases.",
    sections: [
      {
        id: "shopkeeper-dashboard",
        title: "Shopkeeper Dashboard",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              The Shopkeeper Dashboard acts as the operational starting point
              for a buyer using StockLinker.
            </p>

            <p>
              It brings together the most important activities a shopkeeper
              needs to perform, such as discovering products, finding sellers,
              reviewing orders, and accessing business communication.
            </p>
          </>
        ),
      },
      {
        id: "product-discovery",
        title: "Product Discovery",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              Product Discovery allows shopkeepers to search and explore
              products available through the StockLinker product ecosystem.
            </p>

            <p>
              Products can be organized using product master information,
              categories, and subcategories. The discovery experience is
              designed to help a buyer move from a product requirement toward
              suitable seller options.
            </p>

            <p>
              Product discovery is one of the first stages in the
              StockLinker purchasing workflow.
            </p>
          </>
        ),
        steps: [
          {
            title: "Find a product",
            text: "Search or browse the available product catalog.",
          },
          {
            title: "Understand the product",
            text: "Review the product's master information and category context.",
          },
          {
            title: "Check sellers",
            text: "Continue toward sellers offering the relevant product.",
          },
          {
            title: "Compare",
            text: "Review available purchasing options.",
          },
          {
            title: "Continue",
            text: "Communicate with the seller or create an order.",
          },
        ],
      },
      {
        id: "product-categories",
        title: "Product Categories",
        eyebrow: "Product Discovery",
        content: (
          <>
            <p>
              StockLinker uses categories and subcategories to organize the
              product catalog into meaningful business groups.
            </p>

            <p>
              This structure makes product discovery easier and gives the
              platform a consistent way to classify products across sellers.
            </p>

            <p>
              A category represents a broad product group, while a
              subcategory provides a more specific classification.
            </p>
          </>
        ),
      },
      {
        id: "compare-prices",
        title: "Compare Prices",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              Compare Prices helps shopkeepers evaluate available seller
              options for a selected product.
            </p>

            <p>
              Instead of treating a product as having only one universal
              price, StockLinker can evaluate seller-specific product
              information and purchasing requirements.
            </p>

            <p>
              This is particularly important in wholesale commerce because
              the suitable option depends not only on price but also on
              quantity requirements and seller availability.
            </p>
          </>
        ),
        highlights: [
          "Seller-specific product options",
          "Pricing comparison",
          "Quantity requirements",
          "Seller availability",
          "Purchase decision support",
        ],
      },
      {
        id: "seller-discovery",
        title: "Seller Discovery",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              Seller Discovery connects a shopkeeper's product requirement
              with wholesalers who can potentially supply that product.
            </p>

            <p>
              The purpose is to reduce the effort required to identify
              suitable suppliers and provide a structured way to evaluate
              seller options.
            </p>
          </>
        ),
      },
      {
        id: "shopkeeper-orders",
        title: "Shopkeeper Orders",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              Shopkeepers can create and manage wholesale orders through the
              Orders workflow.
            </p>

            <p>
              An order represents the buyer's purchasing request and contains
              one or more order items. Each item represents a selected product
              and its requested quantity.
            </p>

            <p>
              The order workflow is connected to product discovery, seller
              selection, order status, delivery status, and invoice
              information.
            </p>
          </>
        ),
      },
      {
        id: "order-tracking",
        title: "Order Tracking",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              Order Tracking gives the shopkeeper visibility into the current
              state of an order after it has been created.
            </p>

            <p>
              StockLinker separates the business order state from delivery
              progress so that users can understand both the processing state
              and the physical delivery state.
            </p>
          </>
        ),
        statusFlow: [
          "Order Created",
          "Order Processing",
          "Order Confirmed",
          "Delivery Processing",
          "Out for Delivery",
          "Delivered",
        ],
      },
      {
        id: "shopkeeper-invoices",
        title: "Invoices",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              The invoice represents the commercial summary associated with an
              order.
            </p>

            <p>
              StockLinker's order and invoice concepts are designed to keep
              purchase information organized and accessible to the buyer.
            </p>

            <p>
              The platform does not require online payment processing as part
              of this workflow. The business model can support offline
              payment arrangements between the parties.
            </p>
          </>
        ),
      },
      {
        id: "shopkeeper-enquiries",
        title: "Enquiries",
        eyebrow: "Communication",
        content: (
          <>
            <p>
              Enquiries provide a structured way for a shopkeeper to ask a
              wholesaler about products, availability, pricing, quantities, or
              other business-related requirements.
            </p>

            <p>
              An enquiry is useful when the buyer needs clarification before
              committing to an order.
            </p>
          </>
        ),
      },
      {
        id: "shopkeeper-messages",
        title: "Messages",
        eyebrow: "Communication",
        content: (
          <>
            <p>
              StockLinker includes in-app messaging for buyer and supplier
              communication.
            </p>

            <p>
              The messaging experience allows users to communicate within the
              application rather than moving every business conversation to an
              external messaging platform.
            </p>
          </>
        ),
      },
      {
        id: "shopkeeper-settings",
        title: "Profile & Settings",
        eyebrow: "Shopkeeper",
        content: (
          <>
            <p>
              Profile and settings provide the shopkeeper with access to their
              account information and configurable application preferences.
            </p>

            <p>
              Account settings are separate from the core purchasing workflow,
              allowing users to manage their profile without disrupting product
              discovery or order operations.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "wholesaler",
    number: "04",
    title: "Wholesaler",
    icon: Building2,
    description:
      "Understand the wholesaler workflow for managing products, buyers, orders, communication, and seller coverage.",
    sections: [
      {
        id: "wholesaler-dashboard",
        title: "Wholesaler Dashboard",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              The Wholesaler Dashboard provides the operational view required
              to manage wholesale business activity inside StockLinker.
            </p>

            <p>
              It is centered around products, buyer relationships, enquiries,
              orders, communication, and business coverage.
            </p>
          </>
        ),
      },
      {
        id: "product-management",
        title: "Product Management",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Wholesalers can manage the products they make available through
              the StockLinker marketplace.
            </p>

            <p>
              The product system separates the global product definition from
              seller-specific product information. This allows the same
              product concept to be associated with different sellers while
              retaining seller-specific business information.
            </p>
          </>
        ),
        architecture: [
          "Product Master",
          "Category",
          "Subcategory",
          "Seller Product",
          "Seller-specific Pricing",
          "Quantity / MOQ",
        ],
      },
      {
        id: "wholesaler-pricing",
        title: "Pricing",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Seller pricing is associated with the wholesaler's product
              offering rather than being treated as a universal product
              attribute.
            </p>

            <p>
              This distinction allows StockLinker to support product discovery
              across multiple sellers while preserving seller-specific
              commercial information.
            </p>
          </>
        ),
      },
      {
        id: "buyer-management",
        title: "Buyer / Seller Management",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Wholesalers interact with buyers through enquiries, messages,
              and orders.
            </p>

            <p>
              These interactions create a connected business workflow where
              product discovery can lead to communication and eventually to an
              order.
            </p>
          </>
        ),
      },
      {
        id: "wholesaler-orders",
        title: "Wholesaler Orders",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Orders received by a wholesaler represent purchasing requests
              from shopkeepers.
            </p>

            <p>
              The wholesaler can review the order details, process the order,
              and update the appropriate order and delivery states according
              to the business workflow.
            </p>
          </>
        ),
      },
      {
        id: "order-processing",
        title: "Order Processing",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Order Processing is the operational side of the order lifecycle
              for the supplier.
            </p>

            <p>
              The wholesaler reviews the requested products and quantities,
              handles the order according to the business process, and
              progresses the order toward delivery.
            </p>
          </>
        ),
      },
      {
        id: "wholesaler-enquiries",
        title: "Wholesaler Enquiries",
        eyebrow: "Communication",
        content: (
          <>
            <p>
              Wholesalers can receive and respond to buyer enquiries.
            </p>

            <p>
              Enquiries are particularly useful before an order exists because
              they allow both parties to clarify product or purchasing
              requirements first.
            </p>
          </>
        ),
      },
      {
        id: "wholesaler-messages",
        title: "Wholesaler Messages",
        eyebrow: "Communication",
        content: (
          <>
            <p>
              The messaging system allows wholesalers to communicate directly
              with buyers inside StockLinker.
            </p>
          </>
        ),
      },
      {
        id: "seller-coverage",
        title: "Seller Coverage",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Seller Coverage represents the geographical area in which a
              wholesaler can serve or operate.
            </p>

            <p>
              StockLinker can use location information such as district,
              latitude, and longitude to represent coverage geographically.
            </p>

            <p>
              This information supports seller discovery and location-aware
              business workflows.
            </p>
          </>
        ),
      },
      {
        id: "business-settings",
        title: "Business Settings",
        eyebrow: "Wholesaler",
        content: (
          <>
            <p>
              Business Settings allow a wholesaler to maintain the information
              associated with their business presence on StockLinker.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "products",
    number: "05",
    title: "Products",
    icon: Package,
    description:
      "Learn how StockLinker structures products, categories, seller products, pricing, quantity requirements, and discovery.",
    sections: [
      {
        id: "product-master",
        title: "Product Master",
        eyebrow: "Product Architecture",
        content: (
          <>
            <p>
              The Product Master represents the canonical definition of a
              product within StockLinker.
            </p>

            <p>
              It provides a stable product identity that can be used when
              different sellers offer the same or related product.
            </p>

            <p>
              This architecture prevents the product catalog from becoming
              completely dependent on an individual seller's record.
            </p>
          </>
        ),
        architecture: [
          "Product identity",
          "Product name",
          "Category relationship",
          "Subcategory relationship",
          "Shared product information",
        ],
      },
      {
        id: "categories-subcategories",
        title: "Categories & Subcategories",
        eyebrow: "Product Architecture",
        content: (
          <>
            <p>
              Categories provide high-level organization for the product
              catalog. Subcategories provide more specific classification
              within those categories.
            </p>

            <p>
              This hierarchy supports both browsing and structured product
              discovery.
            </p>
          </>
        ),
        flow: ["Category", "Subcategory", "Product Master", "Seller Product"],
      },
      {
        id: "seller-products",
        title: "Seller Products",
        eyebrow: "Product Architecture",
        content: (
          <>
            <p>
              A Seller Product represents a seller's offering of a product.
            </p>

            <p>
              The seller-specific record is important because pricing,
              availability, minimum quantity, and other commercial information
              can differ between wholesalers even when they offer the same
              product.
            </p>
          </>
        ),
      },
      {
        id: "product-pricing",
        title: "Product Pricing",
        eyebrow: "Commercial Data",
        content: (
          <>
            <p>
              Pricing belongs to the seller's product offering so that
              StockLinker can support multiple wholesalers offering the same
              product at different prices.
            </p>

            <p>
              This seller-specific structure is what makes price comparison
              meaningful.
            </p>
          </>
        ),
      },
      {
        id: "quantity-moq",
        title: "Quantity & Minimum Order Quantity",
        eyebrow: "Commercial Rules",
        content: (
          <>
            <p>
              Wholesale purchasing frequently depends on quantity. A seller
              may not accept every requested quantity, so StockLinker treats
              quantity requirements as part of the seller-product purchasing
              logic.
            </p>

            <p>
              Minimum Order Quantity, commonly called MOQ, represents the
              minimum quantity that a seller requires for the product.
            </p>
          </>
        ),
      },
      {
        id: "quantity-validation",
        title: "Quantity Validation",
        eyebrow: "Business Rule",
        content: (
          <>
            <p>
              When a shopkeeper requests a quantity, StockLinker evaluates
              available seller options instead of assuming that every seller
              can satisfy the requested amount.
            </p>

            <p>
              If no suitable seller can satisfy the requested quantity, the
              application can inform the user that the requested quantity is
              unavailable and provide the applicable minimum quantity
              information.
            </p>
          </>
        ),
      },
      {
        id: "product-discovery-architecture",
        title: "Product Discovery Architecture",
        eyebrow: "Discovery",
        content: (
          <>
            <p>
              Product discovery connects the product catalog with seller
              offerings. A shopkeeper begins with a product requirement and
              can progress toward seller-specific options.
            </p>
          </>
        ),
        flow: [
          "Search / Browse",
          "Product Master",
          "Category Context",
          "Seller Products",
          "Pricing",
          "Quantity Validation",
          "Seller Selection",
        ],
      },
    ],
  },

  {
    id: "seller-discovery",
    number: "06",
    title: "Seller Discovery",
    icon: Map,
    description:
      "Understand nearby sellers, district discovery, coverage mapping, and geographical information.",
    sections: [
      {
        id: "nearby-sellers",
        title: "Nearby Sellers",
        eyebrow: "Seller Discovery",
        content: (
          <>
            <p>
              Nearby Seller Discovery helps a shopkeeper identify relevant
              wholesalers based on geographical context.
            </p>

            <p>
              The purpose is to make supplier discovery more practical by
              considering where sellers operate instead of presenting the
              entire seller ecosystem without context.
            </p>
          </>
        ),
      },
      {
        id: "district-discovery",
        title: "District Discovery",
        eyebrow: "Seller Discovery",
        content: (
          <>
            <p>
              District Discovery organizes seller discovery around geographic
              districts.
            </p>

            <p>
              This is useful for a business platform operating across regions
              where buyers may naturally search for suppliers based on their
              district or nearby commercial area.
            </p>
          </>
        ),
      },
      {
        id: "coverage-map",
        title: "Seller Coverage Map",
        eyebrow: "Geographic Discovery",
        content: (
          <>
            <p>
              The Seller Coverage Map provides a geographical representation
              of seller coverage.
            </p>

            <p>
              It can be used to visualize where wholesalers operate and help
              users understand seller availability geographically.
            </p>
          </>
        ),
      },
      {
        id: "latitude-longitude",
        title: "Latitude & Longitude",
        eyebrow: "Location Data",
        content: (
          <>
            <p>
              Latitude and longitude are geographic coordinates used to
              represent a location on the Earth's surface.
            </p>

            <p>
              In StockLinker, geographical coordinates can support seller
              location, coverage visualization, nearby seller discovery, and
              map-based experiences.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Latitude
                </div>
                <p className="mt-2 text-[14px] leading-6 text-zinc-700">
                  Represents north/south position relative to the equator.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Longitude
                </div>
                <p className="mt-2 text-[14px] leading-6 text-zinc-700">
                  Represents east/west position relative to the prime
                  meridian.
                </p>
              </div>
            </div>
          </>
        ),
      },
    ],
  },

  {
    id: "orders",
    number: "07",
    title: "Orders",
    icon: ClipboardList,
    description:
      "Complete explanation of order creation, order items, status management, delivery tracking, lifecycle, and invoices.",
    sections: [
      {
        id: "creating-order",
        title: "Creating an Order",
        eyebrow: "Order Management",
        content: (
          <>
            <p>
              An order is created when a shopkeeper decides to purchase
              products from a suitable wholesaler.
            </p>

            <p>
              The order is created from the selected seller and requested
              product quantities. The system validates the relevant business
              requirements before the order is finalized.
            </p>
          </>
        ),
        steps: [
          {
            title: "Select product",
            text: "The shopkeeper identifies the required product.",
          },
          {
            title: "Select seller",
            text: "A suitable wholesaler is selected from available seller options.",
          },
          {
            title: "Specify quantity",
            text: "The buyer enters the required quantity.",
          },
          {
            title: "Validate",
            text: "The system checks whether the seller can satisfy the requested quantity.",
          },
          {
            title: "Create order",
            text: "The order and its items are created.",
          },
        ],
      },
      {
        id: "order-items",
        title: "Order Items",
        eyebrow: "Order Structure",
        content: (
          <>
            <p>
              An order can contain multiple order items. Each order item
              represents a product included in the purchase.
            </p>

            <p>
              Separating the order from its items allows one order to represent
              a complete purchasing request while maintaining individual
              product and quantity information.
            </p>
          </>
        ),
        architecture: [
          "Order",
          "Order Item",
          "Product",
          "Quantity",
          "Seller",
          "Commercial information",
        ],
      },
      {
        id: "order-status",
        title: "Order Status",
        eyebrow: "Order Lifecycle",
        content: (
          <>
            <p>
              Order Status represents the business processing state of an
              order.
            </p>

            <p>
              It answers the question: <strong>What is happening with the
              order itself?</strong>
            </p>
          </>
        ),
        statusFlow: [
          "Pending",
          "Confirmed",
          "Processing",
          "Completed",
          "Cancelled",
        ],
      },
      {
        id: "delivery-status",
        title: "Delivery Status",
        eyebrow: "Order Lifecycle",
        content: (
          <>
            <p>
              Delivery Status represents the movement of the order toward the
              buyer.
            </p>

            <p>
              Separating delivery status from order status makes it possible
              to represent business processing and delivery progress
              independently.
            </p>
          </>
        ),
        statusFlow: [
          "Pending",
          "Processing",
          "Out for Delivery",
          "Delivered",
        ],
      },
      {
        id: "order-lifecycle",
        title: "Order Lifecycle",
        eyebrow: "Complete Workflow",
        content: (
          <>
            <p>
              The complete StockLinker order lifecycle connects product
              discovery, seller selection, quantity validation, order
              creation, processing, delivery, and completion.
            </p>
          </>
        ),
        flow: [
          "Product Discovery",
          "Seller Selection",
          "Quantity Validation",
          "Order Creation",
          "Order Processing",
          "Delivery",
          "Completion",
          "Invoice",
        ],
      },
      {
        id: "invoice",
        title: "Invoice",
        eyebrow: "Order Documentation",
        content: (
          <>
            <p>
              An invoice provides a structured commercial representation of an
              order.
            </p>

            <p>
              It allows the buyer and supplier to retain a clear record of the
              purchased products and associated order information.
            </p>

            <p>
              StockLinker does not require online payment processing as part
              of the order workflow. Payment arrangements can remain offline
              between the buyer and seller.
            </p>
          </>
        ),
      },
    ],
  },

  {
    id: "communication",
    number: "08",
    title: "Communication",
    icon: MessageSquare,
    description:
      "Understand enquiries, messaging, and direct supplier-to-buyer communication inside StockLinker.",
    sections: [
      {
        id: "enquiries",
        title: "Enquiries",
        eyebrow: "Communication",
        content: (
          <>
            <p>
              An enquiry is a business communication initiated when a user
              needs information before moving forward with a purchase.
            </p>

            <p>
              Examples include asking about product availability, pricing,
              quantity requirements, or other supplier-specific information.
            </p>
          </>
        ),
      },
      {
        id: "chat-messages",
        title: "Chat & Messages",
        eyebrow: "Communication",
        content: (
          <>
            <p>
              StockLinker provides an in-app messaging experience for
              communication between buyers and suppliers.
            </p>

            <p>
              The messaging feature is designed for business conversations
              associated with the StockLinker platform.
            </p>

            <p>
              Messages are represented as application data and can be
              associated with the users participating in the conversation.
            </p>
          </>
        ),
      },
      {
        id: "buyer-supplier-communication",
        title: "Supplier ↔ Buyer Communication",
        eyebrow: "Business Communication",
        content: (
          <>
            <p>
              Communication connects the discovery workflow with the
              purchasing workflow.
            </p>

            <p>
              A buyer can discover a supplier, ask questions, communicate
              through messages, and then continue toward an order when the
              purchasing requirements are understood.
            </p>
          </>
        ),
        flow: [
          "Discover Seller",
          "Send Enquiry",
          "Discuss Requirement",
          "Confirm Details",
          "Create Order",
        ],
      },
    ],
  },

  {
    id: "account-security",
    number: "09",
    title: "Account & Security",
    icon: ShieldCheck,
    description:
      "Detailed overview of authentication, JWT, access and refresh tokens, device sessions, RBAC, and security.",
    sections: [
      {
        id: "authentication",
        title: "Authentication",
        eyebrow: "Security",
        content: (
          <>
            <p>
              Authentication establishes the identity of the user interacting
              with StockLinker.
            </p>

            <p>
              StockLinker supports Google OAuth authentication, phone OTP
              authentication, and guest access as part of its account-entry
              architecture.
            </p>

            <p>
              Authentication is separate from authorization. Authentication
              answers who the user is; authorization determines what that user
              is allowed to do.
            </p>
          </>
        ),
      },
      {
        id: "jwt-authentication",
        title: "JWT Authentication",
        eyebrow: "Security Architecture",
        content: (
          <>
            <p>
              StockLinker uses JSON Web Tokens as part of its authenticated
              request architecture.
            </p>

            <p>
              The authenticated identity can be represented through claims
              such as user identity, email, roles, permissions, device
              information, token type, issued time, expiry time, and issuer.
            </p>

            <p>
              The backend validates the token before allowing protected
              requests to continue.
            </p>
          </>
        ),
        architecture: [
          "User identity",
          "Email",
          "Roles",
          "Permissions",
          "Device identity",
          "Token type",
          "Issued time",
          "Expiration",
          "Issuer",
        ],
      },
      {
        id: "access-tokens",
        title: "Access Tokens",
        eyebrow: "Token Architecture",
        content: (
          <>
            <p>
              Access tokens are short-lived credentials used to authorize
              authenticated API requests.
            </p>

            <p>
              In the current StockLinker authentication design, the access
              token lifetime is intentionally short compared with the refresh
              token lifetime. This reduces the impact of a compromised access
              credential.
            </p>
          </>
        ),
        highlights: [
          "Short-lived authentication",
          "Protected API access",
          "JWT validation",
          "Role and permission claims",
          "Device-aware validation",
        ],
      },
      {
        id: "refresh-tokens",
        title: "Refresh Tokens",
        eyebrow: "Token Architecture",
        content: (
          <>
            <p>
              Refresh tokens allow an authenticated session to obtain a new
              access token without requiring the user to authenticate again
              after every short access-token expiration.
            </p>

            <p>
              StockLinker's design stores a secure representation of refresh
              tokens and supports token rotation.
            </p>

            <p>
              Refresh tokens are associated with the user's device/session
              context so that session management can be handled more safely.
            </p>
          </>
        ),
      },
      {
        id: "token-rotation",
        title: "Refresh Token Rotation",
        eyebrow: "Security",
        content: (
          <>
            <p>
              Refresh token rotation means that a refresh operation can issue
              a new refresh credential rather than allowing the same refresh
              token to remain indefinitely reusable.
            </p>

            <p>
              This strengthens session security and reduces the useful
              lifetime of a leaked refresh credential.
            </p>
          </>
        ),
      },
      {
        id: "device-sessions",
        title: "Device Sessions",
        eyebrow: "Session Security",
        content: (
          <>
            <p>
              StockLinker maintains device/session context as part of its
              authentication architecture.
            </p>

            <p>
              Device identity can be associated with authenticated tokens and
              session records. This allows the backend to detect situations
              where authentication credentials are being used from an
              unexpected device context.
            </p>

            <p>
              Active device sessions can be managed independently from the
              user's core account.
            </p>
          </>
        ),
      },
      {
        id: "rbac",
        title: "Role-Based Access Control",
        eyebrow: "Authorization",
        content: (
          <>
            <p>
              StockLinker uses role-based access control, commonly called
              RBAC, to determine which parts of the platform a user can
              access.
            </p>

            <p>
              The main business roles are Shopkeeper and Wholesaler.
            </p>

            <p>
              Roles can be associated with permissions, allowing the
              authorization model to distinguish between broad business roles
              and individual capabilities.
            </p>
          </>
        ),
        architecture: [
          "User",
          "Role",
          "Permission",
          "Role ↔ Permission",
          "Authenticated Request",
          "Authorization Decision",
        ],
      },
      {
        id: "security",
        title: "Security Architecture",
        eyebrow: "Security",
        content: (
          <>
            <p>
              StockLinker's security architecture is designed around
              authenticated requests, token validation, device-aware session
              management, role-based authorization, secure cookies, and
              protected backend endpoints.
            </p>

            <p>
              The frontend should never be treated as the final authority for
              access control. Sensitive authorization decisions are enforced
              by the backend.
            </p>
          </>
        ),
        highlights: [
          "Authentication",
          "JWT validation",
          "Access-token expiration",
          "Refresh-token rotation",
          "Device session validation",
          "Role-based authorization",
          "Protected API endpoints",
        ],
      },
    ],
  },

  {
    id: "architecture",
    number: "10",
    title: "Platform Architecture",
    icon: Layers3,
    description:
      "Technical overview of StockLinker's frontend, backend, database, API, authentication architecture, and deployment.",
    sections: [
      {
        id: "frontend",
        title: "Frontend Architecture",
        eyebrow: "Technical Architecture",
        content: (
          <>
            <p>
              StockLinker's frontend is built using React with Vite.
            </p>

            <p>
              The application uses JavaScript, React components, hooks,
              client-side routing, Axios for API communication, and reusable
              UI components.
            </p>

            <p>
              Tailwind CSS is used for responsive styling and Framer Motion is
              used for interface animations and transitions.
            </p>
          </>
        ),
        architecture: [
          "React",
          "Vite",
          "JavaScript",
          "React Router",
          "Axios",
          "Tailwind CSS",
          "Framer Motion",
          "Lucide React",
        ],
      },
      {
        id: "backend",
        title: "Backend Architecture",
        eyebrow: "Technical Architecture",
        content: (
          <>
            <p>
              StockLinker's backend is built using Java and Spring Boot.
            </p>

            <p>
              Spring Security is responsible for authentication and
              authorization concerns, while the backend exposes REST APIs for
              frontend communication.
            </p>

            <p>
              The backend contains domain models, repositories, services,
              security components, authentication flows, order workflows,
              product management, communication features, and supporting
              infrastructure.
            </p>
          </>
        ),
        architecture: [
          "Java",
          "Spring Boot",
          "Spring Security",
          "Spring Data JPA",
          "REST APIs",
          "JWT",
          "OAuth2",
          "Service Layer",
          "Repository Layer",
        ],
      },
      {
        id: "database",
        title: "Database Architecture",
        eyebrow: "Data Layer",
        content: (
          <>
            <p>
              StockLinker's current relational database direction uses
              PostgreSQL.
            </p>

            <p>
              The relational structure is suitable for strongly connected
              business entities such as users, roles, permissions, products,
              categories, seller products, orders, order items, invoices,
              messages, and session records.
            </p>
          </>
        ),
        architecture: [
          "PostgreSQL",
          "Users",
          "Roles",
          "Permissions",
          "Products",
          "Categories",
          "Seller Products",
          "Orders",
          "Order Items",
          "Invoices",
          "Messages",
          "Device Sessions",
        ],
      },
      {
        id: "api",
        title: "REST API Architecture",
        eyebrow: "Backend Communication",
        content: (
          <>
            <p>
              The frontend communicates with the backend through HTTP APIs.
            </p>

            <p>
              Axios is used on the frontend to centralize API communication,
              authentication credentials, and response handling.
            </p>

            <p>
              Protected endpoints require valid authentication and
              authorization before backend business logic is executed.
            </p>
          </>
        ),
        flow: [
          "React UI",
          "Axios",
          "HTTP Request",
          "Security Filter",
          "Controller",
          "Service",
          "Repository",
          "PostgreSQL",
        ],
      },
      {
        id: "authentication-architecture",
        title: "Authentication Architecture",
        eyebrow: "Technical Security",
        content: (
          <>
            <p>
              The authentication architecture combines external identity
              providers and application-level session management.
            </p>

            <p>
              Google OAuth and phone OTP can establish the user's identity.
              The StockLinker backend then manages authenticated application
              sessions using access and refresh credentials.
            </p>
          </>
        ),
        flow: [
          "User",
          "Google / Phone Verification",
          "Backend Authentication",
          "JWT Access Token",
          "Refresh Token",
          "Protected API",
          "Authorization",
        ],
      },
      {
        id: "deployment",
        title: "Deployment",
        eyebrow: "Infrastructure",
        content: (
          <>
            <p>
              StockLinker is designed as a separately deployable frontend and
              backend application.
            </p>

            <p>
              The React/Vite frontend can be deployed to a static hosting
              platform, while the Spring Boot backend runs as a server
              application and connects to the production database.
            </p>

            <p>
              Environment variables are used to keep environment-specific
              configuration such as API URLs and database credentials outside
              the application source code.
            </p>
          </>
        ),
        architecture: [
          "React/Vite Frontend",
          "Spring Boot Backend",
          "PostgreSQL Database",
          "Production Environment Variables",
          "HTTPS",
          "CORS Configuration",
        ],
      },
    ],
  },
];

/* ---------------------------------------------------------
   Utility helpers
   --------------------------------------------------------- */

const ALL_SECTIONS = DOCUMENTATION.flatMap((category) =>
  category.sections.map((section) => ({
    ...section,
    categoryId: category.id,
    categoryTitle: category.title,
    categoryNumber: category.number,
  }))
);

const getSectionById = (id) =>
  ALL_SECTIONS.find((section) => section.id === id);

const getCategoryForSection = (sectionId) =>
  DOCUMENTATION.find((category) =>
    category.sections.some((section) => section.id === sectionId)
  );

const getFirstSectionId = () => ALL_SECTIONS[0]?.id;

const scrollToSection = (id, behavior = "smooth") => {
  const element = document.getElementById(id);

  if (!element) return;

  const offset = window.innerWidth < 1024 ? 92 : 108;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior,
  });
};

/* ---------------------------------------------------------
   Small reusable UI
   --------------------------------------------------------- */

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 shadow-sm">
      {children}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
      <span className="h-px w-5 bg-zinc-300" />
      {children}
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition hover:border-zinc-300">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
        <Icon size={18} strokeWidth={1.8} className="text-zinc-700" />
      </div>
      <h4 className="text-[15px] font-bold text-zinc-900">{title}</h4>
      <div className="mt-2 text-[14px] leading-6 text-zinc-600">{children}</div>
    </div>
  );
}

function StepList({ steps }) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      {steps.map((step, index) => (
        <div
          key={`${step.title}-${index}`}
          className={`flex gap-5 p-6 transition hover:bg-zinc-50/50 ${
            index !== steps.length - 1 ? "border-b border-zinc-100" : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[12px] font-bold text-white shadow-sm">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-zinc-900">{step.title}</h4>
            <p className="mt-1.5 text-[14px] leading-6 text-zinc-600">
              {step.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function HighlightGrid({ items }) {
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
        >
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-[14px] font-medium leading-6 text-zinc-800">{item}</span>
        </div>
      ))}
    </div>
  );
}

function ArchitectureList({ items }) {
  return (
    <div className="my-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
      <div className="mb-5 flex items-center gap-2">
        <Code2 size={16} className="text-zinc-400" />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
          Architecture
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-5 py-3.5 shadow-sm transition hover:border-zinc-300"
          >
            <span className="font-mono text-[11px] font-medium text-zinc-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[14px] font-semibold text-zinc-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Flow({ items }) {
  return (
    <div className="my-10 relative ml-2 md:ml-4">
      {/* Elegant vertical line */}
      <div className="absolute left-[19px] top-5 bottom-5 w-[2px] bg-zinc-100" />
      <div className="flex flex-col gap-6 relative">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="group relative flex items-center gap-5">
            {/* Node */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-zinc-900 text-white z-10 shadow-[0_0_0_1px_rgba(228,228,231,1)] transition-transform group-hover:scale-110">
              <span className="text-[12px] font-bold">{String(index + 1).padStart(2, "0")}</span>
            </div>
            {/* Content Card */}
            <div className="flex-1 max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md">
              <span className="text-[15px] font-semibold text-zinc-900">{item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusFlow({ items }) {
  return (
    <div className="my-8 flex flex-wrap gap-2.5 items-center">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          <span className="inline-flex items-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[13px] font-bold text-zinc-800 shadow-sm transition hover:border-zinc-300">
            {item}
          </span>
          {index !== items.length - 1 && (
            <span className="flex items-center text-zinc-300">
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function RoleCards({ cards }) {
  return (
    <div className="my-8 grid gap-5 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition hover:border-zinc-300"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md">
              <Icon size={20} strokeWidth={2} />
            </div>
            <h4 className="text-[16px] font-bold text-zinc-900">
              {card.title}
            </h4>
            <p className="mt-2.5 text-[14px] leading-6 text-zinc-600">
              {card.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   Sidebar
   --------------------------------------------------------- */

/* ---------------------------------------------------------
   Sidebar
   --------------------------------------------------------- */

function DocumentationSidebar({
  activeSection,
  onNavigate,
  searchQuery,
  onSearchChange,
  mobile = false,
}) {
  const filteredDocumentation = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return DOCUMENTATION;

    return DOCUMENTATION.map((category) => {
      const categoryMatches =
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query);

      const matchedSections = category.sections.filter(
        (section) =>
          section.title.toLowerCase().includes(query) ||
          section.eyebrow.toLowerCase().includes(query)
      );

      if (categoryMatches) return category;
      if (matchedSections.length) {
        return {
          ...category,
          sections: matchedSections,
        };
      }
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  // --- NEW CODE: Automatically scroll the sidebar to the active item ---
  useEffect(() => {
    if (activeSection) {
      const activeSidebarElement = document.getElementById(`sidebar-nav-${activeSection}`);
      if (activeSidebarElement) {
        activeSidebarElement.scrollIntoView({
          behavior: "smooth",
          block: "center", // Keeps the active item in the middle of the sidebar
        });
      }
    }
  }, [activeSection]);
  // ---------------------------------------------------------------------

  return (
    <aside
      className={`${
        mobile
          ? "h-full w-full overflow-y-auto bg-white"
          : "hidden lg:block lg:w-[292px] lg:shrink-0"
      }`}
    >
      <div
        className={`${
          mobile ? "px-5 pb-8 pt-5" : "sticky top-[104px] max-h-[calc(100vh-125px)] overflow-y-auto pr-5"
        }`}
      >
        <div className="mb-6">
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors"
            />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search documentation..."
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:shadow-md"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredDocumentation.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-5 text-center shadow-sm">
              <Search className="mx-auto text-zinc-300" size={22} />
              <p className="mt-3 text-sm font-semibold text-zinc-800">
                No documentation found
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-zinc-500">
                Try searching for products, orders, security, or sellers.
              </p>
            </div>
          )}

          {filteredDocumentation.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.id}>
                <button
                  onClick={() =>
                    onNavigate(category.sections[0]?.id || category.id)
                  }
                  className="group mb-2 flex w-full items-center gap-3 text-left"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm text-zinc-500 transition group-hover:border-zinc-300 group-hover:text-zinc-900">
                    <CategoryIcon size={14} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      {category.number}
                    </span>
                    <span className="block text-xs font-bold text-zinc-900">
                      {category.title}
                    </span>
                  </span>
                </button>

                <div className="ml-[13px] border-l border-zinc-200 pl-4">
                  <div className="space-y-0.5">
                    {category.sections.map((section) => {
                      const active = activeSection === section.id;
                      return (
                        <button
                          key={section.id}
                          id={`sidebar-nav-${section.id}`} // <-- NEW CODE: Added ID for scrollIntoView
                          onClick={() => onNavigate(section.id)}
                          className={`group relative flex w-full items-center rounded-lg px-3 py-2 text-left text-[12px] transition ${
                            active
                              ? "bg-zinc-900 font-semibold text-white shadow-sm"
                              : "font-medium text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="activeDocIndicator"
                              className="absolute -left-[18px] h-5 w-[2px] rounded-full bg-zinc-900"
                            />
                          )}
                          <span className="flex-1">{section.title}</span>
                          {active && (
                            <ChevronRight
                              size={13}
                              className="text-zinc-400 opacity-60"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ---------------------------------------------------------
   Main documentation section
   --------------------------------------------------------- */

function DocumentationSection({ section }) {
  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-28 border-b border-zinc-200 py-14 first:pt-4 sm:py-16"
    >
      <SectionLabel>{section.eyebrow}</SectionLabel>
      <h2 className="max-w-3xl text-2xl font-bold tracking-[-0.025em] text-zinc-950 sm:text-3xl">
        {section.title}
      </h2>
      <div className="prose prose-zinc mt-6 max-w-none">
        <div className="max-w-3xl space-y-5 text-[15px] leading-7 text-zinc-600">
          {React.Children.map(section.content, (child) => child)}
        </div>
      </div>
      {section.highlights && <HighlightGrid items={section.highlights} />}
      {section.steps && <StepList steps={section.steps} />}
      {section.architecture && <ArchitectureList items={section.architecture} />}
      {section.flow && <Flow items={section.flow} />}
      {section.statusFlow && <StatusFlow items={section.statusFlow} />}
      {section.roleCards && <RoleCards cards={section.roleCards} />}
    </motion.section>
  );
}

/* ---------------------------------------------------------
   On this page
   --------------------------------------------------------- */

function OnThisPage({ category, activeSection, onNavigate }) {
  if (!category) return null;
  return (
    <div className="hidden xl:block xl:w-[210px] xl:shrink-0">
      <div className="sticky top-[112px]">
        <div className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
          On this page
        </div>
        <div className="space-y-1 border-l border-zinc-200 pl-4">
          {category.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`block w-full py-1.5 text-left text-[13px] leading-5 transition ${
                activeSection === section.id
                  ? "font-bold text-zinc-950"
                  : "font-medium text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Header
   --------------------------------------------------------- */

function DocumentationHeader({ onOpenMobile, searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenMobile}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm text-zinc-700 lg:hidden hover:border-zinc-300 transition"
          aria-label="Open documentation navigation"
        >
          <Menu size={18} />
        </button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-md">
            <Layers3 size={17} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold tracking-tight text-zinc-950">
              StockLinker
            </div>
            <div className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:block">
              Documentation
            </div>
          </div>
        </div>
        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors"
            />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search StockLinker documentation..."
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white shadow-sm pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:shadow-md"
            />
            <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-zinc-200 bg-white shadow-sm px-2 py-1 text-[10px] font-bold text-zinc-400 lg:flex">
              /
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Pill>Product Docs</Pill>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   Breadcrumb
   --------------------------------------------------------- */

function Breadcrumb({ category, section }) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-zinc-400">
      <span className="font-medium hover:text-zinc-600 transition cursor-pointer">StockLinker</span>
      <ChevronRight size={14} className="text-zinc-300" />
      <span className="font-medium hover:text-zinc-600 transition cursor-pointer">Documentation</span>
      <ChevronRight size={14} className="text-zinc-300" />
      <span className="font-semibold text-zinc-600">{category?.title}</span>
      {section && (
        <>
          <ChevronRight size={14} className="text-zinc-300" />
          <span className="font-bold text-zinc-950">{section.title}</span>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Category introduction
   --------------------------------------------------------- */

function CategoryHeader({ category }) {
  const Icon = category.icon;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <Icon size={22} className="text-zinc-800" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {category.number} · Documentation
          </div>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl">
            {category.title}
          </h2>
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-[15px] leading-7 text-zinc-500">
        {category.description}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------
   Previous / Next
   --------------------------------------------------------- */

function SectionNavigation({ activeSection, onNavigate }) {
  const currentIndex = ALL_SECTIONS.findIndex((section) => section.id === activeSection);
  if (currentIndex === -1) return null;

  const previous = ALL_SECTIONS[currentIndex - 1];
  const next = ALL_SECTIONS[currentIndex + 1];

  return (
    <div className="grid gap-4 border-t border-zinc-200 py-12 sm:grid-cols-2 mt-8">
      {previous ? (
        <button
          onClick={() => onNavigate(previous.id)}
          className="group rounded-3xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Previous
          </div>
          <div className="mt-3 text-[16px] font-bold text-zinc-900">{previous.title}</div>
          <div className="mt-1.5 text-[13px] font-medium text-zinc-400">{previous.categoryTitle}</div>
        </button>
      ) : (
        <div />
      )}

      {next && (
        <button
          onClick={() => onNavigate(next.id)}
          className="group rounded-3xl border border-zinc-200 bg-white p-6 text-right shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md"
        >
          <div className="flex items-center justify-end gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            Next
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
          <div className="mt-3 text-[16px] font-bold text-zinc-900">{next.title}</div>
          <div className="mt-1.5 text-[13px] font-medium text-zinc-400">{next.categoryTitle}</div>
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Mobile navigation drawer
   --------------------------------------------------------- */

function MobileDrawer({ open, onClose, activeSection, onNavigate, searchQuery, onSearchChange }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 top-0 z-[80] w-[88%] max-w-[360px] bg-white shadow-2xl lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
                  <BookOpen size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-950">Documentation</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">StockLinker</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm hover:border-zinc-300 transition"
              >
                <X size={16} className="text-zinc-600" />
              </button>
            </div>
            <DocumentationSidebar
              mobile
              activeSection={activeSection}
              onNavigate={(id) => {
                onNavigate(id);
                onClose();
              }}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------
   Main page
   --------------------------------------------------------- */

export default function Documentation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState(getFirstSectionId());
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // 1. THIS REF IS THE FIX: It prevents the scroll spy from triggering while we are navigating programmatically
  const isNavigating = useRef(false);

  const selectedSection = getSectionById(activeSection) || ALL_SECTIONS[0];
  const selectedCategory = getCategoryForSection(selectedSection?.id) || DOCUMENTATION[0];

  /* ---------------------------------------------
     URL -> section effect
     --------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedSection = params.get("section");

    if (requestedSection && getSectionById(requestedSection)) {
      if (activeSection !== requestedSection) {
        // Lock the scroll spy
        isNavigating.current = true;
        setActiveSection(requestedSection);

        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToSection(requestedSection, "auto");
            // Unlock scroll spy after smooth scroll finishes
            setTimeout(() => {
              isNavigating.current = false;
            }, 100); 
          }, 50); // delay allows the DOM to swap categories
        });
      }
    } else if (!requestedSection && getFirstSectionId()) {
      setActiveSection(getFirstSectionId());
    }
  }, [location.search]);

  /* ---------------------------------------------
     Robust Scroll Spy Implementation
     --------------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      // 2. Ignore scroll calculation if a user clicked a link to navigate
      if (isNavigating.current) return;

      // 3. Dynamically fetch current DOM elements to avoid stale references
      const sectionElements = ALL_SECTIONS.map((sec) => document.getElementById(sec.id)).filter(Boolean);
      
      if (!sectionElements.length) return;

      let currentActive = activeSection;
      const scrollPosition = window.scrollY + 180; 

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el.offsetTop <= scrollPosition) {
          currentActive = el.id;
          break;
        }
      }

      if (currentActive && currentActive !== activeSection) {
        setActiveSection(currentActive);
        // Automatically sync URL as user scrolls down without refreshing
        window.history.replaceState(null, '', `/documentation?section=${currentActive}`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const timeout = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [activeSection]);

  /* ---------------------------------------------
     Keyboard shortcut
     --------------------------------------------- */
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search StockLinker documentation..."]');
        searchInput?.focus();
      }
      if (event.key === "Escape") {
        setSearchQuery("");
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ---------------------------------------------
     Navigate to section manually
     --------------------------------------------- */
  const handleNavigate = (sectionId) => {
    if (!getSectionById(sectionId)) return;

    // Lock scroll spy
    isNavigating.current = true;
    setActiveSection(sectionId);

    navigate(`/documentation?section=${sectionId}`, {
      replace: true,
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        scrollToSection(sectionId);
        // Unlock scroll spy
        setTimeout(() => {
          isNavigating.current = false;
        }, 800); // 800ms gives time for the smooth scroll to finish
      }, 30);
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans">
      <DocumentationHeader
        onOpenMobile={() => setMobileOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mobile quick navigation */}
      <div className="border-b border-zinc-200 bg-white lg:hidden shadow-sm z-40 sticky top-[72px]">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3 overflow-x-auto px-5 py-3 no-scrollbar">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[12px] font-bold text-zinc-700 shadow-sm transition hover:border-zinc-300"
          >
            <PanelLeft size={14} />
            Sections
          </button>
          <span className="h-5 w-px shrink-0 bg-zinc-200" />
          <span className="shrink-0 text-[12px] font-bold text-zinc-500">
            {selectedCategory.title}
          </span>
          <ChevronRight size={14} className="shrink-0 text-zinc-300" />
          <span className="shrink-0 text-[12px] font-extrabold text-zinc-900">
            {selectedSection.title}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1500px] gap-0 px-5 sm:px-6 lg:px-8">
        {/* Desktop sidebar */}
        <DocumentationSidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main content */}
        <main className="min-w-0 flex-1 lg:pl-8 xl:pl-12">
          <div className="mx-auto max-w-[1050px]">
            <div className="flex gap-12">
              <div className="min-w-0 flex-1">
                <div className="py-10 sm:py-12">
                  <Breadcrumb category={selectedCategory} section={selectedSection} />
                  <CategoryHeader category={selectedCategory} />
                  <div className="mt-8">
                    {selectedCategory.sections.map((section) => (
                      <DocumentationSection key={section.id} section={section} />
                    ))}
                  </div>
                  <SectionNavigation activeSection={activeSection} onNavigate={handleNavigate} />
                </div>
              </div>
              <OnThisPage
                category={selectedCategory}
                activeSection={activeSection}
                onNavigate={handleNavigate}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
              <Layers3 size={17} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-zinc-900">StockLinker</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Product Documentation
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium text-zinc-500 shadow-sm">
            <ShieldCheck size={16} className="text-zinc-400" />
            Built for a structured B2B wholesale experience.
          </div>
        </div>
      </footer>
    </div>
  );
}
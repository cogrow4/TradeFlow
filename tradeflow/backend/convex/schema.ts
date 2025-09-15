import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users and Authentication
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(v.literal("owner"), v.literal("manager"), v.literal("employee")),
    companyId: v.optional(v.id("companies")),
    isActive: v.boolean(),
    lastLogin: v.optional(v.number()),
    profileImage: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
    preferences: v.optional(v.object({
      theme: v.union(v.literal("light"), v.literal("dark")),
      notifications: v.boolean(),
      timezone: v.string(),
    })),
  }).index("by_clerk_id", ["clerkId"])
    .index("by_company", ["companyId"])
    .index("by_email", ["email"]),

  // Companies/Organizations
  companies: defineTable({
    name: v.string(),
    type: v.union(v.literal("electrical"), v.literal("plumbing"), v.literal("hvac"), v.literal("general")),
    ownerId: v.id("users"),
    subscriptionTier: v.union(v.literal("free"), v.literal("basic"), v.literal("professional"), v.literal("enterprise")),
    subscriptionStatus: v.union(v.literal("active"), v.literal("cancelled"), v.literal("past_due")),
    subscriptionEndDate: v.optional(v.number()),
    settings: v.object({
      currency: v.string(),
      timezone: v.string(),
      dateFormat: v.string(),
      invoicePrefix: v.string(),
      quotePrefix: v.string(),
      taxRate: v.number(),
      gstRate: v.number(),
    }),
    branding: v.optional(v.object({
      logo: v.string(),
      primaryColor: v.string(),
      secondaryColor: v.string(),
      companyName: v.string(),
    })),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    contact: v.object({
      phone: v.string(),
      email: v.string(),
      website: v.optional(v.string()),
    }),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"])
    .index("by_subscription", ["subscriptionTier", "subscriptionStatus"]),

  // Customers
  customers: defineTable({
    companyId: v.id("companies"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    billingAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
    customerType: v.union(v.literal("residential"), v.literal("commercial"), v.literal("industrial")),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("prospect")),
    source: v.optional(v.string()), // How they found the company
    notes: v.optional(v.string()),
    rating: v.optional(v.number()), // 1-5 stars
    totalJobs: v.number(),
    totalSpent: v.number(),
    lastJobDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_status", ["companyId", "status"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  // Jobs
  jobs: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    jobNumber: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("quoted"),
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("on_hold")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    jobType: v.string(), // e.g., "Electrical Installation", "Plumbing Repair"
    location: v.object({
      address: v.string(),
      coordinates: v.optional(v.object({
        lat: v.number(),
        lng: v.number(),
      })),
      instructions: v.optional(v.string()),
    }),
    assignedTo: v.optional(v.id("users")),
    teamMembers: v.array(v.id("users")),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
    quoteId: v.optional(v.id("quotes")),
    invoiceId: v.optional(v.id("invoices")),
    photos: v.array(v.object({
      url: v.string(),
      caption: v.optional(v.string()),
      timestamp: v.number(),
      uploadedBy: v.id("users"),
    })),
    materials: v.array(v.object({
      inventoryId: v.id("inventory"),
      quantity: v.number(),
      unitCost: v.number(),
      totalCost: v.number(),
    })),
    equipment: v.array(v.object({
      name: v.string(),
      quantity: v.number(),
      dailyRate: v.optional(v.number()),
      totalCost: v.number(),
    })),
    labor: v.array(v.object({
      userId: v.id("users"),
      hours: v.number(),
      rate: v.number(),
      totalCost: v.number(),
    })),
    expenses: v.array(v.object({
      description: v.string(),
      amount: v.number(),
      category: v.string(),
      receipt: v.optional(v.string()),
    })),
    notes: v.optional(v.string()),
    completionNotes: v.optional(v.string()),
    customerRating: v.optional(v.number()),
    customerFeedback: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["companyId", "status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_scheduled", ["scheduledStart"])
    .index("by_job_number", ["jobNumber"]),

  // Quotes
  quotes: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    jobId: v.optional(v.id("jobs")),
    quoteNumber: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("expired")
    ),
    validUntil: v.number(),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
      category: v.union(v.literal("labor"), v.literal("materials"), v.literal("equipment"), v.literal("other")),
    })),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    gstRate: v.number(),
    gstAmount: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
    createdBy: v.id("users"),
    sentAt: v.optional(v.number()),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["companyId", "status"])
    .index("by_quote_number", ["quoteNumber"]),

  // Invoices
  invoices: defineTable({
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    jobId: v.optional(v.id("jobs")),
    quoteId: v.optional(v.id("quotes")),
    invoiceNumber: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    dueDate: v.number(),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
      category: v.union(v.literal("labor"), v.literal("materials"), v.literal("equipment"), v.literal("other")),
    })),
    subtotal: v.number(),
    taxRate: v.number(),
    taxAmount: v.number(),
    gstRate: v.number(),
    gstAmount: v.number(),
    total: v.number(),
    paidAmount: v.number(),
    balance: v.number(),
    paymentTerms: v.string(),
    notes: v.optional(v.string()),
    createdBy: v.id("users"),
    sentAt: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    payments: v.array(v.object({
      amount: v.number(),
      method: v.string(),
      reference: v.optional(v.string()),
      date: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["companyId", "status"])
    .index("by_due_date", ["dueDate"])
    .index("by_invoice_number", ["invoiceNumber"]),

  // Inventory
  inventory: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    description: v.optional(v.string()),
    sku: v.string(),
    barcode: v.optional(v.string()),
    category: v.string(),
    unit: v.string(), // e.g., "each", "meter", "kg"
    costPrice: v.number(),
    sellingPrice: v.number(),
    markup: v.number(), // percentage
    currentStock: v.number(),
    minimumStock: v.number(),
    maximumStock: v.number(),
    reorderPoint: v.number(),
    supplierId: v.optional(v.id("suppliers")),
    location: v.optional(v.string()),
    isActive: v.boolean(),
    lastRestocked: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_sku", ["sku"])
    .index("by_barcode", ["barcode"])
    .index("by_category", ["companyId", "category"])
    .index("by_low_stock", ["companyId", "currentStock", "reorderPoint"]),

  // Suppliers
  suppliers: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    contactPerson: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    paymentTerms: v.optional(v.string()),
    creditLimit: v.optional(v.number()),
    isActive: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_name", ["companyId", "name"]),

  // Purchase Orders
  purchaseOrders: defineTable({
    companyId: v.id("companies"),
    supplierId: v.id("suppliers"),
    poNumber: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("received"),
      v.literal("cancelled")
    ),
    items: v.array(v.object({
      inventoryId: v.id("inventory"),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
    })),
    subtotal: v.number(),
    taxAmount: v.number(),
    total: v.number(),
    expectedDelivery: v.optional(v.number()),
    receivedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_supplier", ["supplierId"])
    .index("by_status", ["companyId", "status"])
    .index("by_po_number", ["poNumber"]),

  // Team Management
  employees: defineTable({
    companyId: v.id("companies"),
    userId: v.id("users"),
    employeeId: v.string(),
    position: v.string(),
    department: v.optional(v.string()),
    hireDate: v.number(),
    salary: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
    skills: v.array(v.string()),
    certifications: v.array(v.object({
      name: v.string(),
      issuer: v.string(),
      issueDate: v.number(),
      expiryDate: v.optional(v.number()),
      certificateUrl: v.optional(v.string()),
    })),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      relationship: v.string(),
      phone: v.string(),
    })),
    isActive: v.boolean(),
    notes: v.optional(v.string()),
  }).index("by_company", ["companyId"])
    .index("by_user", ["userId"])
    .index("by_employee_id", ["employeeId"]),

  // Timesheets
  timesheets: defineTable({
    companyId: v.id("companies"),
    employeeId: v.id("employees"),
    jobId: v.optional(v.id("jobs")),
    date: v.number(),
    clockIn: v.optional(v.number()),
    clockOut: v.optional(v.number()),
    breakStart: v.optional(v.number()),
    breakEnd: v.optional(v.number()),
    totalHours: v.number(),
    overtimeHours: v.number(),
    hourlyRate: v.number(),
    totalPay: v.number(),
    status: v.union(v.literal("draft"), v.literal("submitted"), v.literal("approved"), v.literal("paid")),
    notes: v.optional(v.string()),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_employee", ["employeeId"])
    .index("by_date", ["date"])
    .index("by_job", ["jobId"])
    .index("by_status", ["companyId", "status"]),

  // Communication
  messages: defineTable({
    companyId: v.id("companies"),
    senderId: v.id("users"),
    recipientId: v.optional(v.id("users")),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    subject: v.string(),
    content: v.string(),
    type: v.union(v.literal("internal"), v.literal("customer"), v.literal("system")),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("read"), v.literal("replied")),
    attachments: v.array(v.string()),
    readAt: v.optional(v.number()),
    repliedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"])
    .index("by_customer", ["customerId"])
    .index("by_job", ["jobId"])
    .index("by_type", ["companyId", "type"]),

  // Documents
  documents: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    type: v.union(
      v.literal("invoice"),
      v.literal("quote"),
      v.literal("contract"),
      v.literal("certificate"),
      v.literal("photo"),
      v.literal("other")
    ),
    category: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    relatedTo: v.optional(v.union(
      v.object({ type: v.literal("job"), id: v.id("jobs") }),
      v.object({ type: v.literal("customer"), id: v.id("customers") }),
      v.object({ type: v.literal("invoice"), id: v.id("invoices") }),
      v.object({ type: v.literal("quote"), id: v.id("quotes") })
    )),
    uploadedBy: v.id("users"),
    isPublic: v.boolean(),
    tags: v.array(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_type", ["companyId", "type"])
    .index("by_uploader", ["uploadedBy"])
    .index("by_related", ["relatedTo"]),

  // Settings and Configuration
  settings: defineTable({
    companyId: v.id("companies"),
    key: v.string(),
    value: v.any(),
    type: v.union(v.literal("string"), v.literal("number"), v.literal("boolean"), v.literal("object")),
    updatedBy: v.id("users"),
    updatedAt: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_key", ["companyId", "key"]),

  // Notifications
  notifications: defineTable({
    companyId: v.id("companies"),
    userId: v.id("users"),
    type: v.union(
      v.literal("job_assigned"),
      v.literal("job_completed"),
      v.literal("invoice_overdue"),
      v.literal("quote_accepted"),
      v.literal("low_stock"),
      v.literal("payment_received"),
      v.literal("system")
    ),
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    actionUrl: v.optional(v.string()),
    relatedId: v.optional(v.string()),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
  }).index("by_company", ["companyId"])
    .index("by_user", ["userId"])
    .index("by_unread", ["userId", "isRead"])
    .index("by_type", ["companyId", "type"]),

  // Audit Log
  auditLog: defineTable({
    companyId: v.id("companies"),
    userId: v.id("users"),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    oldValues: v.optional(v.any()),
    newValues: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_company", ["companyId"])
    .index("by_user", ["userId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_timestamp", ["timestamp"]),
});
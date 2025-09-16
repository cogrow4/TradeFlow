import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new invoice
export const createInvoice = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    jobId: v.optional(v.id("jobs")),
    quoteId: v.optional(v.id("quotes")),
    invoiceNumber: v.string(),
    title: v.string(),
    issueDate: v.number(),
    dueDate: v.number(),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("partially_paid"), v.literal("overdue"), v.literal("cancelled")),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      type: v.union(v.literal("material"), v.literal("labor"), v.literal("equipment"), v.literal("service")),
    })),
    subtotal: v.number(),
    taxRate: v.number(),
    totalAmount: v.number(),
    amountPaid: v.number(),
    balanceDue: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", args);
  },
});

// Get all invoices for a company
export const getInvoices = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

// Get a single invoice by ID
export const getInvoiceById = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.invoiceId);
  },
});

// Update an invoice
export const updateInvoice = mutation({
  args: {
    invoiceId: v.id("invoices"),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    quoteId: v.optional(v.id("quotes")),
    title: v.optional(v.string()),
    issueDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("partially_paid"), v.literal("overdue"), v.literal("cancelled"))),
    lineItems: v.optional(v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      type: v.union(v.literal("material"), v.literal("labor"), v.literal("equipment"), v.literal("service")),
    }))),
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    amountPaid: v.optional(v.number()),
    balanceDue: v.optional(v.number()),
    paymentHistory: v.optional(v.array(v.object({
      amount: v.number(),
      date: v.number(),
      method: v.string(),
      transactionId: v.optional(v.string()),
    }))),
    notes: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { invoiceId, ...updates } = args;
    await ctx.db.patch(invoiceId, updates);
  },
});

// Update invoice status
export const updateInvoiceStatus = mutation({
  args: {
    invoiceId: v.id("invoices"),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"), v.literal("partially_paid"), v.literal("overdue"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, { status: args.status });
  },
});
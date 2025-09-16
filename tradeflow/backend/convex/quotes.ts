import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new quote
export const createQuote = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    jobId: v.optional(v.id("jobs")),
    quoteNumber: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("rejected"), v.literal("revised")),
    issueDate: v.number(),
    expiryDate: v.number(),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      type: v.union(v.literal("material"), v.literal("labor"), v.literal("equipment"), v.literal("service")),
    })),
    subtotal: v.number(),
    taxRate: v.number(),
    totalAmount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quotes", args);
  },
});

// Get all quotes for a company
export const getQuotes = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quotes")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

// Get a single quote by ID
export const getQuoteById = query({
  args: { quoteId: v.id("quotes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quoteId);
  },
});

// Update a quote
export const updateQuote = mutation({
  args: {
    quoteId: v.id("quotes"),
    customerId: v.optional(v.id("customers")),
    jobId: v.optional(v.id("jobs")),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("rejected"), v.literal("revised"))),
    issueDate: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    lineItems: v.optional(v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      type: v.union(v.literal("material"), v.literal("labor"), v.literal("equipment"), v.literal("service")),
    }))),
    subtotal: v.optional(v.number()),
    taxRate: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    notes: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { quoteId, ...updates } = args;
    await ctx.db.patch(quoteId, updates);
  },
});

// Update quote status
export const updateQuoteStatus = mutation({
  args: {
    quoteId: v.id("quotes"),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("rejected"), v.literal("revised")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.quoteId, { status: args.status });
  },
});
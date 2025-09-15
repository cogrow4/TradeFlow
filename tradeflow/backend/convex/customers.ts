import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create customer
export const createCustomer = mutation({
  args: {
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
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customers", {
      ...args,
      status: "active",
      totalJobs: 0,
      totalSpent: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get customers by company
export const getCustomers = query({
  args: { 
    companyId: v.id("companies"),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("prospect"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("customers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.collect();
  },
});

// Get customer by ID
export const getCustomer = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.customerId);
  },
});

// Update customer
export const updateCustomer = mutation({
  args: {
    customerId: v.id("customers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
    billingAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
    customerType: v.optional(v.union(v.literal("residential"), v.literal("commercial"), v.literal("industrial"))),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("prospect"))),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { customerId, ...updates } = args;
    return await ctx.db.patch(customerId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Get customer jobs
export const getCustomerJobs = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .collect();
  },
});

// Get customer invoices
export const getCustomerInvoices = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .collect();
  },
});

// Get customer quotes
export const getCustomerQuotes = query({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quotes")
      .withIndex("by_customer", (q) => q.eq("customerId", args.customerId))
      .order("desc")
      .collect();
  },
});

// Update customer statistics
export const updateCustomerStats = mutation({
  args: {
    customerId: v.id("customers"),
    totalJobs: v.optional(v.number()),
    totalSpent: v.optional(v.number()),
    lastJobDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { customerId, ...updates } = args;
    return await ctx.db.patch(customerId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Search customers
export const searchCustomers = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const customers = await ctx.db
      .query("customers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm)
    );
  },
});

// Delete customer
export const deleteCustomer = mutation({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.customerId);
  },
});
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create company
export const createCompany = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("electrical"), v.literal("plumbing"), v.literal("hvac"), v.literal("general")),
    ownerId: v.id("users"),
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
    settings: v.object({
      currency: v.string(),
      timezone: v.string(),
      dateFormat: v.string(),
      invoicePrefix: v.string(),
      quotePrefix: v.string(),
      taxRate: v.number(),
      gstRate: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const companyId = await ctx.db.insert("companies", {
      ...args,
      subscriptionTier: "free",
      subscriptionStatus: "active",
      isActive: true,
      createdAt: Date.now(),
    });

    // Update user with company ID
    await ctx.db.patch(args.ownerId, { companyId });

    return companyId;
  },
});

// Get company by ID
export const getCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.companyId);
  },
});

// Get company by owner
export const getCompanyByOwner = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.ownerId);
    if (!user?.companyId) return null;
    return await ctx.db.get(user.companyId);
  },
});

// Update company settings
export const updateCompanySettings = mutation({
  args: {
    companyId: v.id("companies"),
    settings: v.object({
      currency: v.string(),
      timezone: v.string(),
      dateFormat: v.string(),
      invoicePrefix: v.string(),
      quotePrefix: v.string(),
      taxRate: v.number(),
      gstRate: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.companyId, { settings: args.settings });
  },
});

// Update company branding
export const updateCompanyBranding = mutation({
  args: {
    companyId: v.id("companies"),
    branding: v.object({
      logo: v.string(),
      primaryColor: v.string(),
      secondaryColor: v.string(),
      companyName: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.companyId, { branding: args.branding });
  },
});

// Update subscription
export const updateSubscription = mutation({
  args: {
    companyId: v.id("companies"),
    subscriptionTier: v.union(v.literal("free"), v.literal("basic"), v.literal("professional"), v.literal("enterprise")),
    subscriptionStatus: v.union(v.literal("active"), v.literal("cancelled"), v.literal("past_due")),
    subscriptionEndDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.companyId, {
      subscriptionTier: args.subscriptionTier,
      subscriptionStatus: args.subscriptionStatus,
      subscriptionEndDate: args.subscriptionEndDate,
    });
  },
});

// Get company statistics
export const getCompanyStats = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const customers = await ctx.db
      .query("customers")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const pendingInvoices = invoices.filter(invoice => invoice.status === "sent" || invoice.status === "overdue");
    const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.balance, 0);

    return {
      totalCustomers: customers.length,
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === "in_progress" || job.status === "scheduled").length,
      totalRevenue,
      pendingAmount,
      completedJobs: jobs.filter(job => job.status === "completed").length,
    };
  },
});
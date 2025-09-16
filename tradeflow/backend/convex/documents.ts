import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new document record
export const createDocument = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    type: v.union(v.literal("invoice"), v.literal("quote"), v.literal("contract"), v.literal("photo"), v.literal("other")),
    url: v.string(),
    uploadedBy: v.id("users"),
    relatedTo: v.optional(v.union(v.id("customers"), v.id("jobs"), v.id("quotes"), v.id("invoices"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      ...args,
      uploadedAt: Date.now(),
    });
  },
});

// Get all documents for a company
export const getDocuments = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();

    // Fetch uploader details for each document
    const documentsWithUploaders = await Promise.all(
      documents.map(async (document) => {
        const uploader = await ctx.db.get(document.uploadedBy);
        return { ...document, uploadedBy: uploader };
      })
    );

    return documentsWithUploaders;
  },
});

// Get documents related to a specific entity
export const getDocumentsByRelated = query({
  args: {
    companyId: v.id("companies"),
    relatedTo: v.union(v.id("customers"), v.id("jobs"), v.id("quotes"), v.id("invoices")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_relatedTo", (q) => q.eq("relatedTo", args.relatedTo))
      .collect();
  },
});

// Get a single document by ID
export const getDocumentById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// Update a document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("invoice"), v.literal("quote"), v.literal("contract"), v.literal("photo"), v.literal("other"))),
    relatedTo: v.optional(v.union(v.id("customers"), v.id("jobs"), v.id("quotes"), v.id("invoices"))),
  },
  handler: async (ctx, args) => {
    const { documentId, ...updates } = args;
    await ctx.db.patch(documentId, updates);
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.documentId);
  },
});
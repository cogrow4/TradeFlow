import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new inventory item
export const createInventoryItem = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    description: v.optional(v.string()),
    sku: v.optional(v.string()),
    category: v.optional(v.string()),
    currentStock: v.number(),
    minStockLevel: v.optional(v.number()),
    unitCost: v.number(),
    sellingPrice: v.number(),
    supplierId: v.optional(v.id("suppliers")),
    barcode: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inventory", args);
  },
});

// Get all inventory items for a company
export const getInventory = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

// Get a single inventory item by ID
export const getInventoryItemById = query({
  args: { itemId: v.id("inventory") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

// Update an inventory item
export const updateInventoryItem = mutation({
  args: {
    itemId: v.id("inventory"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    sku: v.optional(v.string()),
    category: v.optional(v.string()),
    currentStock: v.optional(v.number()),
    minStockLevel: v.optional(v.number()),
    unitCost: v.optional(v.number()),
    sellingPrice: v.optional(v.number()),
    supplierId: v.optional(v.id("suppliers")),
    barcode: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { itemId, ...updates } = args;
    await ctx.db.patch(itemId, updates);
  },
});

// Delete an inventory item
export const deleteInventoryItem = mutation({
  args: { itemId: v.id("inventory") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
  },
});

// Adjust stock for an inventory item
export const adjustStock = mutation({
  args: {
    itemId: v.id("inventory"),
    adjustment: v.number(), // Positive for increase, negative for decrease
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Inventory item not found");
    }

    const newStock = item.currentStock + args.adjustment;
    if (newStock < 0) {
      throw new Error("Stock cannot be negative");
    }

    await ctx.db.patch(args.itemId, { currentStock: newStock });
    return newStock;
  },
});
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Send a message
export const sendMessage = mutation({
  args: {
    companyId: v.id("companies"),
    senderId: v.id("users"),
    recipientId: v.optional(v.id("users")),
    channelId: v.optional(v.string()),
    content: v.string(),
    relatedTo: v.optional(v.union(v.id("jobs"), v.id("customers"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      sentAt: Date.now(),
      readBy: [args.senderId], // Mark as read by sender
    });
  },
});

// Get messages for a channel or direct conversation
export const getMessages = query({
  args: {
    companyId: v.id("companies"),
    channelId: v.optional(v.string()),
    recipientId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("messages")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId));

    if (args.channelId) {
      query = query.filter((q) => q.eq(q.field("channelId"), args.channelId));
    } else if (args.recipientId) {
      query = query.filter((q) => q.eq(q.field("recipientId"), args.recipientId));
    }

    const messages = await query
      .order("desc")
      .take(args.limit || 50);

    // Fetch sender details for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return { ...message, sender };
      })
    );

    return messagesWithSenders.reverse(); // Return in chronological order
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    messageIds: v.array(v.id("messages")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    for (const messageId of args.messageIds) {
      const message = await ctx.db.get(messageId);
      if (message && !message.readBy?.includes(args.userId)) {
        await ctx.db.patch(messageId, {
          readBy: [...(message.readBy || []), args.userId],
        });
      }
    }
  },
});

// Get unread message count for a user
export const getUnreadCount = query({
  args: {
    companyId: v.id("companies"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .filter((q) => 
        q.and(
          q.neq(q.field("senderId"), args.userId),
          q.not(q.field("readBy").includes(args.userId))
        )
      )
      .collect();

    return messages.length;
  },
});
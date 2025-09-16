import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new schedule event
export const createSchedule = mutation({
  args: {
    companyId: v.id("companies"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("job"), v.literal("meeting"), v.literal("other")),
    relatedId: v.optional(v.union(v.id("jobs"), v.id("users"))),
    start: v.number(),
    end: v.number(),
    assignedTo: v.optional(v.array(v.id("users"))),
    location: v.optional(v.string()),
    allDay: v.boolean(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("schedules", args);
  },
});

// Get all schedules for a company
export const getSchedules = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedules")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

// Get schedules for a specific date range
export const getSchedulesByDateRange = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedules")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .filter((q) => 
        q.and(
          q.gte(q.field("start"), args.startDate),
          q.lte(q.field("end"), args.endDate)
        )
      )
      .collect();
  },
});

// Get a single schedule by ID
export const getScheduleById = query({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scheduleId);
  },
});

// Update a schedule
export const updateSchedule = mutation({
  args: {
    scheduleId: v.id("schedules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(v.literal("job"), v.literal("meeting"), v.literal("other"))),
    relatedId: v.optional(v.union(v.id("jobs"), v.id("users"))),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    assignedTo: v.optional(v.array(v.id("users"))),
    location: v.optional(v.string()),
    allDay: v.optional(v.boolean()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { scheduleId, ...updates } = args;
    await ctx.db.patch(scheduleId, updates);
  },
});

// Delete a schedule
export const deleteSchedule = mutation({
  args: { scheduleId: v.id("schedules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.scheduleId);
  },
});
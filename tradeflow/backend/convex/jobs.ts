import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create job
export const createJob = mutation({
  args: {
    companyId: v.id("companies"),
    customerId: v.id("customers"),
    title: v.string(),
    description: v.string(),
    jobType: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
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
    estimatedHours: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate job number
    const company = await ctx.db.get(args.companyId);
    const jobCount = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
    
    const jobNumber = `JOB-${String(jobCount.length + 1).padStart(4, '0')}`;

    return await ctx.db.insert("jobs", {
      ...args,
      jobNumber,
      status: "quoted",
      teamMembers: args.teamMembers || [],
      materials: [],
      equipment: [],
      labor: [],
      expenses: [],
      photos: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get jobs by company
export const getJobs = query({
  args: {
    companyId: v.id("companies"),
    status: v.optional(v.union(
      v.literal("quoted"),
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("on_hold")
    )),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId));

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.assignedTo) {
      query = query.filter((q) => q.eq(q.field("assignedTo"), args.assignedTo));
    }

    return await query.order("desc").collect();
  },
});

// Get job by ID
export const getJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// Update job status
export const updateJobStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    status: v.union(
      v.literal("quoted"),
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("on_hold")
    ),
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),
    completionNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { jobId, ...updates } = args;
    return await ctx.db.patch(jobId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Update job details
export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    assignedTo: v.optional(v.id("users")),
    teamMembers: v.optional(v.array(v.id("users"))),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { jobId, ...updates } = args;
    return await ctx.db.patch(jobId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Add job photo
export const addJobPhoto = mutation({
  args: {
    jobId: v.id("jobs"),
    url: v.string(),
    caption: v.optional(v.string()),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    const newPhoto = {
      url: args.url,
      caption: args.caption,
      timestamp: Date.now(),
      uploadedBy: args.uploadedBy,
    };

    return await ctx.db.patch(args.jobId, {
      photos: [...job.photos, newPhoto],
      updatedAt: Date.now(),
    });
  },
});

// Add job material
export const addJobMaterial = mutation({
  args: {
    jobId: v.id("jobs"),
    inventoryId: v.id("inventory"),
    quantity: v.number(),
    unitCost: v.number(),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    const totalCost = args.quantity * args.unitCost;
    const newMaterial = {
      inventoryId: args.inventoryId,
      quantity: args.quantity,
      unitCost: args.unitCost,
      totalCost,
    };

    return await ctx.db.patch(args.jobId, {
      materials: [...job.materials, newMaterial],
      updatedAt: Date.now(),
    });
  },
});

// Add job labor
export const addJobLabor = mutation({
  args: {
    jobId: v.id("jobs"),
    userId: v.id("users"),
    hours: v.number(),
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    const totalCost = args.hours * args.rate;
    const newLabor = {
      userId: args.userId,
      hours: args.hours,
      rate: args.rate,
      totalCost,
    };

    return await ctx.db.patch(args.jobId, {
      labor: [...job.labor, newLabor],
      actualHours: (job.actualHours || 0) + args.hours,
      updatedAt: Date.now(),
    });
  },
});

// Get jobs by date range
export const getJobsByDateRange = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => 
        q.and(
          q.gte(q.field("scheduledStart"), args.startDate),
          q.lte(q.field("scheduledStart"), args.endDate)
        )
      )
      .collect();
  },
});

// Get jobs for calendar
export const getJobsForCalendar = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => 
        q.and(
          q.gte(q.field("scheduledStart"), args.startDate),
          q.lte(q.field("scheduledStart"), args.endDate)
        )
      )
      .collect();

    // Get customer details for each job
    const jobsWithCustomers = await Promise.all(
      jobs.map(async (job) => {
        const customer = await ctx.db.get(job.customerId);
        return {
          ...job,
          customer,
        };
      })
    );

    return jobsWithCustomers;
  },
});

// Delete job
export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.jobId);
  },
});
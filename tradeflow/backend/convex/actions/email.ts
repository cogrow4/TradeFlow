import { action } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // In production, keep API keys in Convex environment variables
    const apiKey = process.env.RESEND_API_KEY || "re_7Vk5xZMk_3t7pS5wuqxT45g7ZZDep9MFT";
    if (!apiKey) throw new Error("Missing RESEND_API_KEY");

    const resend = new Resend(apiKey);
    const from = args.from || "onboarding@resend.dev";

    const { data, error } = await resend.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    });

    if (error) throw new Error(JSON.stringify(error));
    return data?.id || true;
  },
});

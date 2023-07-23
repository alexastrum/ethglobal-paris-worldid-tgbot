// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "std/server";

console.log(`Function "telegram-bot" up and running!`);

import { Bot, webhookCallback, Context, session, SessionFlavor } from "grammy";
import { freeStorage } from "https://deno.land/x/grammy_storages@v2.3.0/free/src/mod.ts";

// import { supabaseAdapter } from "https://deno.land/x/grammy_storages@v2.3.0/supabase/src/mod.ts";
// import { createClient } from "@supabase/supabase-js";

interface SessionData {
  counter: number;
}
type MyContext = Context & SessionFlavor<SessionData>;

// supabase instance
// const supabase = createClient(
//   // Supabase API URL - env var exported by default.
//   Deno.env.get("SUPABASE_URL") ?? "",
//   // Supabase API ANON KEY - env var exported by default.
//   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
//   // Create client with Auth context of the user that called the function.
//   // This way your row-level-security (RLS) policies are applied.
//   // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
// );

// //create storage
// const storage = supabaseAdapter({
//   supabase,
//   table: "sessions", // the defined table name you want to use to store your session
// });

const bot = new Bot<MyContext>(Deno.env.get("TELEGRAM_BOT_TOKEN") || "");
bot.use(
  session({
    initial: () => ({ counter: 0 }),
    storage: freeStorage<SessionData>(bot.token),
  })
);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.command("inc", (ctx) => ctx.session.counter++);

bot.command("counter", (ctx) => ctx.reply(ctx.session.counter));

bot.command("ping", (ctx) =>
  ctx.reply(`Pong! ${new Date()} ${Date.now()}`, {
    reply_to_message_id: ctx.msg.message_id,
    parse_mode: "MarkdownV2",
  })
);

bot.on("message", (ctx) => {});

const handleUpdate = webhookCallback(bot, "std/http");

serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== Deno.env.get("FUNCTION_SECRET"))
      return new Response("not allowed", { status: 405 });

    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});

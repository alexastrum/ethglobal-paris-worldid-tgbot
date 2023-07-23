# World Id Telegram Bot

https://wrldid-tgbot.vercel.app

I created a simple Telegram bot that will help Telegram admins make sure their DAO channels are safe from unwanted bots, duplicate accounts, and other unwanted members. In this initial version, we use Worldcoin Anonymous Actions to perform following important tasks:

- Make sure each participant of the chat room is a real human, and only one account per human participant is allowed at one time.
- Allow participants to vote anonymously.
- Allow participants to relay anonymous messages through our bot, should they want to raise a concern without revealing their identity.

I used Worldcoin Anonymous Actions with unlimited signals per user and rely on nullifier_hash values to prevent sybil attacks and allow users to update their choices.

By using custom signals we can group distinct choices under the same action and track things like userId association and votes when needed, while preserving anonymity when necessary.

## Getting Started

```bash
nvm use 18
pnpm i && pnpm dev
```

## Deploy main app on Vercel

The easiest way to deploy your Next.js app is to use the Vercel GitHub integration. Push your code to GitHub and Vercel will deploy it automatically.

## Supabase Telegram bot backend

For the bot to work, you need to create a Supabase project and link it to your Telegram bot. You can do this by running the following commands:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase secrets set --env-file ./supabase/.env
supabase functions deploy --no-verify-jwt
```

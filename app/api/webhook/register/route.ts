import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response(
      "Message - Please save your webhook secret in .env file",
      { status: 404 }
    );
  }

  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`The Webhook is of ID ${id} and has a type of ${eventType}`);

  if (eventType === "user.created") {
    try {
      const { email_addresses, first_name, primary_email_address_id } =
        evt.data;

      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      console.log("Primary email:", primaryEmail);
      console.log("Email addresses:", primaryEmail?.email_address);

      if (!primaryEmail) {
        console.error("No primary email found");
        return new Response("No primary email found", { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          id: evt.data.id!,
        },
      });

      if (existingUser) {
        console.log("User already exists in the database:", existingUser);
        return new Response("User already exists", { status: 200 });
      }

      const newUser = await prisma.user.create({
        data: {
          id: evt.data.id!,
          email: primaryEmail.email_address,
        },
      });

      console.log("New user created:", newUser);
    } catch (error) {
      console.error("Error creating user in database:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response(
    "Webhook received successfully and User Has Been Created!",
    { status: 200 }
  );
}

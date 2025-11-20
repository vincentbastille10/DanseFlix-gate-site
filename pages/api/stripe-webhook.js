import Stripe from "stripe";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false, // Stripe a besoin du raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Transport SMTP pour envoyer l'email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendCustomerEmail(to) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "DanseFlix – Votre paiement a bien été reçu ✅",
    text: [
      "Bonjour,",
      "",
      "Merci pour votre achat de l’accès à la plateforme DanseFlix.",
      "",
      "Votre pass est associé à cette adresse : " + to,
      "L’organisateur va activer votre accès très prochainement.",
      "",
      "Vous pourrez ensuite accéder aux vidéos en utilisant cet email sur la page DanseFlix.",
      "",
      "À bientôt,",
      "L’équipe DanseFlix / Spectra Media",
    ].join("\n"),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];

  const chunks = [];
  await new Promise((resolve) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve());
  });
  const rawBody = Buffer.concat(chunks);

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Erreur webhook Stripe:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email =
      (session.customer_details && session.customer_details.email) ||
      session.customer_email ||
      undefined;

    if (email) {
      console.log("[STRIPE] Paiement reçu pour", email);
      try {
        await sendCustomerEmail(email);
      } catch (e) {
        console.error("[MAIL] Erreur d’envoi de mail client", e);
      }
    }
  }

  return res.status(200).json({ received: true });
}

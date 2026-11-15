import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export default async function checkOutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { session_id } = await searchParams;
  const sessionId = Array.isArray(session_id) ? session_id[0] : session_id;

  if (!sessionId)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const { status,customer_email,metadata,payment_intent,payment_status } = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete" && payment_status === "paid") {
    console.log({status,customer_email,metadata,payment_intent,payment_status});
    return (
      <section id="success" className="mt-20">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }
}

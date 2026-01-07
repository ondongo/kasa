import { client } from "@/configs/twilio/twilio";
import { getOrCreateService } from "./serviceTwilio";

export async function createVerification(phoneNumber: string) {
  // S'assurer que le service existe et récupérer son SID
  const serviceSid = await getOrCreateService();
  
  const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({
      channel: "sms",
      to: phoneNumber,
    });

  console.log("Status de vérification:", verification.status);
  return verification;
}

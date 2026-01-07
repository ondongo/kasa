import { client } from "@/configs/twilio/twilio";
import { getOrCreateService } from "./serviceTwilio";

export async function createVerificationCheck(phoneNumber: string, code: string) {
  // S'assurer que le service existe et récupérer son SID
  const serviceSid = await getOrCreateService();
  
  const verificationCheck = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({
      code: code,
      to: phoneNumber,
    });

  console.log("Status de vérification:", verificationCheck.status);
  return verificationCheck;
}

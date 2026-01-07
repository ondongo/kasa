import { client } from "@/configs/twilio/twilio";

const SERVICE_NAME = "Dvia OTP";

/**
 * Crée un nouveau service Twilio Verify
 */
async function createService(): Promise<string> {
  const service = await client.verify.v2.services.create({
    friendlyName: SERVICE_NAME,
  });

  console.log("Service créé avec le SID:", service.sid);
  return service.sid;
}

/**
 * Récupère le SID du service en listant tous les services
 */
async function getServiceSid(): Promise<string | null> {
  try {
    const services = await client.verify.v2.services.list();
    const service = services.find((s) => s.friendlyName === SERVICE_NAME);
    
    if (service) {
      return service.sid;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du service:", error);
    return null;
  }
}

/**
 * Récupère ou crée le service Twilio Verify
 * Cette fonction doit être appelée avant toute utilisation du service
 * Elle vérifie d'abord si le service existe, sinon elle le crée
 */
export async function getOrCreateService(): Promise<string> {
  // D'abord, on essaie de récupérer le service existant
  const existingServiceSid = await getServiceSid();
  
  if (existingServiceSid) {
    return existingServiceSid;
  }
  
  // Si le service n'existe pas, on le crée
  try {
    return await createService();
  } catch (error: any) {
    // Si l'erreur indique que le service existe déjà (race condition), on réessaie de le récupérer
    if (error.code === 20001 || error.message?.includes("already exists")) {
      const serviceSid = await getServiceSid();
      if (serviceSid) {
        return serviceSid;
      }
    }
    throw error;
  }
}

/**
 * Détecte les informations de l'appareil à partir du User-Agent
 */
export function detectDevice(userAgent: string): {
  deviceType: 'mobile' | 'tablet' | 'laptop';
  deviceName: string;
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();
  
  // Détection du type d'appareil
  let deviceType: 'mobile' | 'tablet' | 'laptop' = 'laptop';
  let deviceName = 'Ordinateur';
  
  if (ua.includes('mobile')) {
    deviceType = 'mobile';
    if (ua.includes('iphone')) {
      deviceName = 'iPhone';
    } else if (ua.includes('android')) {
      deviceName = 'Android';
    } else {
      deviceName = 'Mobile';
    }
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    deviceType = 'tablet';
    deviceName = 'Tablette';
  } else {
    if (ua.includes('mac')) {
      deviceName = 'Mac';
    } else if (ua.includes('windows')) {
      deviceName = 'PC Windows';
    } else if (ua.includes('linux')) {
      deviceName = 'PC Linux';
    } else {
      deviceName = 'Ordinateur';
    }
  }
  
  // Détection du navigateur
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('edg')) {
    browser = 'Edge';
  }
  
  // Détection de l'OS
  let os = 'Unknown';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  }
  
  return {
    deviceType,
    deviceName: `${deviceName} (${browser})`,
    browser,
    os,
  };
}

/**
 * Génère un fingerprint unique pour l'appareil
 */
export function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  // Simple hash basé sur user agent et IP
  const data = `${userAgent}|${ipAddress}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}


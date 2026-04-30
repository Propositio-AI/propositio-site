import { createClient } from "microcms-js-sdk";

let clientInstance: any = null;

export function getClient() {
  if (!clientInstance && typeof window !== 'undefined') {
    clientInstance = createClient({ 
      serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN!,
      apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY!,
    });
  }
  return clientInstance;
}
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'smpnt.com.ecommerce',
  appName: 'ecommerce',
  webDir: 'www',
  bundledWebRuntime: false,
  "plugins": {
    "CapacitorFirebaseAuth": {
      "providers": ["phone"],
      "languageCode": "en",
      "nativeAuth": false,
      "permissions": {}
    }
  }
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cz.vladimir.todomotivation',
  appName: 'ToDoMotivation',
  webDir: 'www',

  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['email']
    }
  }
};

export default config;

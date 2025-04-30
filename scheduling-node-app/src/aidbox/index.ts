import path from 'path';

import {
  createApp,
  createCtx,
  startApp,
  Ctx,
  ManifestProps,
  createConfig,
} from '@aidbox/node-server-sdk';
import dotenv from 'dotenv';

import { axiosInstance } from 'aidbox-react/lib/services/instance';

import { appointmentFind, appointmentBook, fhirAppointmentBook, fhirAppointmentFind } from './operations';

export const manifest: ManifestProps = {
  apiVersion: 1,
  resources: {
    AccessPolicy: {
      'scheduling-public-operations': {
        engine: 'allow',
        link: [{ resourceType: 'Operation', id: 'scheduling-app-healthcheck' }],
      },
    },
  },
  entities: {
    HealthcareService: {
      attrs: {
        duration: {
          type: 'integer',
          description: 'Length of service in minutes',
          extensionUrl: 'urn:extensions:healthcare-service-duration',
        },
      },
    },
  },
  operations: {
    'fhir-appointment-book': fhirAppointmentBook,
    'appointment-book': appointmentBook,
    'fhir-appointment-find': fhirAppointmentFind,
    'appointment-find': appointmentFind,
    'scheduling-app-healthcheck': {
      method: 'GET',
      path: ['scheduling-app-healthcheck'],
      handlerFn: async (_: any, { ctx }: { ctx: Ctx }) => {
        return { resource: {} };
      },
    },
  },
};

export const main = async () => {
  const isDev = process.env.NODE_ENV === 'development';
  dotenv.config({
    path: isDev ? path.resolve(__dirname, '..', '..', '.env') : undefined,
  });

  // Init app
  const config = createConfig();
  const ctx = createCtx({ config, manifest });
  const app = createApp({ ctx, helpers: {} }, config);

  // Start app
  const port = +(process.env.APP_PORT || process.env.PORT || 3000);

  try {
    await startApp(app, port);
    axiosInstance.defaults.auth = ctx.client.defaults.auth;
    axiosInstance.defaults.baseURL = ctx.client.defaults.baseURL;
  } catch (e: any) {
    console.dir(e);
    console.log(e.response.data);
  }
};

import { getHealthHello } from './requests/getHealthHello';
import { getDatabaseStatus } from './requests/getDatabaseStatus';
import { getDatabaseHello } from './requests/getDatabaseHello';

export const setupApi = {
  getHealthHello,
  getDatabaseStatus,
  getDatabaseHello
};

export default setupApi;

import { newEnforcer } from 'casbin';
import path from 'path';

let enforcerPromise: ReturnType<typeof newEnforcer> | null = null;

export async function getEnforcer() {
  if (!enforcerPromise) {
    const model = path.join(process.cwd(), 'src/auth/model.conf');
    const policy = path.join(process.cwd(), 'src/auth/policy.csv');
    enforcerPromise = newEnforcer(model, policy);
  }
  return enforcerPromise;
}

export async function authorize(role: string, obj: string, act: string) {
  const enforcer = await getEnforcer();
  return enforcer.enforce(role, obj, act);
}

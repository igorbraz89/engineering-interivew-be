import { AccessControl } from 'accesscontrol';
import type { RequestHandler } from 'express';
import asyncHandler from './routes/async-handler';
import {retrieveUserProfile} from "./db/profiles";

const accessControl = new AccessControl();
accessControl
  .grant('user')
  .create('task', ['*'])
  .read(
    'task', ['*']
  )
  .update('task', ['*'])
  .delete('task',['*']);
function getAccess(res, policy, operation, resource) {
  try {
    return policy[operation](resource);
  } catch(e) {
    console.error(e);
    return res.status(401).json();
  }
}
function authorize(
  resource: string,
  action: string,
): RequestHandler {
  return asyncHandler(async (req, res, next) => {
    const {
      db,
      user,
    } = req;
    let effectiveRole;
    let isOwner = false;
    if (user) {
      const ownerId = req.user.id;
      const userProfile = await retrieveUserProfile(db,  user.id);
      isOwner = user.id === ownerId && userProfile.active;
      effectiveRole = userProfile.role
    }

    const policy = accessControl.can(effectiveRole);
    const operation = `${action}Any`;
    const access = isOwner && getAccess(res, policy, operation, resource);
    if (access) {
      req.accessControl = {
        policy,
        lastGranted: access,
      };
      return next();
    }
    return res.status(403).json();
  });
}

export default authorize;
export { accessControl };

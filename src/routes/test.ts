import type { Request, Response, NextFunction } from 'express';
import Router from 'express-promise-router';
import asyncHandler from "./async-handler";
import { ensureAuthenticated } from "./auth";


function handleTest(req: Request, res: Response) {
    return res.json({message: 'Yes it works', user: req.user})
}

const testRouter = Router();

testRouter.get(
    '/',
    ensureAuthenticated,
    asyncHandler(handleTest)
);

export default testRouter;

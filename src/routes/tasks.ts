import type { Request, Response } from 'express';
import Router from 'express-promise-router';
import asyncHandler from "./async-handler";
import { ensureAuthenticated } from "./auth";
import {createTask, deleteTask, retrieveTasksByUser, updateTask} from "../db/tasks";
import authorize from "../authorize";


async function handleCreateTask(req: Request, res: Response) {
    const newTask = req.body;
    const savedTask = await createTask(req.db, req.user, newTask);
    return res.json(savedTask);
}
async function handleUpdateTask(req: Request, res: Response) {
    const task = req.body;
    const { taskId } = req.params;
    const updatedTask = await updateTask(req.db, req.user, {...task, id: +taskId });
    if (!updatedTask) return res.status(400).json();
    return res.json(updatedTask);
}
async function handleDeleteTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const savedTask = await deleteTask(req.db, req.user, +taskId);
    return res.json(savedTask);
}
async function handleRetrieveTasks(req: Request, res: Response) {
    const savedTasks = await retrieveTasksByUser(req.db, req.user);
    if (!savedTasks || savedTasks?.length === 0) {
        return res.status(404).json();
    }
    return res.json(savedTasks);
}

const tasksRouter = Router();

tasksRouter.post(
    '/',
    ensureAuthenticated,
    authorize('tasks', 'create'),
    asyncHandler(handleCreateTask)
);
tasksRouter.get(
    '/',
    ensureAuthenticated,
    authorize('tasks', 'read'),
    asyncHandler(handleRetrieveTasks)
);
const taskRouter = Router({ mergeParams: true });

taskRouter.put(
    '/',
    ensureAuthenticated,
    authorize('tasks', 'update'),
    asyncHandler(handleUpdateTask)
);
taskRouter.delete(
    '/',
    ensureAuthenticated,
    authorize('tasks', 'delete'),
    asyncHandler(handleDeleteTask)
);
export default tasksRouter;
export { taskRouter };

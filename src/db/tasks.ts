import { compare, hash } from 'bcrypt';
import * as Joi from 'joi';
import {AuthorFieldsDBType, ExtendedProtocolDB} from './db';
import {accounts, tasks} from "./sql";
import {SavedAccount} from "./accounts";

type TaskDBType = {
  name: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'done' | 'archived';
}

type SavedTaskDBType = {
  id: number;
} & TaskDBType & AuthorFieldsDBType;

function mapRow(row) {
  return (row && {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    createdBy: row.created_by,
    updatedBy: row.updated_by
  });
}

async function createTask(db: ExtendedProtocolDB, { id: accountId }: SavedAccount, task: TaskDBType): Promise<SavedTaskDBType>{
  return await db.one(tasks.create, { ...task, accountId }, mapRow);
}
async function updateTask(db: ExtendedProtocolDB, { id: accountId }: SavedAccount, task: TaskDBType): Promise<SavedTaskDBType>{
  return await db.one(tasks.update, { ...task, accountId }, mapRow);
}
async function deleteTask(db: ExtendedProtocolDB, { id: accountId }: SavedAccount, taskId: number): Promise<SavedTaskDBType>{
  return await db.one(tasks.delete, { id: taskId, accountId }, mapRow);
}
async function retrieveTasksByUser(db: ExtendedProtocolDB, { id: accountId }: SavedAccount): Promise<SavedTaskDBType[]> {
  return db.map(tasks.retrieve, { accountId }, mapRow);
}
export { createTask, updateTask, deleteTask, retrieveTasksByUser };
export type { TaskDBType, SavedTaskDBType };

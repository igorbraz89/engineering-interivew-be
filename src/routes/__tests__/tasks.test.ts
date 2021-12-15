// @ts-nocheck

import { tasksRef } from "../../__mocks__/data";
import * as tasks from  '../../db/tasks';
import { mockAuth } from './helpers';

jest.mock('../../db/tasks');
describe.each([undefined, 'user'])('As authenticated: %s', (role) => {
  const agent = mockAuth(role);
  it('Create task', async () => {
    tasks.createTask.mockResolvedValue(tasksRef[0]);

    const { body, statusCode } = await agent
        .post(`/api/tasks`)
        .set('Content-Type', 'application/json');
    if (role) {
      expect(statusCode).toEqual(200);
      expect(body).toMatchObject(tasksRef[0]);
    } else {
      expect(statusCode).toEqual(401);
    }
  });
  it('Update task', async () => {
    const updatedTask = {...tasksRef[0], status: 'archived'};
    tasks.updateTask.mockResolvedValue(updatedTask);

    const { body, statusCode } = await agent
        .put(`/api/task/${updatedTask.id}`)
        .set('Content-Type', 'application/json');
    if (role) {
      expect(statusCode).toEqual(200);
      expect(body).toMatchObject(updatedTask);
    } else {
      expect(statusCode).toEqual(401);
    }
  });
  it('Retrieve tasks by user', async () => {
    tasks.retrieveTasksByUser.mockResolvedValue(tasksRef[0]);

    const { body, statusCode } = await agent
        .get(`/api/tasks`)
        .set('Content-Type', 'application/json');
    if (role) {
      expect(statusCode).toEqual(200);
      expect(body).toMatchObject(tasksRef[0]);
    } else {
      expect(statusCode).toEqual(401);
    }
  });
  it('Delete task', async () => {
    tasks.deleteTask.mockResolvedValue(tasksRef[0]);
    const { body, statusCode } = await agent
      .delete(`/api/task/${tasksRef[0].id}`)
      .set('Content-Type', 'application/json');
    if (role) {
      expect(statusCode).toEqual(200);
      expect(body).toMatchObject(tasksRef[0]);
    } else {
      expect(statusCode).toEqual(401);
    }
  });
});

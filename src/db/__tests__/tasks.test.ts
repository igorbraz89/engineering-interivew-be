import { hookUpTestDB, seedAccounts, seedTasks } from "./helper";
import { accountsRef, tasksData, tasksRef } from "../../__mocks__/data";
import {createTask, deleteTask, retrieveTasksByUser, SavedTaskDBType, TaskDBType, updateTask} from "../tasks";

const getDB = hookUpTestDB();

seedAccounts(getDB);
const sampleAccount = accountsRef[0];

it('Create Task', async () => {
    const savedTask = await createTask(getDB(), sampleAccount, tasksData[0]);
    expect(savedTask).toBeDefined();
    expect(savedTask).toMatchObject(tasksRef[0]);
})
describe('With existing tasks', () => {
    seedTasks(getDB);
    it('Update task', async () => {
        const updatedTask: TaskDBType = {...tasksRef[0], name: 'dummy', status: 'done'};
        const changedAccount = await updateTask(getDB(), sampleAccount, updatedTask);
        expect(changedAccount).toBeDefined();
        expect(changedAccount).toMatchObject(updatedTask);
    });

    it('Retrieve tasks by user', async () => {
        const tasksByUser: SavedTaskDBType[] = await retrieveTasksByUser(getDB(), sampleAccount);
        expect(tasksByUser).toBeDefined();
        expect(tasksByUser.length).toBeGreaterThan(0);
    });
    it('Delete task', async () => {
        const deletedTask: SavedTaskDBType = await deleteTask(getDB(), sampleAccount, tasksRef[0].id);
        expect(deletedTask).toBeDefined();
        expect(deletedTask.id).toEqual(tasksRef[0].id);
    });
});

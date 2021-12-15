import {TaskDBType} from "../db/tasks";
import {ProfileDBType} from "../db/profiles";

const sequences = {};

function nextId(seq) {
    const curValue = sequences[seq] || 0;
    const nextValue = curValue + 1;
    sequences[seq] = nextValue;
    return nextValue;
}
const accountsData = [
    {
        name: 'Tester',
        userName: 'test',
    }
]
const accountsRef = accountsData.map((acc) => (
    {...acc,
        id: nextId('accounts')
    })
);
const profilesRef: ProfileDBType[] = [
    {
        accountId: accountsRef[0].id,
        role: 'user',
        active: true
    }
]

const tasksData: TaskDBType[] = [
    {
        name: 'Study',
        description: 'This is a test task',
        status: 'in_progress',
    }
]
const tasksRef = tasksData.map((acc) => (
    {...acc,
        id: nextId('tasks'),
        createdBy: accountsRef[0].id,
        updatedBy: accountsRef[0].id
    })
);

export { accountsData, accountsRef, tasksData, tasksRef, profilesRef }

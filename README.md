# Miro's board to follow up the challenge brainstorming
https://miro.com/app/board/uXjVOb9JShc=/?invite_link_id=867348560105
# Pre-setup
- Recommended node version  v16.8.0
- Docker

# How to install
- yarn
- yarn build

# How to run
Create a `.env` file and add the following variables:
```
DATABASE_URL=tcp://postgres:password@localhost:5432/postgres4
DATABASE_SSL=false
DISABLE_HTTPS=true
```
- yarn start

# How to test
- yarn test

# Build and Run with Docker
- yarn docker-build
- yarn run-docker

# Getting Started with the Every.io engineering challenge.

Thanks for taking the time to complete the Every.io code challenge. Don't worry, it's not too hard, and please do not spend more than an hour or two. We know you have lots of these to do, and it can be very time consuming.

## The biggest factor will be your code:

1. How readable, is your code.
2. Scalability.
3. Are there any bugs.

## Requirements

You will be creating an API for a task application.

1. This application will have tasks with four different states:
   - To do
   - In Progress
   - Done
   - Archived
2. Each task should contain: Title, Description, and what the current status is.
3. A task can be archived and moved between columns, or statuses.
4. The endpoint for tasks should only display tasks for those users who have authenticated and are authorized to view their tasks.

## Ideal

- Typescript
- Tests
- Dockerized Application

## Extra credit

- Apollo Server GraphQL
- Logging

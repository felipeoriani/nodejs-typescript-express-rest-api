# task-service

Task Service is a sample application used to handle tasks by User. The base structure of a `Task` is:

```typescript
{
  id: string
  title: string
  description: string
  status: 'todo' | 'inProgress' | 'done' | 'archived'
  createdAt: Date
  userId: string
}
```

The REST API is protected by user authentication using a `bearer` token (JWT). To consume it, you must first authenticate using the `POST /api/v1/auth` endpoint passing the user credentials and use the token on the
This code exposes a REST API containing the following endpoints with some rules:

<table>
    <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Description</th>
        <th>Status</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/</td>
        <td>Base endpoint</td>
        <td>200 - OK</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/health</td>
        <td>Healthcheck for the API returning which can be configured on a container orchestration tool.</td>
        <td>200 - OK</td>
    </tr>
    <tr>
        <th colspan=4>User</th>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/auth</td>
        <td>Authenticate a user using credentials and database users.</td>
        <td>200 - OK<br>404 - Not Found</td>
    </tr>
    <tr>
        <th colspan=4>Tasks</th>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/tasks</td>
        <td>Returns all the tasks for the authenticated user. In case it's a super user request, return all the tasks.</td>
        <td>200 - OK</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/api/v1/tasks/:id</td>
        <td>Return a specific task by the given id and authenticated user. In case it's a super user, ignore the authenticated user.</td>
        <td>200 - OK<br />404 - Not Found</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/api/v1/tasks</td>
        <td>Save a new task for the authenticated user considering a valid request body.</td>
        <td>201 - Created<br />400 - Bad Request<br />422 - Unprocessable Entity</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/v1/tasks/:id</td>
        <td>Partially update an existing task for the authenticated user considering a valid request body. Only the title and description.</td>
        <td>200 - OK<br />400 - Bad Request<br />422 - Unprocessable Entity</td>
    </tr>
    <tr>
        <td>PATCH</td>
        <td>/api/v1/tasks/:id/status</td>
        <td>Change the status of a given task for the authenticated user considering a valid request body.<br/> A task can be moved to any status but once it is in the Archive status, it can't be moved anymore.</td>
        <td>200 - OK<br />400 - Bad Request<br />422 - Unprocessable Entity</td>
    </tr>
    <tr>
        <td>DELETE</td>
        <td>/api/v1/tasks/:id</td>
        <td>Delete a task by the given id for the authenticated user.<br/> It's a hard delete, the data will be lost once it succeed.</td>
        <td>204 - No Content<br />400 - Bad Request<br />404 - Not Found</td>
    </tr>
</table>

## Stack

## Architecture

## Tests

## CI/CD

## Improvements

- Custom error messages for schema validators, maybe considering globalization.

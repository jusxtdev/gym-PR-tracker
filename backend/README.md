# Gym PR Log API

## Databse
### DB Entites
- **User**
  - id int
  - username str unique
  - password
  - PRs [Personal_record]

- **Personal_record**
  - id int
  - exercise_title str
  - remarks str
  - weight float
  - reps int
  - PR float


  - userId 
  - user @relation(fields=["userId"], references=["id"]) 

  - createdAt time
  - updatedAt time

### DB Relations
- one(user) to many(workout) 


## API
### Auth
- JWT token based authentication
- tokens are stored as cookies but can also be passed as _Authorization headers_
- `/auth/signup`
- `/auth/signin`
- `/auth/logout`
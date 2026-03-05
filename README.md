# MyTeacher

## Auth (Teacher / Student) + Invitations + Reset Password

Ce document décrit la partie Auth du MVP :

- Teacher signup + login + session (`/me`) + logout
- Student signup uniquement via invitation (token)
- Invitations (teacher only)
- Reset password (forgot/reset)

  # Stack
  - Backend: Node.js / Express
  - DB: MongoDB (Atlas) via Mongoose
  - Auth: JWT stocké en cookie httpOnly

  # Setup Backend

  ## Variables d’environnement (backend/.env)

```env
# Mongo
CONNECTION_STRING=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/myteacher?retryWrites=true&w=majority
# JWT
JWT_SECRET=my_teacher_secret

```

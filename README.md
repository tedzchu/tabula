# Tabula - Vaal Your Notes

Following [this](https://medium.com/swlh/how-to-build-a-text-editor-like-notion-c510aedfdfcc) guide on building a Notion clone.

React (Next.js, TypeScript) web app connected to an Express.js backend with MongoDB Atlas server. Some backend implementation and initial styling taken from [konstantinmuenster](https://github.com/konstantinmuenster/notion-clone)'s own iteration.

## Environment variables

Backend:

```
FRONTEND_URL="http://localhost:3000"
DOMAIN="localhost"
JWT_KEY="yourSecretForTokenGeneration"
PORT=8080
MONGO_URI="mongodb+srv://username:password@cluster.gqqwp.gcp.mongodb.net/database?retryWrites=true&w=majority"
MAIL_HOST="smtp.sendgrid.net"
MAIL_PORT=465
MAIL_USER="apiKey"
MAIL_SENDER="Your Name <your@mail.com>"
MAIL_PASSWORD="yourSendGridApiKey"
```

Frontend:

```
NEXT_PUBLIC_API="http://localhost:8080" // references your Backend API endpoint
```

## Getting Started

Use `yarn start` for `backend` and `yarn run dev` for `frontend`

## Improvements

- Implement users (login, etc) on frontend
- Fix bug where closing the menu will not focus on the current block
- Fix bug where typing brings you to the end of the block (can't insert)
- Markdown support (in place of ContentEditable?)

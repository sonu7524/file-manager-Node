# File manager backend NodeJS
File manager application using Node.js, PostgreSQL, and AWS S3 bucket. The application should allow users to manage files and folders efficiently. The key features include the ability to create folders, create subfolders inside existing folders, upload files to the appropriate folders, and manage files within the file manager system.

## How to setup and run the api?
1. clone the repo
```
git clone https://github.com/sonu7524/file-manager-Node.git
```
2. install npm dependencies using
```
npm install
```

3. Once its done, setup env
```
PORT=5000

JWT_SECRET="set your own secret key"
JWT_EXPIRES_IN=90d

AWS_BUCKET_NAME="set your own aws s3 bucket name"
AWS_ACCESS_KEY_ID="set the access key"
AWS_SECRET_ACCESS_KEY="set the secret key"

DATABASE_URL="set the postgresql database url"
```

4. Make sure prisma and prisma client dependencies are installed if not then run.
```
npm install prisma @prisma/client
```

5. To map your data model to the database schema, we need to use the prisma migrate CLI commands:
```
npx prisma migrate dev --name init
```

6. Now run the server
```
npm run dev
```


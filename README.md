Setup

Clone the repo

Setup node, docker, and permit

Go to server directory then `npm install server` for backend

From directory server > .env file > give your PERMIT_KEY

In server, run command `npm run permit` to setup Permit, then run docker by

`sudo docker run -it -p 7766:7000 --env PDP_API_KEY=<YOUR_PERMIT_KEY> --env PDP_DEBUG=True permitio/pdp-v2:latest`

then open another terminal for server directory and run `npm run dev` to start the server.
From browser, it should be accesible by http://localhost:3333/api/resources

Go to client directory then `npm install client` for frontend.
From browser, it should be accesible by http://localhost:5173/resources

Right now frontend display only one dropdown to show resources. I can add more functionality as per requirements.

![Screenshot from 2024-11-04 11-45-29](https://github.com/user-attachments/assets/a8d9f034-e8ac-47f8-9e23-eff19360a936)


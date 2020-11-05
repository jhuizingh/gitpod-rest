# To run sample

- Copy the contents of `./signed_assertion` into clipboard within 5 minutes of starting the container. This is an expiring token that is created on container start. If you waited too long or need a new token, execute `npx ts-node scripts/sample2.tsx` in the terminal. This updates the `./signed_assertion` file.
- Open `rest/fhirenvironment/list.http` and place the clipboard contents after `&client_assertion=` on the same line.
- Click `Send Request` above the first request in `list.http` that you just modified. This gets the temporary auth token.
- Click `Send Request` above the second request in `list.http`. This gets fhirenvironments using the temporary auth token from the first request.


# Todo Ideas

- Create a script that runs the contents of `scripts/sample2.ts` in a loop to refresh the token right before it expires.
- Rerun the `/auth/token` call automatically when the token is expiring, after ^^^ is run.
- Get the `/auth/token` query to use an env var instead of copy/pasting 
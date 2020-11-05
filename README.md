# To run sample

- execute `npx ts-node scripts/sample2.tsx` in the termineal. This creates `./signed_assertion` file.
- Copy the contents of `./signed_assertion` into clipboard. 
- Open `rest/fhirenvironment/list.http` and place the clipboard contents after `&client_assertion=` on the same line.
- Click `Send Request` above the first request in `list.http` that you just modified. This gets the temporary auth token.
- Click `Send Request` above the second request in `list.http`. This gets fhirenvironments using the temporary auth token from the first request.
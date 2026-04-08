# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /password/edit

## connectionRequestRouter

//send request

- POST /request/send/:status/:userId

//received request

- POST /request/review/:status/:requestId

## userRouter

- GET /user/connections
- GET /user/Requests
- GET /user/feed - gives you the profile of other users on platform

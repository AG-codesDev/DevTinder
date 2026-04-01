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

- POST /request/send/interested/:userId
- POST /request/send/rejected/:userId

//received request

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/Requests
- GET /user/feed - gives you the profile of other users on platform

# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/:status/:userId
    - status [ignored, interested]
- POST /request/review/:status/:requestId
    - status [accepted, rejected]

## userRouter

- GET /users/requests/recieved
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepeted, rejected

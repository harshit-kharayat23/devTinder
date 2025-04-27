# DevTinder Apis


# authRouter
-POST /signUp
-POST /login
-POST /logout

# profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

# status:Ignore or Interested accpeted rejected

# connection request router
-POST /request/send/interested/:userId
-POST /requst/send/ingnored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:rejectedId

# userRouter
-GET/user/connections
-GET/user/requests
-GET/user/feed -profiles of other user
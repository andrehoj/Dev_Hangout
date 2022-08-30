# Developer Hangout
An application where users can talk to each other live.

# User Story
- AS A user
- I WANT to be able to signup or login to the chat app, see the messages in the app and post my on messages in the app
- SO THAT I can communicate to anyone on the app

# Signup User Story
- WHEN I arrive to the site root URL
- THEN I am presented with a signup or login page
- WHEN I input my credentials into the signup form
- THEN a POST request is made to the server to create my account
- IF my credentials are already in the database  
- THEN it will return with a message saying that I already have an account and to login instead
- IF my credentials are validated and added to the database 
- THEN my credentials are saved in session storage and I am logged in

-Mysql

-Sequelize

# Chat Hub User Story
- WHEN I log in
- THEN I am directed to a chat hub page where messages are displayed that have been previously added by other users to the database and pulled onto the site
- WHEN I input a message into the message text field and submit the message
- THEN a POST request is set to the server with my message and added to the database conversation table with a reference to my user account
- THEN the message is connected to the live server using Socket.IO and brought onto the front end for all users to see, the message is also timestamped to know where it should be inserted in the conversation
- WHEN a user subsequently submits a message, their message gets posted and through Socket.IO is displayed live on the front end for all logged in users to see.

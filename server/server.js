const fs = require('fs');
const {ApolloServer, gql} = require('apollo-server-express');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const {expressjwt} = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const port = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), bodyParser.json(), expressjwt({
  secret: jwtSecret,
  credentialsRequired: false,
  algorithms: ['RS256']
}));

const typeDefs =  gql(fs.readFileSync('./schema.graphql',{encoding: 'utf8'}));
const resolvers = require('./resolvers');


let apolloServer = null;
async function startServer() {
  let context = null;
  
  
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) =>({  ///req vorodi express
          token: req.headers.authorization,
      
          // try to retrieve a user with the token
         // user: getUser(token)
        })
       });
    await apolloServer.start();
    apolloServer.applyMiddleware({app,path:'/graphql'});
}
startServer();

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({sub: user.id}, jwtSecret);
  res.send({token});
});

app.listen(port, () => console.info(`Server started on port ${port}`));

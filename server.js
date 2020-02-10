const express = require("express");
const graphqlHttp = require("express-graphql");
const bodyParser = require("body-parser");

const { buildSchema } = require("graphql");

const app = express();

const data = [];

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
      type Event {
        _id: ID!
        name: String!
        address: String!
      }

      input InputEvent {
        name: String!
        address: String!
      }
      type RootQuery {
        events: [Event!]!
      }
      type RootMutation {
        createEvent(eventInput: InputEvent): Event
      }
      schema {
        query: RootQuery,
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return data;
      },
      createEvent: args => {
        const event = {
          _id: Math.random().toString(),
          name: args.eventInput.name,
          address: args.eventInput.address
        };
        data.push(event);
        return event;
      }
    },
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("Server is runnig at port 4000");
});

const { GraphQLServer } = require('./node_modules/graphql-yoga/dist');
const mongoose = require("mongoose");

//Connects to my MongoDB
mongoose.connect("mongodb://localhost/aglet");

//Models Schema
const Sneaker = mongoose.model('Sneaker', {
  name: String,
  ranking: { type: Number, min: 1, max: 100 },
  price: Number,
  colorway: String,
  ownership: Boolean
});

//Lists Query, Sneaker, and Mutation Types
const typeDefs = `
  type Query {
    getList: [Sneaker]
  }
  type Sneaker {
    id: ID!
    name: String!
    ranking: Int!
    price: Float!
    colorway: String!
    ownership: Boolean!
  }
  type Mutation {
    createSneaker(name: String!, ranking: Int!, price: Float!, colorway: String!, ownership: Boolean!): Sneaker
    updateSneaker(id: ID!, name: String, ranking: Int, price: Float, colorway: String, ownership: Boolean): Boolean
    updateOwnership(id: ID!, ownership: Boolean!): Boolean
    deleteSneaker(id: ID!): Boolean
  }
`
;

//Specifies what to do with each query or mutation
const resolvers = {
  Query: {
    getList: () => Sneaker.find(),
  },
  Mutation: {
    createSneaker: async (_, {name, ranking, price, colorway, ownership}) => {
      const new_sneaker = new Sneaker({name, ranking, price, colorway, ownership});
      await new_sneaker.save();
      return new_sneaker;
    },
    updateSneaker: async(_, {id, name, ranking, price, colorway, ownership}) => {
      await Sneaker.findByIdAndUpdate(id, {name, ranking, price, colorway, ownership});
      return true;
    },
    updateOwnership: async(_, {id, ownership}) => {
      await Sneaker.findByIdAndUpdate(id, {ownership});
      return true;
    },
    deleteSneaker: async(_, {id}) => {
      await Sneaker.findByIdAndRemove(id);
      return true;
    }
  }
};

//Connects Database and Creates Server
const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log('Server is running on localhost:4000'));
});

const { GraphQLServer } = require('./node_modules/graphql-yoga/dist');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/aglet");

const Sneaker = mongoose.model('Sneaker', {
  name: String,
  ranking: { type: Number, min: 1, max: 100 },
  price: Number,
  colorway: String,
  ownership: Boolean
});

//OLD ToDo Database
/*mongoose.connect("mongodb://localhost/test1");

const Todo = mongoose.model('Todo', {
    text: String,
    complete: Boolean
});*/

const typeDefs = `
  type Query {
    getList: Sneaker
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
    updateName(id: ID!, name: String!): Boolean
    updateRanking(id: ID!, ranking: Int!): Boolean
    updateOwnership(id: ID!, ownership: Boolean!): Boolean
    deleteSneaker(id: ID!): Boolean
  }
`
;

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
    updateName: async(_, {id, name}) => {
      await Sneaker.findByIdAndUpdate(id, {name});
      return true;
    },
    updateRanking: async(_, {id, ranking}) => {
      await Sneaker.findByIdAndUpdate(id, {ownership});
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

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
    server.start(() => console.log('Server is running on localhost:4000'));
});

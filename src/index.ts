import * as express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql-schema/schema';
import { root } from './graphql-schema/resolver';

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
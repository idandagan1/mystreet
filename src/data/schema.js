import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import content from './queries/content';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      content,
    },
  }),
});

export default schema;

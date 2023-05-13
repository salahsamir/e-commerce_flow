import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql"


export const imagetype=new GraphQLObjectType({
    name:"imageType",
    fields:{
        secure_url: {type:GraphQLString},
        public_id:{type:GraphQLString}
    }
 })
 export const object_type=new GraphQLObjectType({
    name:"fields",
    fields:{
        name:{type:GraphQLString},
        slug:{type:GraphQLString},
        isDeleted:{type:GraphQLBoolean},
        image:{type:imagetype},
        _id:{type:GraphQLID}
    }
})
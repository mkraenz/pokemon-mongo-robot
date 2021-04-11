# mongodb-demo

pokemon are cool

## Startup

[Mongo as a Docker container](https://hub.docker.com/_/mongo)

run in docker container and expose mongo port 27017 on localhost
`docker run -d --rm --hostname mongo --name mongo -p 27017:27017 mongo`

## MongoDb

ways to connect:

- GUI
- programmatic via a Driver (e.g. Nodejs driver <https://mongodb.github.io/node-mongodb-native/>)
- cli access (MongoDb shell)

### Dive into MongoDb inside a docker container

- `docker exec -it <CONTAINER_ID> /bin/bash` then `mongo`
- or directly `docker exec -it <CONTAINER_ID> mongo`

## MongoDb Architecture

- physical database, i.e. the mongodb server
- logical databases (db) - e.g. for each application/service a different database
- collections - e.g all users
- namespace = a logical db + a collection
- documents - e.g. a single user

## Relational DBs vs non-relational DBs

| Relational Dbs (SQL)                                   | Non-relational (document-based, No-SQL)     |
| ------------------------------------------------------ | ------------------------------------------- |
| schema-based (think classes)                           | schema-less (think json object)             |
| tables                                                 | collections                                 |
| records                                                | documents                                   |
| data format is pretty much known up front              | rapid prototyping                           |
| very fast                                              | fast but in some use-cases...               |
| normalized                                             | not normalized                              |
| avoids inconsistencies                                 | accepts/manually resolves inconsistencies   |
| (almost) no duplication                                | duplication somtimes accepted               |
| good for communication /forced to document (by schema) | (by default) no documentation, just data    |
| "type-safe"                                            | flexible                                    |
| migrations needed                                      | no migrations since no schema, but for data |

## Mongo CLI usage

[Cheatsheet](https://gist.github.com/michaeltreat/d3bdc989b54cff969df86484e091fd0c)

```shell
show dbs
use pokemonDB
db.createCollection('pokemon')
db.createCollection('trainers')
show collections
db.trainers.find({name:"Ashe"})
db.trainers.findOne({name:"Ashe"})
db.trainers.update({name:"Ashe"},{$set:{level:7}})
db.trainers.update({name:"Ashe"},{name:"Ash Clown"})
const t = db.trainers
t.update({name:"Misty"},{},{upsert:true})
t.deleteMany({name:{$exists:false}})
t.deleteOne({_id:ObjectId("6073170842691fc14f93caa4")})
```

## References

- [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
- [no-sql vs sql based Dbs](https://www.mongodb.com/nosql-explained/nosql-vs-sql)
- <https://en.wikipedia.org/wiki/Database_normalization>
- [schema for mongo -> mongoose](https://mongoosejs.com/)
- [Mongo Queries](https://docs.mongodb.com/manual/reference/operator/query/)
- [MongoDb NodeJS driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDb NodeJS API docs](https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertOne)
- [TypeScript Starter Template](https://github.com/bitjson/typescript-starter)

## Advanced

- [Indices](https://docs.mongodb.com/manual/indexes/) - make things fast
- [Aggregation Pipelines](https://docs.mongodb.com/manual/core/aggregation-pipeline/) - array.reduce() for lists of documents - can also be done completely on application level (TS/JS), but DB is probably faster

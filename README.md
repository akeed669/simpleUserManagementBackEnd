### Rename the test.env file to .env

### View logfile.log inside the running container for logs

### Access the node server via the container with the below command

#### docker exec -it <container_id> bash

#### Access the mongodb container to view collections and documents with below commands (in order)

##### docker exec -it <container_id> bash

##### mongosh

##### show dbs

##### use <db_name>

##### show collections

##### db.<collection_name>.find()

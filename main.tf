terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "docker" {}

# https://hub.docker.com/_/mongo
resource "docker_image" "mongo" {
  name         = "mongo:latest"
  keep_locally = true
}

resource "docker_image" "mongo_express" {
  name         = "mongo-express:latest"
  keep_locally = true
}

resource "docker_container" "mongo" {
  image   = docker_image.mongo.latest
  name    = "mongo"
  restart = "always"
  ports {
    internal = 27017
    external = 27017
  }
  # env = [
  #   "MONGO_INITDB_ROOT_USERNAME=var.mongo_admin_username",
  #   "MONGO_INITDB_ROOT_PASSWORD=var.mongo_admin_password"
  # ]

  volumes {
    host_path      = "/home/mirco/programming/mongodb-demo/mongo-data"
    container_path = "/tmp/mounts"
  }
}

resource "docker_container" "mongo_express" {
  image = docker_image.mongo_express.latest
  name  = "mongo_express"
  # restart = "always"
  ports {
    internal = 8081
    external = 8081
  }
  env = [
    "ME_CONFIG_MONGODB_SERVER=172.17.0.1", # static docker bridge network IP
    # "ME_CONFIG_MONGODB_PORT=27017",   
    # "ME_CONFIG_MONGODB_ADMINUSERNAME=var.mongo_admin_username",
    # "ME_CONFIG_MONGODB_ADMINPASSWORD=var.mongo_admin_password",
    # "ME_CONFIG_BASICAUTH_USERNAME=admin",
    # "ME_CONFIG_BASICAUTH_PASSWORD=ihavealongpassword"
  ]
}

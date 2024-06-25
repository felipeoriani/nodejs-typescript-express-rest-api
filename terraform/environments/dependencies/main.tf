locals {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "terraform-tasks-dependencies"
    key    = "dependencies"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.53"
    }
  }
}

provider "aws" {
  region = local.region

  default_tags {
    tags = {
      app         = var.app
      environment = var.environment
      owner       = "felipe"
      url         = "https://github.com/felipeoriani"
    }
  }
}

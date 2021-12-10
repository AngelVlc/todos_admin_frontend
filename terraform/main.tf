terraform {
  backend "pg" {
    schema_name = "d4sgcc1v32qe7o"
  }
}

variable "app_name" {
  description = "Name of the Heroku app provisioned"
}

terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 4.7.0"
    }
  }
}

resource "heroku_app" "default" {
  name   = "${var.app_name}"
  region = "eu"
  stack  = "container"
}

resource "heroku_config" "default" {
  sensitive_vars = {
  }
}

resource "heroku_app_config_association" "default" {
  app_id = "${heroku_app.default.id}"

  sensitive_vars = "${heroku_config.default.sensitive_vars}"
}

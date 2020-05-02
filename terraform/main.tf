terraform {
  backend "pg" {
    schema_name = "d4sgcc1v32qe7o"
  }
}

variable "heroku_username" {
  description = "Heroku user name"
}

variable "heroku_api_key" {
  description = "Heroku api key"
}

variable "app_name" {
  description = "Name of the Heroku app provisioned"
}

variable "backend_url" {
  description = "Backend url"
}

provider "heroku" {
  email   = "${var.heroku_username}"
  api_key = "${var.heroku_api_key}"
}

resource "heroku_app" "default" {
  name   = "${var.app_name}"
  region = "eu"
  stack  = "container"
}

resource "heroku_config" "default" {
  sensitive_vars = {
    REACT_APP_BACKEND_URL = "${var.backend_url}"
  }
}

resource "heroku_app_config_association" "default" {
  app_id = "${heroku_app.default.id}"

  sensitive_vars = "${heroku_config.default.sensitive_vars}"
}

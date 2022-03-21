variable "app_name" {
  description = "Name of the Heroku app to be provisioned"
}

variable "environment" {
  description = "Name of the environment to be provisioned"
}

variable "domain" {
  description = "Dns domain"
}

variable "backend_url" {
  description = "Backend url"
}
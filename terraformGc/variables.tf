variable "app_name" {
  description = "Name of the app to be provisioned"
}

variable "gc_project_id" {
  description = "Google Cloud Project Id"
}

variable "container_image" {
  description = "Container imaged used in the Cloud Run service"
}

variable "backend_url" {
  description = "Backend url"
}

resource "google_artifact_registry_repository" "todos_frontend_repo" {
  location      = "us-central1"
  repository_id = "todos-frontend"
  description   = "todos frontend repository"
  format        = "DOCKER"
}
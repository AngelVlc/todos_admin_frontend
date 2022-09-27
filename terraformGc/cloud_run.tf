resource "google_cloud_run_service" "run_service" {
  name     = var.app_name
  location = local.region

  template {
    spec {
      containers {
        image = var.container_image
        env {
          name  = "ENVIRONMENT"
          value = "production"
        }
        env {
          name  = "REACT_APP_BACKEND_URL"
          value = var.backend_url
        }
      }
      service_account_name = "todos-service-account"
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run]
}

resource "google_cloud_run_service_iam_member" "allUsers" {
  service  = google_cloud_run_service.run_service.name
  location = google_cloud_run_service.run_service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

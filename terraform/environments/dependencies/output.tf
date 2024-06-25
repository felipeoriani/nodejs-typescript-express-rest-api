output "task_service_repository_url" {
  value       = aws_ecr_repository.task_service_repository.repository_url
  description = "AWS ECR task service repository URL"
}

output "task_service_repository_name" {
  value       = aws_ecr_repository.task_service_repository.name
  description = "AWS ECR task service repository name"
}

output "task_service_repository_arn" {
  value       = aws_ecr_repository.task_service_repository.arn
  description = "AWS ECR task service repository ARN"
}

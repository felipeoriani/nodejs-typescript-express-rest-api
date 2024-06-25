locals {
  imageCountMoreThan = 3
}

resource "aws_ecr_repository" "task_service_repository" {
  name = "${var.app}-service-${var.environment}"
}

resource "aws_ecr_lifecycle_policy" "task_service_repository_policy" {
  repository = aws_ecr_repository.task_service_repository.name
  policy     = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Retain only the last ${local.imageCountMoreThan} images.",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": ${local.imageCountMoreThan}
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}

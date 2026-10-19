resource "aws_ecs_cluster" "main" {
  name = local.name_prefix

  setting {
    name = "containerInsights"
    # 低トラフィック期は追加メトリクス費用を避ける。必要になった時点で有効化する。
    value = "disabled"
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/${local.name_prefix}/api"
  retention_in_days = var.log_retention_days
}

locals {
  api_container_name = "api"

  api_environment = {
    CORS_ORIGINS            = "https://${var.web_domain}"
    MICROCMS_SERVICE_DOMAIN = var.microcms_service_domain
    MAIL_BACKEND            = "ses"
    MAIL_FROM               = var.mail_from
    CONTACT_NOTIFY_TO       = var.contact_notify_to
    MAIL_REPLY_TO           = var.contact_notify_to
    SES_CONFIGURATION_SET   = local.ses_configuration_set
    AWS_REGION              = var.aws_region
  }

  # Secrets ManagerのJSONのキーを個別の環境変数として注入する（値はタスク起動時に取得される）
  api_secrets = {
    DB_HOST              = aws_ssm_parameter.db_host.arn
    DB_PORT              = aws_ssm_parameter.db_port.arn
    DB_NAME              = aws_ssm_parameter.db_name.arn
    DB_USER              = aws_ssm_parameter.db_user.arn
    DB_PASSWORD          = aws_ssm_parameter.db_password.arn
    MICROCMS_API_KEY     = aws_ssm_parameter.microcms_api_key.arn
    TURNSTILE_SECRET_KEY = aws_ssm_parameter.turnstile_secret_key.arn
  }
}

# このタスク定義は初回作成用。以降はGitHub Actionsのデプロイが「このファミリーの最新リビジョン」を元に
# イメージだけを差し替えた新リビジョンを登録する。ここで環境変数などを変えた場合は、次回のデプロイで反映される。
resource "aws_ecs_task_definition" "api" {
  family                   = "${local.name_prefix}-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.api_cpu
  memory                   = var.api_memory
  execution_role_arn       = aws_iam_role.api_execution.arn
  task_role_arn            = aws_iam_role.api_task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{
    name      = local.api_container_name
    image     = "${data.aws_ecr_repository.api.repository_url}:${var.api_image_tag}"
    essential = true

    portMappings = [{ containerPort = local.api_port, protocol = "tcp" }]
    environment  = [for k, v in local.api_environment : { name = k, value = v }]
    secrets      = [for k, v in local.api_secrets : { name = k, valueFrom = v }]

    # ECS Exec のためにinitプロセスを有効にする（ゾンビプロセスの回収にもなる）
    linuxParameters = { initProcessEnabled = true }

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.api.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = local.api_container_name
      }
    }
  }])
}

resource "aws_ecs_service" "api" {
  name                   = "${local.name_prefix}-api"
  cluster                = aws_ecs_cluster.main.id
  task_definition        = aws_ecs_task_definition.api.arn
  desired_count          = var.public_enabled ? var.api_min_count : 0
  launch_type            = "FARGATE"
  platform_version       = "LATEST"
  enable_execute_command = var.enable_execute_command
  propagate_tags         = "SERVICE"

  # 新しいタスクが正常になってから古いタスクを止める。失敗したデプロイは自動で前のリビジョンへ戻す
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 60

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.api.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = local.api_container_name
    container_port   = local.api_port
  }

  # タスク定義はデプロイ（GitHub Actions）、タスク数はオートスケーリングが管理する
  lifecycle {
    ignore_changes = [task_definition]
  }

  depends_on = [aws_lb_listener.https]
}

# ---------------------------------------------------------------------------
# オートスケーリング（CPU使用率60%を目標に増減）
# ---------------------------------------------------------------------------
resource "aws_appautoscaling_target" "api" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = var.public_enabled ? var.api_min_count : 0
  max_capacity       = var.api_max_count
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "${local.name_prefix}-api-cpu"
  policy_type        = "TargetTrackingScaling"
  service_namespace  = aws_appautoscaling_target.api.service_namespace
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension

  target_tracking_scaling_policy_configuration {
    target_value       = 60
    scale_in_cooldown  = 300
    scale_out_cooldown = 60

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

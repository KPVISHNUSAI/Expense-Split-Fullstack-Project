# infrastructure/terraform/modules/cdn/main.tf

# S3 bucket for static assets
resource "aws_s3_bucket" "static_assets" {
  bucket = "${var.project_name}-${var.environment}-static-assets"

  tags = {
    Name        = "${var.project_name}-static-assets"
    Environment = var.environment
  }
}

# Bucket public access block
resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Bucket versioning
resource "aws_s3_bucket_versioning" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Bucket encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "static_assets" {
  comment = "OAI for ${var.project_name} static assets"
}

# S3 bucket policy for CloudFront access
resource "aws_s3_bucket_policy" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontAccess"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.static_assets.iam_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static_assets.arn}/*"
      }
    ]
  })
}

# CloudFront cache policy
resource "aws_cloudfront_cache_policy" "static_assets" {
  name        = "${var.project_name}-${var.environment}-cache-policy"
  comment     = "Cache policy for ${var.project_name} static assets"
  
  min_ttl     = var.min_ttl
  default_ttl = var.default_ttl
  max_ttl     = var.max_ttl

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]
      }
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} - ${var.environment}"
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class
  aliases             = var.environment == "production" ? [var.domain_name, "www.${var.domain_name}"] : ["${var.environment}.${var.domain_name}"]

  # Static assets origin
  origin {
    domain_name = aws_s3_bucket.static_assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.static_assets.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.static_assets.cloudfront_access_identity_path
    }
  }

  # Frontend Application origin
  origin {
    domain_name = var.alb_domain_name
    origin_id   = "ALB-Frontend"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default cache behavior for static assets
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.static_assets.id}"
    cache_policy_id        = aws_cloudfront_cache_policy.static_assets.id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # Frontend application behavior
  ordered_cache_behavior {
    path_pattern           = "/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "ALB-Frontend"
    cache_policy_id        = aws_cloudfront_cache_policy.static_assets.id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  tags = {
    Name        = "${var.project_name}-cdn"
    Environment = var.environment
  }
}

# CloudFront function for URL rewriting
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.project_name}-${var.environment}-url-rewrite"
  runtime = "cloudfront-js-1.0"
  publish = true
  code    = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      
      // Check if the URI doesn't end with a file extension
      if (!uri.includes('.')) {
        request.uri = '/index.html';
      }
      
      return request;
    }
  EOF
}

# WAF Web ACL association
resource "aws_wafv2_web_acl_association" "cloudfront" {
  count        = var.enable_waf ? 1 : 0
  resource_arn = aws_cloudfront_distribution.main.arn
  web_acl_arn  = var.waf_web_acl_arn
}
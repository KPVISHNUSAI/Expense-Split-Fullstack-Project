# infrastructure/terraform/modules/cdn/outputs.tf

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "Route53 zone ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.hosted_zone_id
}

output "s3_bucket_id" {
  description = "ID of the S3 bucket for static assets"
  value       = aws_s3_bucket.static_assets.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for static assets"
  value       = aws_s3_bucket.static_assets.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.static_assets.bucket_regional_domain_name
}

output "cloudfront_origin_access_identity_path" {
  description = "Path of the CloudFront origin access identity"
  value       = aws_cloudfront_origin_access_identity.static_assets.cloudfront_access_identity_path
}

output "cache_policy_id" {
  description = "ID of the CloudFront cache policy"
  value       = aws_cloudfront_cache_policy.static_assets.id
}

output "url_rewrite_function_arn" {
  description = "ARN of the URL rewrite function"
  value       = aws_cloudfront_function.url_rewrite.arn
}
# Infrastructure Outputs

- `aws_s3_bucket.influencerstudio.bucket` — Primary unified storage bucket for avatars, assets, and exports.
- `aws_cloudfront_distribution.influencerstudio.domain_name` — CDN endpoint to front the web app and static assets.

Refer to the Terraform module outputs or your deployment pipeline for propagation to application environments.

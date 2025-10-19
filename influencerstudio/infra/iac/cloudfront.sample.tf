resource "aws_cloudfront_distribution" "influencerstudio" {
  origin {
    domain_name = aws_s3_bucket.influencerstudio.bucket_regional_domain_name
    origin_id   = "influencerstudio-s3"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "influencerstudio-s3"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

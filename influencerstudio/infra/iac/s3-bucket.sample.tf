resource "aws_s3_bucket" "influencerstudio" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_policy" "allow_public_read" {
  bucket = aws_s3_bucket.influencerstudio.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = ["s3:GetObject"],
        Resource = "${aws_s3_bucket.influencerstudio.arn}/influencerstudio/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "cors" {
  bucket = aws_s3_bucket.influencerstudio.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["https://app.influencer.studio", "http://localhost:3000"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

variable "bucket_name" {
  description = "Name of the unified storage bucket"
  type        = string
}

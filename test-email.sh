#!/bin/bash

# Test Email Script
# Make sure MAILGUN_API_KEY is set in your environment or .env.local file

echo "Testing Mailgun email endpoint..."
echo ""

# Test with the exact format from Mailgun docs
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "EMILY CASTILLO <emilycastillox@gmail.com>",
    "subject": "Hello EMILY CASTILLO",
    "text": "Congratulations EMILY CASTILLO, you just sent an email with Mailgun! You are truly awesome!"
  }'

echo ""
echo ""
echo "Test complete!"

docker build -t publicchatweb .
docker run -d -p 34002:34002 --name publicchatweb publicchatweb
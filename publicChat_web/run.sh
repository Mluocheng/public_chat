docker build -t publicchatweb .
docker run -d -p 34006:34006 --name publicchatweb publicchatweb
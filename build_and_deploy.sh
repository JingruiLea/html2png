#!/bin/sh

# 获取当前时间戳（秒）
version=$(date +%s)
echo "The version is $version"

# 构建镜像
docker build . -t registry.ap-southeast-1.aliyuncs.com/pdfgpt/html2png:$version
docker push registry.ap-southeast-1.aliyuncs.com/pdfgpt/html2png:$version

# 部署到k8s
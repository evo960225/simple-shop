#!/bin/bash

# 設置變量
DB_NAME="eternal_alice"
DB_USER="alice"
DB_PASSWORD="okmijnuhb321"
BACKUP_DIR="/home/EternalAlice/psql_bak"
DATE=$(date +%Y%m%d_%H%M%S)

# 創建備份目錄（如果不存在）
mkdir -p $BACKUP_DIR

# 設置 PostgreSQL 密碼環境變量
export PGPASSWORD=$DB_PASSWORD

# 使用 pg_dump 進行備份
pg_dump -U $DB_USER -F t -b -f $BACKUP_DIR/${DB_NAME}_$DATE.tar $DB_NAME

# 取消設置 PostgreSQL 密碼環境變量
unset PGPASSWORD

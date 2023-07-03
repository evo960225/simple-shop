#!/bin/bash

BACKUP_DIR="/home/EternalAlice/psql_bak"
DAYS_TO_KEEP=60

find $BACKUP_DIR -type f -mtime +$DAYS_TO_KEEP -name "*.tar" -exec rm {} \;

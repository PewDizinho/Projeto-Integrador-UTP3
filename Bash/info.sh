#!/bin/bash

PROCESS_NAME="firefox"

while true; do
    PID=$(pgrep -o $PROCESS_NAME)

    if [ -z "$PID" ]; then
        continue
    fi

    CPU_USAGE=$(ps -p $PID -o %cpu | tail -n 1)
    MEMORY_USAGE=$(ps -p $PID -o %mem | tail -n 1)
    STORAGE_USAGE=$(du -sh /proc/$PID | cut -f1)
    COMMAND=$(ps -p $PID -o comm=)

    echo "Processo: $COMMAND"
    echo "PID: $PID"
    echo "Uso de CPU: $CPU_USAGE%"
    echo "Uso de Memória: $MEMORY_USAGE%"
    echo "Uso de Armazenamento: $STORAGE_USAGE"
    echo "-----------------------------"

    sleep 1
done

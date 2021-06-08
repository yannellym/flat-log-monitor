# etl-slack-service

Service for monitoring ETL Table updates.
Checks hourly if a certain period has passed since the last sync. If the period is more then specified it
send a slack notification to a channnel called `flat-log-monitor`

## Requirements
1. Node Version 12+
2. Docker

## Getting started
```npm install```
```npm start```

## Building and deployment
```docker build -f Dockerfile -t maikofelix89/flat-log-monitor:tagname:<version> .```

```docker run -d -it --name etl-flat-log-monitor maikofelix89/flat-log-monitor:tagname:c:<version> ``



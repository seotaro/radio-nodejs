PROJECT_ID := radiko-123456
APP := radio-nodejs
ZONE := asia-northeast1-b
REGION := asia-northeast1


build:
	docker-compose build


deploy:
	gcloud builds submit . --tag asia.gcr.io/$(PROJECT_ID)/$(APP) --project $(PROJECT_ID) 
	gcloud run deploy $(APP) \
		--project $(PROJECT_ID) \
		--image asia.gcr.io/$(PROJECT_ID)/$(APP) \
		--platform managed \
		--region $(REGION) \
		--memory 1Gi \
		--concurrency 5 \
		--max-instances 10 \
		--allow-unauthenticated

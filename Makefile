PROJECT_ID := radiko-123456
APP := radio-nodejs
ZONE := asia-northeast1-b


build:
	docker-compose build


deploy:
	gcloud builds submit . --tag asia.gcr.io/$(PROJECT_ID)/$(APP) --project $(PROJECT_ID) 
	# gcloud compute instances delete $(APP) --quiet --delete-disks=all --zone $(ZONE) --project $(PROJECT_ID)
	gcloud compute instances create-with-container $(APP) \
		--zone $(ZONE) \
		--project $(PROJECT_ID) \
		--container-image asia.gcr.io/$(PROJECT_ID)/$(APP) \
		--machine-type e2-medium

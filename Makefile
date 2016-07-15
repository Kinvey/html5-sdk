PROJECT = "Kinvey Html5 SDK"

clean: ;@echo "Cleaning ${PROJECT}..."; \
	rm -rf node_modules

install: ;@echo "Installing dependencies for ${PROJECT}..."; \
	npm install

test: ;@echo "Testing ${PROJECT}..."; \
	npm run test:jenkins

build: ;@echo "Building ${PROJECT}..."; \
	./node_modules/.bin/gulp default

upload: ;@echo "Uploading ${PROJECT} to S3..."; \
	./node_modules/.bin/gulp upload

publish: ;@echo "Publishing ${PROJECT}..."; \
	npm publish .

audit: clean install test
release: audit build upload publish

.PHONY: clean install test build upload publish audit release

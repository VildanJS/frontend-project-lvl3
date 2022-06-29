serve:
	npx webpack serve
build:
	rm -rf dist
	NODE_ENV=production npx webpack
install:
	npm ci
lint:
	npx eslint .
test:
	npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
link:
	npm link

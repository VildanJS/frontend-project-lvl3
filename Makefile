serve:
	npx webpack serve
build:
	npm run build
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

build:
	docker build --target base -t todos_base .

test:
	docker run -it --rm todos_base npm test

test-ci:
	docker run -it --rm --env CI=true todos_base npm test

build-release:
	docker build --target release -t todos_release --build-arg BACKEND_URL=${REACT_APP_BACKEND_URL} .

console:
	docker run -it --rm todos_base sh

run-release:
	docker run -it --rm -p 5000:5000 todos_release

console-release:
	docker run -it --rm -p 5000:5000 todos_release sh

audit:
	docker run -it --rm --env CI=true todos_base npm audit --production

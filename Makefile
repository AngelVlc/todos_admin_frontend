build:
	docker build --target base -t todos_admin_base .

test:
	docker run -it --rm todos_admin_base npm test

test-ci:
	docker run -it --rm --env CI=true todos_admin_base npm test

build-release:
	docker build --target release -t todos_admin_release --build-arg BACKEND_URL=${REACT_APP_BACKEND_URL} .

console:
	docker run -it --rm todos_admin_base sh

run-release:
	docker run -it --rm -p 5000:5000 todos_admin_release

console-release:
	docker run -it --rm -p 5000:5000 todos_admin_release sh

build:
	docker build --target base -t todos_admin_base .

build-release:
	docker build --target release -t todos_admin_release .

console:
	docker run -it --rm todos_admin_base sh

run-release:
	docker run -it --rm -p 5000:5000 todos_admin_release

console-release:
	docker run -it --rm -p 5000:5000 todos_admin_release sh

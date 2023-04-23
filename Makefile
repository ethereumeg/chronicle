.PHONY: all build

all: test build

test:
	deno test --unstable --allow-read utils/test.js

build:
	deno run --unstable --allow-read --allow-write utils/build.js

sync:
	deno run --unstable --allow-read --allow-write --allow-net utils/sync.js $(event)

fmt:
	deno fmt utils
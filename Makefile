CLIENT_DIR = web
GO_BIN = dist/memeapp
GO_MAIN = server.go

.PHONY: all build dev server client

all: build

build: server client

build_no_install: server client_no_install

client:
	@cd $(CLIENT_DIR) && pnpm install && pnpm run build

client_no_install:
	@cd $(CLIENT_DIR) && pnpm install && pnpm run build

server:
	@go build -o $(GO_BIN) $(GO_MAIN)

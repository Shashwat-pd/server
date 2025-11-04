# ⚡️ TypeScript HTTP Server

<p align="center">
  HTTP/1.1 server implemented in pure TypeScript to demystify how requests are parsed and handled over raw TCP sockets.
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white">
</p>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Motivation](#-motivation)
- [Features](#-features)
- [Demo](#-demo)
- [Getting Started](#-getting-started)
- [📖 Usage](#-usage)
- [Development Notes](#-development-notes)
- [🤝 Contributing](#-contributing)
- [Roadmap](#-roadmap)

## 🧭 Overview

This project spins up a raw TCP listener with `node:net`, consumes socket data line-by-line, and validates HTTP/1.1 request lines without frameworks or third-party helpers.
It is built to spin up a web server in a low-memory device for homelab.

## 💡 Motivation

I needed a shared grocery list with my roommate, but every “simple” solution demanded a heavy server my 2GB RAM, 128GB HDD laptop couldn’t handle. After struggling with bloated stacks, I built a lightweight, low-memory grocery-list service that’s easy to self-host and stays fast on old hardware.

## ✨ Features

- **Zero dependencies** – everything relies on the Node.js standard library.
- **Streaming parser** – converts socket chunks to CRLF-delimited frames via async iterables.
- **Type-safe internals** – request and utility layers are strongly typed end-to-end.
- **Composable primitives** – the async queue can back any producer/consumer workflow.

## 🎥 Demo

<p align="center">
  <img src="demo.gif" alt="Demo walkthrough" height="360">
</p>

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or newer
- npm 10.x (bundled with Node 20)

### Installation

```bash
npm install
npm run build
```

### Run the server

```bash
npm run start
curl -v http://localhost:42069/
```

## 📖 Usage

- `npm run start` — build and run the server on `localhost:42069`
- `npm run dev` — rebuild and restart automatically while you edit `src/`
- `npm run build` — emit compiled JavaScript into `dist/`

Quick test sequence:

```bash
npm run start
curl -v http://localhost:42069/
```

## 🛠️ Development Notes

- `AsyncQueue<T>` bridges push-based producers with async iterators, making it reusable for sockets, file streams, or child processes.
- `getLinesChannel` accumulates socket chunks until `\r\n`, yielding discrete lines without buffering an entire request.
- `getRequestLine` validates method, path, and protocol version early; malformed requests surface errors immediately.
- ESLint is available (configure a script) and tests are TBD—consider adding unit coverage for the parser and queue.

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Run `npm run build` to ensure the TypeScript sources compile cleanly.
3. Open a pull request describing the change and any follow-up ideas.

## 🧱 Roadmap

- Parse header fields and request bodies.
- Respond with minimal HTTP status lines and payloads.
- Add routing utilities or middleware hooks.
- Improve error handling and graceful shutdowns.
- Introduce integration tests against the TCP socket.

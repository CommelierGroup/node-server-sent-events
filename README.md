# node-server-sent-events

Implementing an SSE with Node.js

## What are Server-Sent Events (SSE)?

- [reference](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

> With server-sent events, it's possible for a server to send new data to a web page at any time, by pushing messages to
> the web page. These incoming messages can be treated as Events + data inside the web page.

## Prerequisite knowledge

- [node-http-2](https://github.com/JeHwanYoo/node-http-2)
- [EventSource(mdn)](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

## SSL Certification for localhost

```sh
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout ./src/privkey.pem -out ./src/cert.pem
```

This example is written in HTTP/2, so it requires an SSL connection.

## Start server

```sh
npm run start

```

- Event Source Server: https://localhost:8080/events
- Event Source Client: https://localhost:8080

<img src="assets/SSE%20TEST_.jpeg" alt="SSE TEST_.jpeg" style="width: 800px;" />

## Important Things

### Headers

```js
stream.respond({
  'content-type': 'text/event-stream',
  'cache-control': 'no-cache'
  // 'connection': 'keep-alive' // HTTP/1.1 only
})
```

- `content-type` should be `text/event-stream`
    - This header tells the browser that the server is sending a stream of
      events, which allows the browser to keep the connection open and wait for data to be pushed from the server.

- `cache-control` should be `no-cache`
    - This prevents the browser from caching the response, ensuring that the
      server-sent events are received in real-time.

- `connection`: This header is necessary in HTTP/1.1 to keep the connection alive, as by default HTTP/1.1 connections
  are not persistent unless specified. For SSE, it's often set to `keep-alive` to ensure that the connection remains
  open for the continuous flow of events. However, in HTTP/2, the `connection` header is unnecessary because HTTP/2
  inherently supports multiplexing and persistent connections without the need for a specific header.

### SSE message format

```js
  stream.write(`data: ${new Date().toISOString()}\n\n`)
```

- The data stream format for Server-Sent Events (SSE) must follow the pattern `data: {message}\n\n`.

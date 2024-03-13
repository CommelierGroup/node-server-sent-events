import * as http2 from 'node:http2'
import * as fs from 'node:fs'
import * as path from 'node:path'

const serverOptions = {
  key: fs.readFileSync(path.join(import.meta.dirname, 'privkey.pem')),
  cert: fs.readFileSync(path.join(import.meta.dirname, 'cert.pem'))
}

const server = http2.createSecureServer(serverOptions)
const html = fs.readFileSync(path.join(import.meta.dirname, 'index.html'))

server.on('error', err => console.error(err))

server.on('stream', (stream, headers) => {
  switch (headers[':path']) {
    case '/events':
      // SSE 헤더 설정
      stream.respond({
        // !IMPORTANT
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache', // 캐시 방지
        // 'connection': 'keep-alive' // HTTP/2 부터는 필요 없는 헤더
      })

      const interval = setInterval(() => {
        // 데이터를 클라이언트에 전송
        stream.write(`data: ${new Date().toISOString()}\n\n`)

        // 연결 확인
        stream.session.ping(err => {
          if (err) {
            console.error('[Ping Error]', err)
            clearInterval(interval)
            stream.end()
          }
        })
      }, 1000)

      // 연결 종료 처리
      stream.on('close', () => {
        console.log('close')
        clearInterval(interval)
      })

      break
    case '/':
      stream.respond({
        'content-type': 'text/html;charset=utf-8',
        ':status': 200
      })
      stream.end(html)
      break
    default:
      stream.respond({
        'content-type': 'text/html;charset=utf-8',
        ':status': 404
      })
      stream.end('<h1>404 NOT FOUND</h1>')
      break
  }
})

// 서버가 8443 포트에서 수신하도록 설정
server.listen(8888, () => {
  console.log('Server is running on https://localhost:8888')
})

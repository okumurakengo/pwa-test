```bash
#nodeで簡易サーバ
yarn add -D node-static
yarn static -p 8080
#phpで簡易サーバ
php -S 0.0.0.0:8080
#pythonで簡易サーバ
python3 -m http.server 8080
```

http://localhost:8080/

---

push通知用のサーバー起動

```bash
yarn
node push-server.js #localhost:8081で起動
```

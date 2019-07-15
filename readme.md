なんでもいいので簡易サーバーなどでlocalhostで表示する

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

const staticAssets = [
    "./",
    "./styles.css",
    "./app.js",
    "./fallback.json",
    "./images/no-fetch.jpg",
];

// Service Workerの 新規インストール/更新時 のイベント
self.addEventListener("install", async e => {
    const cache = await caches.open("news-static");
    cache.addAll(staticAssets);
});

// 何かしらのリクエストが発生した時のイベント
self.addEventListener("fetch", async e => {
    const req = e.request;
    const url = new URL(req.url)

    // respondWith()を使うことで、
    // 既定の fetch ハンドリングを抑止して、
    // 自分で Response用のPromiseを引数で指定できる
    if (url.origin === location.origin) {
        // 同一オリジン(今回はlocalhost)へのリクエストの場合
        e.respondWith(cacheFirst(req))
    } else {
        // 別オリジンへのリクエストの場合
        e.respondWith(networkFirst(req))
    }
});

/**
 * 同一オリジン(今回はlocalhost)へのリクエストの場合
 *
 * 指定のリクエストの結果が
 * キャッシュに存在する場合はキャッシュを返し、
 * キャッシュに存在しない場合はfetchでリクエストした結果を返す
 * 
 * 今回の場合だと、"./",　"./styles.css",　"./app.js" などへのリクエストが発生するとキャッシュから表示
 * それ以外のAjaxやimgなどのリクエストの場合はfetchしてそのままのレスポンスを表示する
 *
 * @param {RequestInfo} req
 * @returns {Promise<Response>}
 */
async function cacheFirst(req) {
    const cachedResponse = await caches.match(req)
    return cachedResponse || fetch(req)
}

/**
 * 別オリジンへのリクエストの場合
 * 
 * APIの情報は常に最新を表示するようにする
 * オフラインの場合に限りキャッシュを利用する
 *
 * 指定のリクエストをそのままfetchする
 * ↓
 * 1. 正常にレスポンスが取得できた場合
 *   - レスポンスをキャッシュに保存
 *   - レスポンスを返す
 * 2. オフラインなどでリクエストが失敗
 *   - キャッシュにあればそれを返す
 *   - キャッシュになければ fallback.json を返す
 *
 * @param {RequestInfo} req
 * @returns {Promise<Response>}
 */
async function networkFirst(req) {
    const cache = await caches.open("news-dynamic")

    try {
        const res = await fetch(req)
        cache.put(req, res.clone())
        return res;
    } catch (e) {
        const cachedResponse = await cache.match(req)
        return cachedResponse || await caches.match("./fallback.json")
    }
}

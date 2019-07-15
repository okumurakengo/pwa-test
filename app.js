const NEWS_API_KEY = "67ece92e536e4852a075c3a35621b9ea"; // 自分のapiキー
const main = document.querySelector("main");
const sourceSelector = document.querySelector("#sourceSelector");
const defaultSource = "abc-news-au";

const publicVapidKey = "BLGgW2eVUdKoSx2R4k80hCsTSLKPd0YmvHHm2CaW5JfXIlHm92sMHMUGOgBHpaweTRERkCyrT_42cDTmtWCF6zo";

(async () => {
    updateNews();
    await updateSources();

    // 画面表示時のプルダウンの初期値を設定
    sourceSelector.value = defaultSource;
    sourceSelector.addEventListener("change", e => {
        updateNews(e.target.value);
    });

    if ("serviceWorker" in navigator) {
        try {
            register = await navigator.serviceWorker.register("sw.js")
            console.log("SW registered")

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
            });
            console.log("Push registered");

            fetch("http://localhost:8081", {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Push Sent");
        } catch (e) {
            console.log("SW faild")
        }
    }
})();

/**
 * プルダウンの値を設定
 */
async function updateSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${NEWS_API_KEY}`);
    const json = await res.json();

    json.sources.forEach(src => {
        sourceSelector.insertAdjacentHTML("beforeend", `<option value="${src.id}">${src.name}</option>`);
    });
}

/**
 * ニュースの内容を表示
 * @param {string} source 
 */
async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/everything?q=${source}&apiKey=${NEWS_API_KEY}`);
    const json = await res.json();

    main.innerHTML = "";
    json.articles.forEach(article => {
        main.insertAdjacentHTML("beforeend", `
            <div class="article">
                <a href="${article.url}">
                    <h2>${article.title}</h2>
                    <img src="${article.urlToImage}">
                    <p>${article.description}</p>
                </a>
            </div>
        `);
    });
}

/**
 * @see https://github.com/web-push-libs/web-push#using-vapid-key-for-applicationserverkey
 * @param {string} base64String 
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const NEWS_API_KEY = "67ece92e536e4852a075c3a35621b9ea"; // 自分のapiキー
const main = document.querySelector("main");
const sourceSelector = document.querySelector("#sourceSelector");
const defaultSource = "abc-news-au";

(async () => {
    updateNews();
    await updateSources();

    // 画面表示時のプルダウンの初期値を設定
    sourceSelector.value = defaultSource;
    sourceSelector.addEventListener("change", e => {
        updateNews(e.target.value);
    });
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

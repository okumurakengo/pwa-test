const http = require("http");
const webpush = require("web-push");

const publicVapidKey = "BLGgW2eVUdKoSx2R4k80hCsTSLKPd0YmvHHm2CaW5JfXIlHm92sMHMUGOgBHpaweTRERkCyrT_42cDTmtWCF6zo";
const privateVapidKey = "1amdB2vaa5tm6YfV33LvguNJeutDLY0FoC7IzhZR-T8";

webpush.setVapidDetails(
    "mailto:test@test.com", // アプリケーションのmailtoまたはURL
    publicVapidKey,
    privateVapidKey
);

const server = http.createServer((req, res) => {
    // 今回は localhost:8080 -> localhost:8081 と
    // クロスドメインfetchでリクエストするので、corsの設定をしておく
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.end();
        return;
    }
});

server.on("request", async (req, res) => {
    if (req.method === "POST") {
        // リクエストボディのjson文字列を取得
        const subscription = await new Promise(resolve => {
            req.on("data", resolve);
        });

        try {
            // sendNotificationを実行すると、Service Workerでpushイベントを起こせました
            const payload = JSON.stringify({ title: "Push Test" });
            await webpush.sendNotification(JSON.parse(subscription), payload);
        } catch(e) {
            console.log(e)
        }
    }
    res.end();
});

server.listen(8081);
console.log("push server listening 8081");

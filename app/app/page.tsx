export const runtime = "edge";

export default async function Home() {
  // 本来はここで D1 からデータを取れるのだ
  // 例: const { results } = await process.env.DB.prepare("SELECT * FROM users LIMIT 5").all();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">CosmoTMT x Cloudflare Pages</h1>
        <p className="text-lg">
          ずんだもんなのだ！Cloudflare Edge Runtime で動いているのだ。
        </p>

        <div className="bg-gray-100 p-4 rounded-lg dark:bg-gray-800">
          <h2 className="font-semibold mb-2">現在の環境設定:</h2>
          <ul className="list-disc list-inside text-sm">
            <li>Runtime: Edge</li>
            <li>Database: Cloudflare D1 (Ready)</li>
            <li>Storage: Cloudflare R2 (Ready)</li>
          </ul>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare Docs
          </a>
        </div>
      </main>
    </div>
  );
}

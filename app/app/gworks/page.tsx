export const runtime = "edge";

import GWorksList from "./GWorksList";

export default async function GWorksPage() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  // start_date と end_date を取得するように修正
  const { results } = await db.prepare(`
    SELECT 
      w.*,
      (SELECT GROUP_CONCAT(t.name) FROM gwork_techs wt JOIN techs t ON wt.tech_id = t.id WHERE wt.gwork_id = w.id) as techs,
      (SELECT GROUP_CONCAT(r.name) FROM gwork_roles wr JOIN roles r ON wr.role_id = r.id WHERE wr.gwork_id = w.id) as roles,
      (SELECT GROUP_CONCAT(p.name) FROM gwork_platforms wp JOIN platforms p ON wp.platform_id = p.id WHERE wp.gwork_id = w.id) as platforms
    FROM gworks w
    ORDER BY w.created_at DESC
  `).all();

  const works = results.map((work: any) => {
    // 開発期間の文字列を作成
    let duration = "";
    if (work.start_date && work.end_date) {
      duration = `${work.start_date} 〜 ${work.end_date}`;
    } else if (work.start_date) {
      duration = `${work.start_date} 〜`;
    }

    return {
      ...work,
      duration, // 計算した期間をセット
      techs: work.techs ? work.techs.split(',') : [],
      roles: work.roles ? work.roles.split(',') : [],
      platforms: work.platforms ? work.platforms.split(',') : [],
    };
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">ゲーム作品</h1>
          <div className="h-1 w-20 bg-red-500 rounded-full"></div>
        </div>

        <GWorksList initialWorks={works} />
      </div>
    </div>
  );
}

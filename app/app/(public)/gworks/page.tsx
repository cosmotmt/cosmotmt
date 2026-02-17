export const runtime = "edge";

import { Metadata } from "next";
import GWorksList from "./GWorksList";

export const metadata: Metadata = {
  title: "ゲーム作品",
  description: "CosmoTmtがこれまでに開発したゲーム作品の一覧です。",
};

export default async function GWorksPage() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

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
    let duration = "";
    if (work.start_date && work.end_date) duration = `${work.start_date} 〜 ${work.end_date}`;
    else if (work.start_date) duration = `${work.start_date} 〜`;

    return {
      ...work,
      duration,
      techs: work.techs ? work.techs.split(',') : [],
      roles: work.roles ? work.roles.split(',') : [],
      platforms: work.platforms ? work.platforms.split(',') : [],
    };
  });

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-48 md:pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter mb-4 text-white">ゲーム作品</h1>
          <div className="h-1 w-20 bg-red-500 rounded-full"></div>
        </div>
        <GWorksList initialWorks={works} />
      </div>
    </div>
  );
}

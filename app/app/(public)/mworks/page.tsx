export const runtime = "edge";

import MWorksList from "./MWorksList";

export default async function MWorksPage() {
  const db = process.env.DB;
  if (!db) return <div>Database connection failed</div>;

  const { results } = await db.prepare(`
    SELECT 
      m.*,
      (SELECT GROUP_CONCAT(g.name) FROM mwork_genres mg JOIN genres g ON mg.genre_id = g.id WHERE mg.mwork_id = m.id) as genres,
      (SELECT GROUP_CONCAT(r.name) FROM mwork_roles mr JOIN roles r ON mr.role_id = r.id WHERE mr.mwork_id = m.id) as roles
    FROM mworks m
    ORDER BY m.created_at DESC
  `).all();

  const works = results.map((work: any) => {
    let duration = "";
    if (work.start_date && work.end_date) duration = `${work.start_date} 〜 ${work.end_date}`;
    else if (work.start_date) duration = `${work.start_date} 〜`;

    return {
      ...work,
      duration,
      genres: work.genres ? work.genres.split(',') : [],
      roles: work.roles ? work.roles.split(',') : [],
    };
  });

  return (
    <div className="min-h-screen pt-32 pb-40 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">音楽作品</h1>
          <div className="h-1 w-20 bg-red-500 rounded-full"></div>
        </div>
        <MWorksList initialWorks={works} />
      </div>
    </div>
  );
}

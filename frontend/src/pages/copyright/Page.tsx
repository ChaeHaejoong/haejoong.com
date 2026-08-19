export default function CopyrightPage() {
  const items = [
    {
      category: "폰트",
      entries: [
        {
          name: "LINE Seed Sans",
          author: "LINE Corporation",
          license: "LINE Fonts License",
          url: "https://seed.line.me/index_kr.html#seed-font",
        },
      ],
    },
    {
      category: "아이콘",
      entries: [
        {
          name: "Feather Icons",
          author: "Cole Bemis",
          license: "MIT License",
          url: "https://github.com/feathericons/feather",
        },
        {
          name: "Ant Design Icons",
          author: "Ant Design Team",
          license: "MIT License",
          url: "https://github.com/ant-design/ant-design-icons",
        },
        {
          name: "Ionicons",
          author: "Ionic",
          license: "MIT License",
          url: "https://github.com/ionic-team/ionicons",
        },
        {
          name: "Font Awesome",
          author: "Fonticons, Inc.",
          license: "CC BY 4.0 (아이콘) / MIT (코드)",
          url: "https://fontawesome.com",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto py-16 px-4">
      <p className="text-secondary text-sm mb-12">
        해중.com은 아래의 오픈소스 폰트 및 아이콘을 사용합니다.
      </p>

      <div className="space-y-10">
        {items.map((section) => (
          <section key={section.category}>
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
              {section.category}
            </h2>
            <div className="divide-y divide-divider border-t border-b border-divider">
              {section.entries.map((entry) => (
                <div key={entry.name} className="py-4 flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-title">{entry.name}</span>
                    <span className="text-xs text-muted shrink-0">
                      {entry.license}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-secondary">
                      {entry.author}
                    </span>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      링크 →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted">
        © {new Date().getFullYear()} Haejoong. All rights reserved.
      </p>
    </div>
  );
}

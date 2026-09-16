import { useCallback, useEffect, useRef, useState } from "react";

const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

const DESK_RIG_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7fmG3almyx5EkcgeWNnBBuY462ndCZM3rFjFnzY-e0aaNmLrw4ddCoeUnMVg-JJq9HEvkPH_X9abpZgDOwKoQ2ryzxKodJL3V_6fSHP-fE76fE6hxs_R8RFFW-xQCYPocy7UAvn4LtVyN24n7rd3KFaISTQxuSoTl4_DMl_KaChoB-0zB0_jiDIwzBn1l4fDkBjDZ6KLCehDDJw6692wz4Dpo9sKWXxzvci_ksFONRbMDXVxvVLYyLg";

/**
 *
 * - 样式令牌统一在 app/app.css 的 @theme 中定义
 * - 字体 / 图标字体通过 React 19 的 <link> 自动提升（hoist）到 <head>
 * - 原始内联 <script> 逻辑改写为 React 状态、ref 与事件处理
 */
export function Welcome({ message }: { message?: string }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const paletteInputRef = useRef<HTMLInputElement | null>(null);

  const runCommand = useCallback((raw: string) => {
    const val = raw.trim();
    if (!val) return;

    if (val === ":ping") {
      window.alert(
        "🌿 [SYS_PONG] 127.0.0.1 -> RTT: 0.12ms | 赛博空间一切正常，呼吸感良好。",
      );
    } else if (val === ":help") {
      window.alert(
        "极客简约博客快捷指令:\n:ping - 检查微网络延迟\n:tags - 查看全部分类标签\n:w    - 本地快照缓存同步\n/search - 全文检索",
      );
    } else if (val === ":tags") {
      window.alert(
        "已索引标签:\n#Rust, #LLM, #Architecture, #PKM, #Hardware, #LocalFirst, #CRDTs, #OfflineFirst",
      );
    } else if (val === ":w") {
      window.alert("✓ 快照已保存到本地离线存储。");
    } else {
      window.alert("已执行命令: " + val + " (OK)");
    }

    setPaletteOpen(false);
  }, []);

  // 同步 React 状态与原生 <dialog> 的模态行为
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (paletteOpen && !dialog.open) {
      dialog.showModal();
      paletteInputRef.current?.focus();
    } else if (!paletteOpen && dialog.open) {
      dialog.close();
    }
  }, [paletteOpen]);

  // ⌘K / Ctrl+K 打开（切换）命令面板
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href={FONT_STYLESHEET} />

      <div className="min-h-screen flex flex-col antialiased selection:bg-moss-200">
        {/* TOP MINIMAL NAVIGATION BAR */}
        <header className="w-full bg-[#f5faf6]/90 backdrop-blur-md border-b border-ink-line/70 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            {/* Brand & Status Pill */}
            <div className="flex items-center gap-3">
              <a
                className="font-mono font-semibold text-ink-title hover:text-moss-600 transition-colors flex items-center gap-1.5 text-sm tracking-tight"
                href="#"
              >
                <span className="text-moss-600">{">"}</span>
                <span>ywt0803</span>
              </a>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-subtle border border-ink-line text-[11px] text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-500 animate-pulse"></span>
                <span>online</span>
              </div>
            </div>
            {/* Navigation links */}
            <nav className="flex items-center gap-1 sm:gap-2 text-xs font-medium">
              <a
                className="px-2.5 py-1.5 rounded-md text-ink-title font-semibold bg-white border border-ink-line/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                href="#articles"
              >
                Articles
              </a>
              <a
                className="px-2.5 py-1.5 rounded-md text-ink-muted hover:text-ink-title hover:bg-surface-subtle transition-colors"
                href="#garden"
              >
                Garden
              </a>
              <a
                className="px-2.5 py-1.5 rounded-md text-ink-muted hover:text-ink-title hover:bg-surface-subtle transition-colors hidden sm:inline-block"
                href="#telemetry"
              >
                Rig Spec
              </a>
              {/* Search Trigger / Palette Button */}
              <button
                type="button"
                className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white border border-ink-line text-ink-muted hover:border-moss-500 hover:text-moss-700 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                onClick={() => setPaletteOpen(true)}
              >
                <span className="material-symbols-outlined text-[14px]">
                  search
                </span>
                <span className="hidden md:inline">⌘K</span>
              </button>
            </nav>
          </div>
        </header>

        {/* MAIN CONTAINER (Breathable modern geek column layout) */}
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full space-y-12">
          {/* HERO PROFILE / WHOAMI COMPACT BANNER */}
          <section className="bg-surface-card rounded-xl border border-ink-line p-6 md:p-8 shadow-[0_2px_8px_rgba(16,40,28,0.03)] space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Bio text */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-xs text-moss-700">
                  <span className="w-2 h-2 rounded-full bg-moss-500 inline-block"></span>
                  <span>usr@alex-box:~$ whoami --verbose</span>
                  <span className="text-ink-dim font-normal hidden sm:inline">
                    # {message || "UID 1000(alex)"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-ink-title font-normal tracking-tight">
                  独立前端架构师 & AI漫游者
                </h1>
                <p className="text-ink-muted text-sm leading-relaxed font-sans">
                  专注于自主掌控的数据闭环、低延迟本地优先（Offline-First）计算工具、极简代码拓扑与人机协同。在信息洪流中耕耘长青知识，坚持独立主机、端到端加密与静态协议。
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-moss-800 border border-moss-100">
                    #Rust
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-moss-800 border border-moss-100">
                    #LocalFirst
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-moss-800 border border-moss-100">
                    #CRDTs
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-moss-800 border border-moss-100">
                    #StaticWeb
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-moss-800 border border-moss-100">
                    #Ergonomics
                  </span>
                </div>
              </div>
              {/* Quick Telemetry Badges (Minimal Metric Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2.5 shrink-0 font-mono">
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-ink-line/60">
                  <div className="text-[10px] text-ink-dim uppercase">
                    Docs & Commits
                  </div>
                  <div className="text-base font-bold text-ink-title mt-0.5">
                    34{" "}
                    <span className="text-xs font-normal text-moss-600">
                      posts
                    </span>
                  </div>
                  <div className="w-full bg-ink-line/60 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-moss-500 h-full w-[78%]"></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-ink-line/60">
                  <div className="text-[10px] text-ink-dim uppercase">
                    Garden Nodes
                  </div>
                  <div className="text-base font-bold text-ink-title mt-0.5">
                    182{" "}
                    <span className="text-xs font-normal text-moss-600">
                      notes
                    </span>
                  </div>
                  <div className="w-full bg-ink-line/60 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-moss-600 h-full w-[64%]"></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-ink-line/60">
                  <div className="text-[10px] text-ink-dim uppercase">
                    Open Repos
                  </div>
                  <div className="text-base font-bold text-ink-title mt-0.5">
                    12{" "}
                    <span className="text-xs font-normal text-moss-600">
                      labs
                    </span>
                  </div>
                  <div className="w-full bg-ink-line/60 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-moss-500 h-full w-[92%]"></div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-ink-line/60">
                  <div className="text-[10px] text-ink-dim uppercase">
                    Host Uptime
                  </div>
                  <div className="text-base font-bold text-ink-title mt-0.5">
                    1,428
                    <span className="text-xs font-normal text-ink-dim">d</span>
                  </div>
                  <div className="text-[10px] text-moss-600 mt-1 flex items-center gap-1 font-sans">
                    <span>● 100% available</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TWO-COLUMN CONTENT GRID (Articles on Left, Garden & Specs on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: FEATURED ESSAY & LOGS (8 COLS) */}
            <div className="lg:col-span-8 space-y-10" id="articles">
              {/* FEATURED LONGFORM ESSAY CARD */}
              <article className="bg-surface-card rounded-xl border border-ink-line p-6 md:p-7 shadow-[0_2px_8px_rgba(16,40,28,0.03)] space-y-6">
                {/* Metadata Frontmatter Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-ink-line/60 text-xs font-mono text-ink-muted">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-moss-100 text-moss-800 font-semibold text-[11px]">
                      PINNED ESSAY
                    </span>
                    <span>2025-02-28</span>
                    <span className="text-ink-dim">·</span>
                    <span>12 min read</span>
                  </div>
                  <span className="text-[11px] text-ink-dim">
                    commit #4a9f0e8
                  </span>
                </div>
                {/* Essay Title & Abstract */}
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-serif text-ink-title font-semibold tracking-tight leading-snug">
                    AI 驱动下的个人软件范式转移：从流水线工件到涌现式环境
                  </h2>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    当大语言模型从单点代码生成走向全链路上下文合成，软件交付物不再是不可侵入的固态黑盒。探讨自制小型
                    DSL、动态局部重编译以及如何构建随时响应个人意图的自省式数字空间。
                  </p>
                </div>
                {/* Clean Latency Telemetry Diagram */}
                <div className="rounded-lg bg-surface-subtle p-4 border border-ink-line/70 font-mono text-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[11px] text-ink-dim">
                    <span className="font-semibold text-moss-800">
                      FIG 1.0 — PIPELINE_FLOW_TELEMETRY
                    </span>
                    <span className="text-moss-600 font-medium">
                      TOTAL LATENCY: 4.8ms
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                    <div className="bg-white p-2 rounded border border-ink-line">
                      <div className="text-ink-dim text-[10px]">0.2ms</div>
                      <div className="font-semibold text-ink-title mt-0.5">
                        Intent
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-ink-line">
                      <div className="text-ink-dim text-[10px]">0.8ms</div>
                      <div className="font-semibold text-ink-title mt-0.5">
                        DSL Parse
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-ink-line">
                      <div className="text-ink-dim text-[10px]">1.4ms</div>
                      <div className="font-semibold text-ink-title mt-0.5">
                        CRDT Journal
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-ink-line">
                      <div className="text-ink-dim text-[10px]">2.4ms</div>
                      <div className="font-semibold text-moss-700 mt-0.5">
                        Wasm JIT
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-ink-dim flex justify-between pt-1">
                    <span>Sampling: 1000Hz continuous</span>
                    <span className="text-moss-600 font-medium">
                      State: Coherent
                    </span>
                  </div>
                </div>
                {/* Essay Excerpt Quote */}
                <div className="border-l-2 border-moss-500 pl-4 py-1 italic font-serif text-ink-title text-sm md:text-base">
                  "Software should be like clay in the hands of its users, not
                  like pre-molded plastic injection."
                </div>
                {/* Elegant Code Specimen Block */}
                <div className="rounded-lg bg-[#0a1a12] text-[#d6ede0] p-4 text-xs font-mono overflow-x-auto border border-moss-900/40">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/10 text-[10px] text-moss-200/60">
                    <span>src/engine/crdt_matrix.rs (rust-edition-2024)</span>
                    <span className="text-moss-400">UTF-8</span>
                  </div>
                  <pre className="leading-relaxed">
                    <code>
                      <span className="text-[#729c83]">
                        {"// 极简本地优先状态同步原语"}
                      </span>
                      {"\n"}
                      <span className="text-[#4edea3] font-semibold">
                        pub struct
                      </span>{" "}
                      <span className="text-white font-bold">
                        LocalStateKernel
                      </span>{" "}
                      {"{"}
                      {"\n"}
                      {"    "}
                      <span className="text-[#96b8a4]">peer_id</span>
                      {": "}
                      <span className="text-[#6ffbbe]">PeerId</span>
                      {","}
                      {"\n"}
                      {"    "}
                      <span className="text-[#96b8a4]">journal</span>
                      {": "}
                      <span className="text-[#6ffbbe]">Arc</span>
                      {"<"}
                      <span className="text-[#6ffbbe]">Mutex</span>
                      {"<"}
                      <span className="text-[#6ffbbe]">VectorClock</span>
                      {">>"}
                      {","}
                      {"\n"}
                      {"}"}
                      {"\n"}
                      {"\n"}
                      <span className="text-[#4edea3] font-semibold">
                        impl
                      </span>{" "}
                      <span className="text-white font-bold">
                        LocalStateKernel
                      </span>{" "}
                      {"{"}
                      {"\n"}
                      {"    "}
                      <span className="text-[#4edea3] font-semibold">
                        pub fn
                      </span>{" "}
                      <span className="text-[#6ffbbe]">dispatch_intent</span>
                      {"(&"}
                      <span className="text-[#4edea3]">mut</span>
                      {" self, prompt: &"}
                      <span className="text-[#6ffbbe]">str</span>
                      {") -> "}
                      <span className="text-[#6ffbbe]">Result</span>
                      {"<"}
                      <span className="text-[#6ffbbe]">OpDelta</span>
                      {", "}
                      <span className="text-[#ff7582]">KernelErr</span>
                      {"> {"}
                      {"\n"}
                      {"        "}
                      <span className="text-[#96b8a4]">let</span>
                      {" patch = self.eval_ast_local(prompt)?"}
                      {";"}
                      {"\n"}
                      {"        self.journal.lock().record(&patch);"}
                      {"\n"}
                      {"        "}
                      <span className="text-[#6ffbbe]">Ok</span>
                      {"(patch)"}
                      {"\n"}
                      {"    }"}
                      {"\n"}
                      {"}"}
                    </code>
                  </pre>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-ink-dim">
                    <span>Tags:</span>
                    <span className="text-moss-700">#Rust</span>
                    <span className="text-moss-700">#Architecture</span>
                  </div>
                  <a
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-moss-700 hover:text-moss-800 transition-colors"
                    href="#"
                  >
                    <span>阅读全文 (Read Buffer)</span>
                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </article>

              {/* RECENT ESSAYS & COMMIT STREAM */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-ink-muted font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-moss-600"></span>
                    <span>Recent Logs & Essays</span>
                  </h3>
                  <span className="text-xs font-mono text-ink-dim">
                    34 records
                  </span>
                </div>
                <div className="space-y-3">
                  {/* Article 1 */}
                  <a
                    className="block group bg-surface-card rounded-xl border border-ink-line p-4 md:p-5 hover:border-moss-500/80 hover:shadow-[0_4px_12px_rgba(16,40,28,0.04)] transition-all"
                    href="#"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono text-ink-dim mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-moss-700 font-semibold">
                          2025-02-14
                        </span>
                        <span>·</span>
                        <span className="text-ink-muted font-mono">
                          commit #9ef38a2
                        </span>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-subtle text-moss-800 text-[10px]">
                          PKM_ENGINE
                        </span>
                      </div>
                      <span className="text-[11px]">8 min read</span>
                    </div>
                    <h4 className="font-serif text-lg text-ink-title font-medium group-hover:text-moss-700 transition-colors">
                      构建属于自己的离线优先知识引擎 (Offline-First PKM)
                    </h4>
                    <p className="text-ink-muted text-xs font-sans mt-1 line-clamp-2 leading-relaxed">
                      放弃云服务绑定，基于 CRDTs、Local-First SQLite
                      与端对端加密同步协议打造随身认知中枢。
                    </p>
                  </a>
                  {/* Article 2 */}
                  <a
                    className="block group bg-surface-card rounded-xl border border-ink-line p-4 md:p-5 hover:border-moss-500/80 hover:shadow-[0_4px_12px_rgba(16,40,28,0.04)] transition-all"
                    href="#"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono text-ink-dim mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-moss-700 font-semibold">
                          2025-01-20
                        </span>
                        <span>·</span>
                        <span className="text-ink-muted font-mono">
                          commit #4b88d2f
                        </span>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-subtle text-moss-800 text-[10px]">
                          WEB_ARCH
                        </span>
                      </div>
                      <span className="text-[11px]">15 min read</span>
                    </div>
                    <h4 className="font-serif text-lg text-ink-title font-medium group-hover:text-moss-700 transition-colors">
                      现代前端渲染架构批判：重返轻量级与静态原生
                    </h4>
                    <p className="text-ink-muted text-xs font-sans mt-1 line-clamp-2 leading-relaxed">
                      重构当下复杂水合链条的臃肿陷阱，探索 Islands
                      Architecture、轻量 Web Components
                      与无构建流水线的长青价值。
                    </p>
                  </a>
                  {/* Article 3 */}
                  <a
                    className="block group bg-surface-card rounded-xl border border-ink-line p-4 md:p-5 hover:border-moss-500/80 hover:shadow-[0_4px_12px_rgba(16,40,28,0.04)] transition-all"
                    href="#"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono text-ink-dim mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-moss-700 font-semibold">
                          2024-12-05
                        </span>
                        <span>·</span>
                        <span className="text-ink-muted font-mono">
                          commit #00d5a1b
                        </span>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-subtle text-moss-800 text-[10px]">
                          HARDWARE
                        </span>
                      </div>
                      <span className="text-[11px]">11 min read</span>
                    </div>
                    <h4 className="font-serif text-lg text-ink-title font-medium group-hover:text-moss-700 transition-colors">
                      硬件极客周记：自制分体人体工学机械键盘与固件调校
                    </h4>
                    <p className="text-ink-muted text-xs font-sans mt-1 line-clamp-2 leading-relaxed">
                      Corne 42 键布局、ZMK 无线多层固件、Trackball
                      拇指滚球集成与三维打印倾斜壳体打样实录。
                    </p>
                  </a>
                </div>
              </section>

              {/* HARDWARE PHOTO & WORKSPACE SHOWCASE (PRESERVED IMAGE) */}
              <section className="bg-surface-card rounded-xl border border-ink-line p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-title font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-moss-600">
                      photo_camera
                    </span>
                    <span>Physical Computing & Desk Rig 2025</span>
                  </span>
                  <span className="text-ink-dim">ISO: 400 · 1/60s</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-5/12 shrink-0 rounded-lg overflow-hidden border border-ink-line relative">
                    <img
                      className="w-full h-36 object-cover contrast-[1.05]"
                      alt="A clean top-down aesthetic cyberpunk desk workspace in dim moody lighting, featuring an ergonomic split mechanical keyboard with customized green backlighting, a matte black terminal laptop with code streams, soldering kit, and tiny potted succulents."
                      src={DESK_RIG_IMAGE}
                    />
                    <div className="absolute bottom-1 right-1 bg-ink-title/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[9px] font-mono">
                      DESK_RIG_2025.raw
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-ink-muted leading-relaxed font-sans">
                      工作台配置已完整同步至开源仓：包含 Corne 42 键 3D 打印 STL
                      壳体外壳、ZMK 固件宏拓扑与烙铁焊接温控规格清单。
                    </p>
                    <div className="pt-1 flex items-center gap-3 font-mono text-[11px]">
                      <a
                        className="text-moss-700 hover:text-moss-800 font-semibold underline underline-offset-2"
                        href="#"
                      >
                        查看硬件 BOM 源码清单 {">"}
                      </a>
                      <span className="text-ink-dim">SHA256: e8b0...42c1</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: DIGITAL GARDEN & SPECS (4 COLS) */}
            <aside className="lg:col-span-4 space-y-6" id="garden">
              {/* DIGITAL GARDEN CARD */}
              <div className="bg-surface-card rounded-xl border border-ink-line p-5 space-y-4 shadow-[0_2px_8px_rgba(16,40,28,0.03)]">
                <div className="flex items-center justify-between border-b border-ink-line/60 pb-3">
                  <h3 className="font-mono text-xs font-bold text-ink-title flex items-center gap-1.5">
                    <span className="text-moss-600">🌿</span>
                    <span>AI苗圃 (GARDEN)</span>
                  </h3>
                  <span className="font-mono text-[11px] text-ink-dim">
                    182 nodes
                  </span>
                </div>
                <div className="space-y-3 font-sans text-xs">
                  {/* Seedling 1 */}
                  <div className="p-3 rounded-lg bg-surface-subtle border border-ink-line/60 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-ink-title">
                        🌱 幼苗: Local LLM Agent 编排
                      </span>
                      <span className="font-mono text-[11px] text-moss-700 font-semibold">
                        25%
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted">
                      测试与微型 SQLite 向量索引协同
                    </p>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-ink-line/50">
                      <div className="bg-moss-500 h-full w-[25%] rounded-full"></div>
                    </div>
                  </div>
                  {/* Seedling 2 */}
                  <div className="p-3 rounded-lg bg-surface-subtle border border-ink-line/60 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-ink-title">
                        🌿 萌芽: 个人财务双录账本自动化
                      </span>
                      <span className="font-mono text-[11px] text-moss-700 font-semibold">
                        60%
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted">
                      纯文本 Beancount + Telegram OCR Bot
                    </p>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-ink-line/50">
                      <div className="bg-moss-600 h-full w-[60%] rounded-full"></div>
                    </div>
                  </div>
                  {/* Seedling 3 */}
                  <div className="p-3 rounded-lg bg-surface-subtle border border-ink-line/60 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-ink-title">
                        🌲 常青: 纯静态个人索引网络
                      </span>
                      <span className="font-mono text-[11px] text-moss-700 font-semibold">
                        100%
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted">
                      去中心化 RSS 与 Webmention 聚合中继
                    </p>
                    <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-ink-line/50">
                      <div className="bg-moss-700 h-full w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                <a
                  className="block text-center py-2 rounded-lg bg-surface-subtle hover:bg-moss-100/60 border border-ink-line font-mono text-[11px] text-moss-800 font-semibold transition-colors"
                  href="#"
                >
                  浏览全部 182 篇花园笔记 {">"}
                </a>
              </div>

              {/* DEV RIG SPECIFICATIONS */}
              <div
                className="bg-surface-card rounded-xl border border-ink-line p-5 space-y-3 shadow-[0_2px_8px_rgba(16,40,28,0.03)]"
                id="telemetry"
              >
                <div className="flex items-center justify-between border-b border-ink-line/60 pb-2.5 font-mono text-xs">
                  <span className="font-bold text-ink-title flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-moss-600">
                      terminal
                    </span>
                    <span>DEV_RIG_SPEC</span>
                  </span>
                  <span className="text-[10px] text-moss-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-moss-500"></span>
                    <span>LIVE</span>
                  </span>
                </div>
                <div className="font-mono text-[11px] space-y-2">
                  <div className="flex justify-between py-1 border-b border-ink-line/40">
                    <span className="text-ink-dim">CORE HOST</span>
                    <span className="text-ink-title font-medium">
                      Apple M3 Max · 64GB
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-line/40">
                    <span className="text-ink-dim">INPUT RIG</span>
                    <span className="text-ink-title font-medium">
                      Corne Cherry 42K Split
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-line/40">
                    <span className="text-ink-dim">OS / VM</span>
                    <span className="text-ink-title font-medium">
                      Arch Linux (VM) + Podman
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-line/40">
                    <span className="text-ink-dim">SHELL / IDE</span>
                    <span className="text-ink-title font-medium">
                      Neovim (Lua) + Fish
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-dim">FONT CONFIG</span>
                    <span className="text-ink-title font-medium">
                      JetBrains Mono NL
                    </span>
                  </div>
                </div>
              </div>

              {/* NOW PLAYING WIDGET (Minimal Lo-Fi Card) */}
              <div className="bg-surface-card rounded-xl border border-ink-line p-4 space-y-2 shadow-[0_2px_8px_rgba(16,40,28,0.03)] font-mono text-xs">
                <div className="flex items-center justify-between text-ink-dim text-[10px]">
                  <span className="text-moss-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">
                      graphic_eq
                    </span>
                    <span>NOW_PLAYING (MPD)</span>
                  </span>
                  <span>128kbps Lo-Fi</span>
                </div>
                <div className="text-ink-title font-medium truncate text-[11px]">
                  {"Master Boot Record - C:\\> CHKDSK /F"}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-ink-dim pt-0.5">
                  <span>02:44</span>
                  <div className="flex-1 bg-surface-subtle h-1 rounded-full overflow-hidden border border-ink-line/40">
                    <div className="bg-moss-500 h-full w-[45%]"></div>
                  </div>
                  <span>05:12</span>
                </div>
              </div>

              {/* DISTRIBUTED PEERS MINI BADGE */}
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-ink-line font-mono text-[10px] space-y-1 text-ink-muted">
                <div className="flex items-center justify-between text-ink-title font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-moss-500"></span>
                    <span>PEERS: 42 CONNECTED</span>
                  </span>
                  <span className="text-moss-700">ED25519</span>
                </div>
                <div className="text-ink-dim">
                  PROTOCOLS: IPFS / GUN_DB / NOSTR MATRIX
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* MINIMAL COMMAND BAR / PALETTE FOOTER (CLEAN & NON-INTRUSIVE) */}
        <footer className="w-full border-t border-ink-line/80 bg-white py-4 mt-12 text-xs font-mono select-none">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="text-moss-600 font-bold">{">"}</span>
              <input
                autoComplete="off"
                className="bg-transparent text-ink-title placeholder:text-ink-dim outline-none text-xs border-none p-0 focus:ring-0 w-64 sm:w-80"
                id="cmd-quick-input"
                placeholder="输入 :help, :tags, :ping, 或 /search..."
                spellCheck={false}
                type="text"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    runCommand(event.currentTarget.value);
                    event.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-ink-dim">
              <span className="hidden md:inline">⌘K Command Palette</span>
              <span>·</span>
              <span>
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle border border-ink-line text-ink-title text-[10px]">
                  {"<Enter>"}
                </kbd>{" "}
                to run
              </span>
              <span>·</span>
              <span>© 2025 alex.garden</span>
            </div>
          </div>
        </footer>

        {/* CLEAN DIALOG COMMAND PALETTE (ACCESSIBLE VIA ⌘K or BUTTON) */}
        <dialog
          ref={dialogRef}
          id="cmd-dialog"
          onClose={() => setPaletteOpen(false)}
          onCancel={() => setPaletteOpen(false)}
          className="backdrop:bg-ink-title/20 backdrop:backdrop-blur-sm p-0 rounded-xl shadow-2xl border border-ink-line max-w-lg w-full bg-white overflow-hidden text-ink-body"
        >
          <div className="p-3 border-b border-ink-line flex items-center gap-2">
            <span className="material-symbols-outlined text-ink-dim text-sm">
              search
            </span>
            <input
              ref={paletteInputRef}
              id="palette-search"
              className="w-full bg-transparent border-none text-xs font-mono text-ink-title focus:ring-0 p-0 placeholder:text-ink-dim"
              placeholder="输入指令或搜索知识库 (:help, :tags, :w)..."
              type="text"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  runCommand(event.currentTarget.value);
                  event.currentTarget.value = "";
                }
              }}
            />
            <button
              type="button"
              className="text-ink-dim hover:text-ink-title text-xs font-mono px-1"
              onClick={() => setPaletteOpen(false)}
            >
              ESC
            </button>
          </div>
          <div className="p-2 space-y-1 font-mono text-xs">
            <div
              className="px-2 py-1.5 hover:bg-surface-subtle rounded cursor-pointer flex justify-between items-center text-ink-title"
              onClick={() => runCommand(":help")}
            >
              <span>:help — 查看可用极简命令</span>
              <span className="text-[10px] text-ink-dim">{"<CR>"}</span>
            </div>
            <div
              className="px-2 py-1.5 hover:bg-surface-subtle rounded cursor-pointer flex justify-between items-center text-ink-title"
              onClick={() => runCommand(":tags")}
            >
              <span>:tags — 列出所有分类元标签</span>
              <span className="text-[10px] text-ink-dim">{"<CR>"}</span>
            </div>
            <div
              className="px-2 py-1.5 hover:bg-surface-subtle rounded cursor-pointer flex justify-between items-center text-ink-title"
              onClick={() => runCommand(":ping")}
            >
              <span>:ping — 测试节点网络延迟</span>
              <span className="text-[10px] text-ink-dim">{"<CR>"}</span>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}

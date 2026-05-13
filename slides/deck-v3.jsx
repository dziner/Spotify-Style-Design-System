// deck-v3.jsx — SCM Go/No-Go + 12주 실행안 (20 slides · infographic redesign)

const { useEffect, useState, useRef } = React;
const ACCENT = '#1ed760';
const ACCENT_SOFT = 'rgba(30,215,96,0.10)';
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

/* ─── AutoStage ─────────────────────────────────────────────────────── */
function AutoStage({ duration = 14, children }) {
  const [time, setTime] = useState(0);
  const sentinelRef = useRef(null);
  useEffect(() => {
    let raf = null, last = null;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000; last = ts;
      setTime(t => t + dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = null; raf = requestAnimationFrame(tick); } };
    const stop  = () => { if (raf) { cancelAnimationFrame(raf); raf = null; last = null; } };
    let section = sentinelRef.current;
    while (section && section.tagName !== 'SECTION') section = section.parentElement;
    let mo;
    if (section) {
      if (section.hasAttribute('data-deck-active')) start();
      mo = new MutationObserver(() => {
        if (section.hasAttribute('data-deck-active')) start();
        else stop();
      });
      mo.observe(section, { attributes: true, attributeFilter: ['data-deck-active'] });
    } else { start(); }
    return () => { stop(); if (mo) mo.disconnect(); };
  }, []);
  return (
    <TimelineContext.Provider value={{ time, duration, playing: true }}>
      <span ref={sentinelRef} style={{ display: 'none' }} />
      {children}
    </TimelineContext.Provider>
  );
}

/* ─── Shell & chrome ─────────────────────────────────────────────────── */
function SlideShell({ variant, density = 1.0, accent = 1.0, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden', color: '#fff', fontFamily: FONT }}>
      <ShaderBG variant={variant} density={density} accent={accent} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.35) 40%,rgba(0,0,0,.65) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
}
function SlideTag({ num, total = 20, label }) {
  return (
    <div style={{ position: 'absolute', top: 56, left: 88, display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', fontWeight: 500 }}>
      <span style={{ color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{String(num).padStart(2, '0')}</span>
      <span style={{ width: 24, height: 1, background: 'rgba(255,255,255,.3)' }} />
      <span>{label}</span>
      <span style={{ marginLeft: 8, color: 'rgba(255,255,255,.3)' }}>/ {String(total).padStart(2, '0')}</span>
    </div>
  );
}
function MainMsg({ children }) {
  return (
    <div style={{ position: 'absolute', bottom: 56, left: 88, right: 88, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', gap: 24 }}>
      <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, whiteSpace: 'nowrap' }}>Main Message</span>
      <span style={{ fontSize: 19, fontWeight: 500, color: 'rgba(255,255,255,.92)', lineHeight: 1.45 }}>{children}</span>
    </div>
  );
}
function FadeUp({ delay = 0, dur = 0.5, children, style }) {
  const t = useTime();
  const p = clamp((t - delay) / dur, 0, 1);
  const e = Easing.easeOutCubic(p);
  return <div style={{ opacity: e, transform: `translateY(${(1-e)*14}px)`, willChange: 'transform,opacity', ...style }}>{children}</div>;
}
const Eyebrow = ({ children }) => <div style={{ fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 18 }}>{children}</div>;
const Headline = ({ children, size = 48 }) => <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.02em', textWrap: 'balance', color: '#fff' }}>{children}</div>;
const Lede = ({ children }) => <div style={{ marginTop: 18, fontSize: 18, color: 'rgba(255,255,255,.7)', lineHeight: 1.55, maxWidth: 720 }}>{children}</div>;
const SourceNote = ({ children }) => <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 }}>{children}</div>;

/* ─── Shared UI primitives ───────────────────────────────────────────── */
function Pill({ children, tone = 'neutral', size = 'sm' }) {
  const map = {
    green:   { bg: ACCENT_SOFT,             bd: ACCENT,                    col: ACCENT },
    warn:    { bg: 'rgba(255,164,43,.1)',    bd: '#ffa42b',                 col: '#ffa42b' },
    red:     { bg: 'rgba(255,70,70,.1)',     bd: 'rgba(255,80,80,.5)',      col: '#ff6b6b' },
    neutral: { bg: 'rgba(255,255,255,.06)',  bd: 'rgba(255,255,255,.28)',   col: 'rgba(255,255,255,.75)' },
    dim:     { bg: 'transparent',           bd: 'rgba(255,255,255,.15)',   col: 'rgba(255,255,255,.4)' },
  };
  const c = map[tone] || map.neutral;
  const fs = size === 'lg' ? 13 : 11;
  const px = size === 'lg' ? 14 : 9;
  const py = size === 'lg' ? 7 : 4;
  return <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1, padding: `${py}px ${px}px`, borderRadius: 999, fontSize: fs, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: c.bg, border: `1px solid ${c.bd}`, color: c.col, whiteSpace: 'nowrap' }}>{children}</span>;
}

function StatCard({ value, label, context, source, accent = false }) {
  return (
    <div style={{ padding: '22px 20px', borderRadius: 12, border: `1px solid ${accent ? ACCENT : 'rgba(255,255,255,.14)'}`, background: accent ? ACCENT_SOFT : 'rgba(255,255,255,.025)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: accent ? ACCENT : '#fff', lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      <div style={{ fontSize: 13, color: accent ? ACCENT : 'rgba(255,255,255,.8)', fontWeight: 700, lineHeight: 1.3 }}>{label}</div>
      {context && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.4 }}>{context}</div>}
      {source && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 4, letterSpacing: '0.08em' }}>{source}</div>}
    </div>
  );
}

function DataTable({ cols, rows }) {
  return (
    <div style={{ width: '100%', fontSize: 15 }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols.template, padding: '10px 0', borderBottom: `1px solid ${ACCENT}`, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>
        {cols.heads.map((h, i) => <div key={i}>{h}</div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: cols.template, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,.10)', fontSize: 15, color: 'rgba(255,255,255,.92)', lineHeight: 1.4 }}>
          {r.map((c, j) => <div key={j} style={j === 0 ? { fontWeight: 700, color: '#fff' } : {}}>{c}</div>)}
        </div>
      ))}
    </div>
  );
}

/* ════════ PART 1: 전략·WHY (01–12) ══════════════════════════════════ */

/* SLIDE 01 — Executive Thesis */
function Slide01() {
  return (
    <AutoStage>
      <SlideShell variant={0} density={0.9}>
        <SlideTag num={1} label="Executive Thesis" />
        <Orbit />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1080 }}>
          <FadeUp delay={0.1}><Eyebrow>본질</Eyebrow></FadeUp>
          <FadeUp delay={0.3}>
            <Headline size={62}>
              지금 검토할 것은 신규 아이템이 아니라<br/>
              <span style={{ color: ACCENT }}>이미 확보한 금융권형 솔루션 자산</span>
            </Headline>
          </FadeUp>
          <FadeUp delay={0.7}>
            <Lede>이번 의사결정의 본질은 신규 개발 착수 여부가 아니라, <strong style={{ color: '#fff' }}>사업 자산으로의 전환 여부</strong>. 아래 두 선택지 중 하나를 오늘 확정해야 한다.</Lede>
          </FadeUp>
          <FadeUp delay={1.0}>
            <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 980 }}>
              <PathCard kind="A" title="프로젝트 자산 유지" desc="신한은행 결과물 그대로 보존 · 후속 고객은 매번 커스터마이징 재개발" tone="muted" />
              <PathCard kind="B" title="반복 판매 자산 전환" desc="코어 추출 · 옵션·커넥터·설정팩 분리 · 금융권 솔루션으로 승격" tone="accent" />
            </div>
          </FadeUp>
        </div>
        <MainMsg>의사결정의 본질은 신규 개발이 아니라 <strong>사업 자산 전환 여부</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function PathCard({ kind, title, desc, tone }) {
  const accent = tone === 'accent';
  return (
    <div style={{ padding: 22, borderRadius: 10, border: `1px solid ${accent ? ACCENT : 'rgba(255,255,255,.22)'}`, background: accent ? ACCENT_SOFT : 'rgba(255,255,255,.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: accent ? ACCENT : 'rgba(255,255,255,.15)', color: accent ? '#000' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{kind}</span>
        <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent ? ACCENT : 'rgba(255,255,255,.6)', fontWeight: 700 }}>Option {kind}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
function Orbit() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 60, top: 140, width: 460, height: 460, opacity: 0.65 }}>
      <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(255,255,255,.15)" />
      <circle cx="300" cy="300" r="160" fill="none" stroke="rgba(255,255,255,.22)" />
      <circle cx="300" cy="300" r="80"  fill="none" stroke="rgba(255,255,255,.32)" />
      <circle cx="300" cy="300" r="6"   fill={ACCENT} />
      <g transform={`rotate(${t*22} 300 300)`}><circle cx="540" cy="300" r="4" fill={ACCENT} /></g>
      <g transform={`rotate(${-t*35+90} 300 300)`}><circle cx="460" cy="300" r="3" fill="rgba(255,255,255,.75)" /></g>
    </svg>
  );
}

/* SLIDE 02 — Why This Matters Now · StatCards */
function Slide02() {
  const stats = [
    { value: '$6.08M', label: '금융권 침해사고 비용', context: '탐지·격리·복구 전 과정 합산', source: 'IBM 2024', accent: true },
    { value: '168+51일', label: '탐지 + 격리 소요', context: '사고 발생 후 조치까지 총 219일', source: 'IBM 2024', accent: false },
    { value: '64%', label: '툴체인 통합 요구', context: '응답자 중 도구 통합을 원한다고 답변', source: 'GitLab 2024', accent: false },
    { value: '67%', label: 'SDLC 자동화율', context: '대부분 또는 완전 자동화 응답 기준', source: 'GitLab 2024', accent: false },
    { value: '+10%', label: '플랫폼 사용 시 팀 성과', context: '내부 개발 플랫폼 사용 조직 기준', source: 'Google Cloud 2024', accent: true },
  ];
  return (
    <AutoStage>
      <SlideShell variant={1} density={1.1}>
        <SlideTag num={2} label="Why This Matters Now" />
        <RipplePulse />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1080 }}>
          <Eyebrow>타이밍</Eyebrow>
          <Headline size={54}>금융권은 이미 자동화로 가고 있고<br/><span style={{ color: ACCENT }}>통제 레이어 수요는 더 빨라지고 있다</span></Headline>
          <Lede>지금 필요한 것은 기능 추가가 아니라 승인·감사·보안·운영이 한 화면에서 연결되는 제품형 거버넌스 레이어다.</Lede>
        </div>
        <div style={{ position: 'absolute', top: 470, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {stats.map((s, i) => (
              <FadeUp key={i} delay={0.7 + i * 0.1}><StatCard {...s} /></FadeUp>
            ))}
          </div>
          <FadeUp delay={1.3}>
            <SourceNote>Source: IBM Cost of a Data Breach 2024 Financial Industry · GitLab 2024 Global DevSecOps Report · Google Cloud 2024 State of DevOps</SourceNote>
          </FadeUp>
        </div>
        <MainMsg>지금은 기능 추가보다 <strong>통제 가능한 개발운영 허브</strong>를 제품으로 고정할 시점.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function RipplePulse() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 140, width: 360, height: 360, opacity: 0.55 }}>
      {[0,1,2,3,4].map(i => {
        const phase = ((t*0.5 + i*0.2) % 1);
        const r = 20 + phase * 240, op = (1-phase)*0.6;
        return <circle key={i} cx="300" cy="300" r={r} fill="none" stroke={i===2?ACCENT:'rgba(255,255,255,.7)'} strokeWidth="1" opacity={op} />;
      })}
      <circle cx="300" cy="300" r="8" fill={ACCENT} />
    </svg>
  );
}

/* SLIDE 03 — What We Already Own · AssetCards */
function Slide03() {
  const assets = [
    { title: 'GitLab 형상관리 UI', desc: '신한은행 운영용 UI 일체', tag: '확보', tagTone: 'green', fit: '코어 · 그대로 활용' },
    { title: 'MR · 브랜치 · 파이프라인 관리자', desc: '운영자/승인자 워크플로 구현', tag: '확보', tagTone: 'green', fit: '코어 · 그대로 활용' },
    { title: '다국어 디자인 시스템', desc: 'Storybook · 컴포넌트 추출 가능', tag: '확보', tagTone: 'green', fit: '코어 · 정리 필요' },
    { title: '금융권 승인 운영 UX 경험', desc: '실제 운영 적용 · 검증된 도메인 지식', tag: '검증됨', tagTone: 'warn', fit: '경쟁 차별 · 비코드 자산' },
    { title: '보안·감사 통제 도메인', desc: '인증·권한·로그 운영 요건 내재', tag: '내재', tagTone: 'neutral', fit: '커넥터·모듈로 분리' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={2} density={0.7}>
        <SlideTag num={3} label="What We Already Own" />
        <AssetGridMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1200 }}>
          <Eyebrow>자산</Eyebrow>
          <Headline size={54}>출발점은 아이디어가 아니라<br/><span style={{ color: ACCENT }}>이미 구현된 코어 제품 후보</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {assets.map((a, i) => (
              <FadeUp key={i} delay={0.5 + i * 0.1}>
                <div style={{ padding: '20px 18px', borderRadius: 10, border: `1px solid rgba(255,255,255,.14)`, background: 'rgba(255,255,255,.025)', display: 'flex', flexDirection: 'column', gap: 10, height: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Pill tone={a.tagTone}>{a.tag}</Pill>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.4 }}>{a.desc}</div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: '0.05em' }}>{a.fit}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={1.1}>
            <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
              {['Zero to One 아님', '재개발보다 제품화 정리', '이미 확보된 코어'].map((t, i) => (
                <Pill key={i} tone="green" size="lg">{t}</Pill>
              ))}
            </div>
          </FadeUp>
        </div>
        <MainMsg>우리는 콘셉트 검토 단계가 아니라 <strong>제품 코어를 정리하는 단계</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function AssetGridMini() {
  const t = useTime();
  const cols = 14, rows = 5;
  return (
    <svg viewBox={`0 0 ${cols*22} ${rows*22}`} style={{ position: 'absolute', right: 88, top: 165, width: 320, height: 110, opacity: 0.85 }}>
      {Array.from({ length: cols*rows }).map((_, i) => {
        const cx = (i%cols)*22+11, cy = Math.floor(i/cols)*22+11;
        const phase = ((t*0.3+i*0.04)%3)/3;
        const isAccent = (i*13)%17 < 5 && phase < 0.45;
        const a = isAccent ? 1 : 0.2 + Math.sin(phase*Math.PI)*0.15;
        return <circle key={i} cx={cx} cy={cy} r={isAccent?2.4:1.4} fill={isAccent?ACCENT:'#fff'} opacity={a} />;
      })}
    </svg>
  );
}

/* SLIDE 04 — What We Can Sell · Visual LayerStack */
function Slide04() {
  const layers = [
    { name: 'CORE',      label: '코어 플랫폼',       desc: 'GitLab 운영 고도화 · 승인·감사·통제 UX · 운영자/승인자 통합', model: '라이선스', modelTone: 'green', w: '100%', accent: true },
    { name: 'MODULE',    label: '옵션 모듈',          desc: '보안 정책 대시보드 · PMS 연동 · 리포팅 · 알림/메신저',         model: '라이선스', modelTone: 'green', w: '88%',  accent: false },
    { name: 'CONNECTOR', label: '인증·연동 커넥터',   desc: 'SSO · LDAP · Jira · 메신저 · 결재 공존',                         model: '구축+옵션', modelTone: 'neutral', w: '76%', accent: false },
    { name: 'PACK',      label: '고객 설정팩',        desc: '브랜딩 토큰 · 워크플로 프리셋 · 코드 포크 없이 고객화',          model: '구축+운영', modelTone: 'neutral', w: '64%', accent: false },
    { name: 'SERVICE',   label: '구축·MA 서비스',     desc: '온프레미스 도입 · 유지보수 · 고도화 책임',                        model: '구축+MA',   modelTone: 'dim', w: '52%',   accent: false },
  ];
  return (
    <AutoStage>
      <SlideShell variant={3} density={1.2} accent={1.4}>
        <SlideTag num={4} label="What We Can Sell" />
        <CapsuleLayersMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>상품 정의</Eyebrow>
          <Headline size={52}>판매 대상은 Git UI가 아니라<br/><span style={{ color: ACCENT }}>금융권형 개발운영 통제 플랫폼</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {layers.map((l, i) => (
              <FadeUp key={i} delay={0.5 + i * 0.12}>
                <div style={{ width: l.w, display: 'flex', alignItems: 'center', gap: 0, borderRadius: 8, border: `1px solid ${l.accent ? ACCENT : 'rgba(255,255,255,.12)'}`, background: l.accent ? ACCENT_SOFT : 'rgba(255,255,255,.025)', overflow: 'hidden' }}>
                  <div style={{ width: 120, padding: '14px 18px', flexShrink: 0, borderRight: `1px solid ${l.accent ? ACCENT : 'rgba(255,255,255,.1)'}`, background: l.accent ? 'rgba(30,215,96,.12)' : 'rgba(255,255,255,.03)' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.22em', color: l.accent ? ACCENT : 'rgba(255,255,255,.45)', fontWeight: 700 }}>{l.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: l.accent ? ACCENT : '#fff', marginTop: 3 }}>{l.label}</div>
                  </div>
                  <div style={{ flex: 1, padding: '14px 20px', fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.45 }}>{l.desc}</div>
                  <div style={{ padding: '14px 20px', flexShrink: 0 }}><Pill tone={l.modelTone}>{l.model}</Pill></div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={1.2}>
            <div style={{ marginTop: 18, fontSize: 14, color: 'rgba(255,255,255,.55)' }}>
              ※ PMS는 <strong style={{ color: '#fff' }}>코어가 아닌 옵션</strong>. GitLab 중심 운영 고도화가 코어 정의.
            </div>
          </FadeUp>
        </div>
        <MainMsg>상품 정의가 명확해야 <strong>영업 메시지와 개발 범위 통제</strong> 가능.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function CapsuleLayersMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 130, width: 320, height: 320, opacity: 0.75 }}>
      {[260,200,140,80].map((r,i) => (
        <circle key={i} cx="300" cy="300" r={r} fill="none"
          stroke={i===3?ACCENT:`rgba(255,255,255,${0.16+i*0.06})`}
          strokeWidth={i===3?2:1} strokeDasharray={i<2?'2 6':'none'}
          transform={`rotate(${t*(i%2===0?12:-8)} 300 300)`} />
      ))}
      <circle cx="300" cy="300" r="44" fill="rgba(30,215,96,.12)" />
      <circle cx="300" cy="300" r="44" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <text x="300" y="306" textAnchor="middle" fill={ACCENT} style={{ font: `700 14px ${FONT}`, letterSpacing: '0.22em' }}>CORE</text>
    </svg>
  );
}

/* SLIDE 05 — Where The Market Is · SectorColumns */
function Slide05() {
  const sectors = [
    {
      name: '은행', en: 'BANK', pool: '4–6곳', diff: '높음', diffTone: 'red',
      needs: ['승인·감사·권한 통제', '폐쇄망 운영', '보안 감사 추적성'],
      approach: '레퍼런스 강조형 제안',
      note: '제품 기준선을 여기서 정의',
      highlight: true,
    },
    {
      name: '증권', en: 'SECURITIES', pool: '4–6곳', diff: '중상', diffTone: 'warn',
      needs: ['거래계 안정성', '배포 승인 통제', '운영 로그 일관성'],
      approach: '파일럿 후 단계 확대',
      note: '은행 레퍼런스 확보 후 진입',
      highlight: false,
    },
    {
      name: '보험', en: 'INSURANCE', pool: '4–6곳', diff: '중', diffTone: 'neutral',
      needs: ['장기 운영성', '레거시 공존', '통합 효율화'],
      approach: '통합형/운영효율형 제안',
      note: '상대적으로 낮은 진입 장벽',
      highlight: false,
    },
  ];
  return (
    <AutoStage>
      <SlideShell variant={4} density={1.0}>
        <SlideTag num={5} label="Where The Market Is" />
        <ThreeNodesMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>시장</Eyebrow>
          <Headline size={52}>제품 기준은 은행급으로 두고<br/><span style={{ color: ACCENT }}>영업 풀은 은행·증권·보험으로 묶는다</span></Headline>
          <Lede>첫 12개월은 국내 대형 금융사 중 Git 기반 내재화와 폐쇄망 운영 니즈가 강한 고객만 좁게 본다. 핵심은 넓은 TAM이 아닌 첫 3건을 닫을 수 있는 ICP 정의.</Lede>
        </div>
        <div style={{ position: 'absolute', top: 490, left: 88, right: 88, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {sectors.map((s, i) => (
            <FadeUp key={i} delay={0.6 + i * 0.15}>
              <div style={{ padding: '22px 22px', borderRadius: 12, border: `1px solid ${s.highlight ? ACCENT : 'rgba(255,255,255,.15)'}`, background: s.highlight ? ACCENT_SOFT : 'rgba(255,255,255,.025)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: s.highlight ? ACCENT : '#fff' }}>{s.name}</span>
                  <span style={{ fontSize: 11, letterSpacing: '0.22em', color: s.highlight ? ACCENT : 'rgba(255,255,255,.4)', fontWeight: 700 }}>{s.en}</span>
                  <div style={{ marginLeft: 'auto' }}><Pill tone={s.diffTone}>{s.diff}</Pill></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  {s.needs.map((n, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,.8)' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.highlight ? ACCENT : 'rgba(255,255,255,.4)', flexShrink: 0 }} />
                      {n}
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{s.approach}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{s.note}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', fontWeight: 700 }}>타깃 {s.pool}</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <MainMsg>시장 판단의 핵심은 큰 시장이 아니라 <strong>첫 3건을 닫을 수 있는 고객군</strong> 정의.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ThreeNodesMini() {
  const t = useTime();
  const nodes = [
    { x: 320, y: 100, label: '은행',  sub: 'BANK',       size: 46 },
    { x: 460, y: 280, label: '증권',  sub: 'SECURITIES', size: 38 },
    { x: 180, y: 280, label: '보험',  sub: 'INSURANCE',  size: 38 },
  ];
  return (
    <svg viewBox="0 0 600 400" style={{ position: 'absolute', right: 80, top: 140, width: 380, height: 270, opacity: 0.85 }}>
      {[[0,1],[1,2],[2,0]].map(([a,b],i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={ACCENT} strokeWidth="1.2" strokeDasharray="5 6"
          strokeDashoffset={-(t*30+i*20)%80} opacity="0.55" />
      ))}
      {nodes.map((n,i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.size+10+Math.sin(t*1.2+i)*3} fill="none" stroke="rgba(255,255,255,.18)" />
          <circle cx={n.x} cy={n.y} r={n.size} fill="rgba(0,0,0,.55)" stroke="#fff" strokeWidth="1.5" />
          <text x={n.x} y={n.y-2} textAnchor="middle" fill="#fff" style={{ font: `700 18px ${FONT}` }}>{n.label}</text>
          <text x={n.x} y={n.y+16} textAnchor="middle" fill={ACCENT} style={{ font: `700 9px ${FONT}`, letterSpacing: '0.22em' }}>{n.sub}</text>
        </g>
      ))}
    </svg>
  );
}

/* SLIDE 06 — Why Customers Will Care · PainSolution strips */
function Slide06() {
  const rows = [
    { pain: '승인·운영자 UX 부재',        limit: 'GitLab 단독은 개발자 중심',   solution: '운영자/승인자 통합 UX 제공' },
    { pain: '승인 파이프라인 흐름 분산',   limit: '도구별 파편화 · 추적 어려움', solution: '단일 흐름 통제 + 감사 로그' },
    { pain: '망분리 · 온프레미스 강제',    limit: 'SaaS 종속 · 외부 의존 큼',    solution: '온프레미스/프라이빗 클라우드 대응' },
    { pain: '기존 체계와의 공존 요구',     limit: '도입 시 기존 도구 대체 강요',  solution: 'Jira·인증·메신저 공존 구조' },
    { pain: '보안 감사 추적성',            limit: '운영 로그 일관성 부족',         solution: '감사 대응 표준 로그 · 권한 모델' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={5} density={0.9}>
        <SlideTag num={6} label="Why Customers Will Care" />
        <ControlShieldMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>차별 포인트</Eyebrow>
          <Headline size={52}>고객이 사는 것은 UI가 아니라<br/><span style={{ color: ACCENT }}>감사 가능한 운영 흐름</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 10, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
            <div style={{ flex: '0 0 320px', color: 'rgba(255,80,80,.7)' }}>고객 페인포인트</div>
            <div style={{ flex: '0 0 28px' }} />
            <div style={{ flex: '0 0 320px', color: 'rgba(255,255,255,.4)' }}>범용 DevOps 한계</div>
            <div style={{ flex: '0 0 28px' }} />
            <div style={{ color: ACCENT }}>우리의 대응</div>
          </div>
          {rows.map((r, i) => (
            <FadeUp key={i} delay={0.5 + i * 0.12}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: 8 }}>
                <div style={{ flex: '0 0 320px', padding: '12px 16px', borderRadius: '8px 0 0 8px', border: '1px solid rgba(255,80,80,.25)', borderRight: 'none', background: 'rgba(255,70,70,.06)', fontSize: 15, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center' }}>{r.pain}</div>
                <div style={{ flex: '0 0 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.04)', borderTop: '1px solid rgba(255,255,255,.08)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,.25)' }}>→</span>
                </div>
                <div style={{ flex: '0 0 320px', padding: '12px 16px', border: '1px solid rgba(255,255,255,.1)', borderLeft: 'none', borderRight: 'none', background: 'rgba(255,255,255,.025)', fontSize: 14, color: 'rgba(255,255,255,.5)', display: 'flex', alignItems: 'center' }}>{r.limit}</div>
                <div style={{ flex: '0 0 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ACCENT_SOFT, borderTop: `1px solid ${ACCENT}`, borderBottom: `1px solid ${ACCENT}`, opacity: 0.7 }}>
                  <span style={{ fontSize: 14, color: ACCENT }}>→</span>
                </div>
                <div style={{ flex: 1, padding: '12px 16px', borderRadius: '0 8px 8px 0', border: `1px solid ${ACCENT}`, borderLeft: 'none', background: ACCENT_SOFT, fontSize: 15, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center' }}>{r.solution}</div>
              </div>
            </FadeUp>
          ))}
          <FadeUp delay={1.2}>
            <SourceNote>DORA 2024: IDP 사용 조직 팀 성과 +10% · GitLab 2024: 응답자 64%가 툴체인 통합 희망</SourceNote>
          </FadeUp>
        </div>
        <MainMsg>우리가 겨루는 대상은 범용 기능이 아니라 <strong>금융권 운영 현실 적합성</strong>이다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ControlShieldMini() {
  const t = useTime();
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i/6)*Math.PI*2 - Math.PI/2;
    pts.push(`${300+Math.cos(a)*160},${300+Math.sin(a)*160}`);
  }
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 130, width: 280, height: 280, opacity: 0.75 }}>
      <polygon points={pts.join(' ')} fill="none" stroke="rgba(255,255,255,.25)" />
      <polygon points={pts.join(' ')} fill="none" stroke={ACCENT} strokeWidth="1" strokeDasharray="4 8" transform={`rotate(${t*8} 300 300)`} />
      <circle cx="300" cy="300" r="100" fill="none" stroke="rgba(255,255,255,.2)" />
      <g transform={`rotate(${t*55} 300 300)`}><line x1="300" y1="300" x2="300" y2="140" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" /></g>
      <circle cx="300" cy="300" r="5" fill={ACCENT} />
    </svg>
  );
}

/* SLIDE 07 — Productization Boundary · BoundaryCol cards (keep) */
function Slide07() {
  return (
    <AutoStage>
      <SlideShell variant={6} density={0.8}>
        <SlideTag num={7} label="Productization Boundary" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1280 }}>
          <Eyebrow>경계</Eyebrow>
          <Headline size={50}>성공은 기능 수가 아니라<br/><span style={{ color: ACCENT }}>제품 경계 통제 역량</span>이 결정한다</Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1.1fr 1.1fr 1fr', gap: 24 }}>
          <FadeUp delay={0.5}><BoundaryCol tone="accent" head="INSIDE · 그대로 활용" items={['GitLab 형상관리 UI', 'MR · 브랜치 · 커밋 · 파이프라인 관리자', '운영자/승인자 워크플로']} /></FadeUp>
          <FadeUp delay={0.7}><BoundaryCol tone="neutral" head="RE-WORK · 재정리 필요" items={['인증 · 권한 · SSO 분리', '브랜딩 · 디자인 토큰 추출', '외부 연동 커넥터 추상화']} /></FadeUp>
          <FadeUp delay={0.9}><BoundaryCol tone="warn" head="RISK · 경계 침범 주의" items={['고객사별 포크 확대', '첫 고객 요구 = 로드맵 위험', '멀티 SCM 조기 확장 유혹']} /></FadeUp>
        </div>
        <div style={{ position: 'absolute', top: 778, left: 88, right: 88 }}>
          <FadeUp delay={1.1}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)' }}>
              <strong style={{ color: ACCENT }}>분리 원칙</strong>
              <span style={{ marginLeft: 16 }}>코어 + 옵션 + 커넥터 + 설정팩 — 네 계층을 절대 섞지 않는다.</span>
            </div>
          </FadeUp>
        </div>
        <MainMsg>핵심 과제는 개발 확대가 아니라 <strong>제품과 프로젝트의 경계 확정</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function BoundaryCol({ tone, head, items }) {
  const c = tone==='accent'?ACCENT:tone==='warn'?'#ffa42b':'rgba(255,255,255,.55)';
  const bg = tone==='accent'?ACCENT_SOFT:tone==='warn'?'rgba(255,164,43,.06)':'rgba(255,255,255,.03)';
  return (
    <div style={{ padding: 24, border: `1px solid ${c}`, borderRadius: 8, background: bg, minHeight: 280 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: c, fontWeight: 700, marginBottom: 16 }}>{head}</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i===0?'1px solid rgba(255,255,255,.1)':'1px solid rgba(255,255,255,.06)', fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>
          <span style={{ color: c, fontSize: 12, marginTop: 4, flexShrink: 0 }}>0{i+1}</span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

/* SLIDE 08 — Commercial Logic · PriceCards */
function Slide08() {
  const pkgs = [
    { name: 'Discovery',    sub: '진단 워크숍',   price: '30M–50M',       unit: 'KRW', dur: '2주',  model: 'Project', tone: 'dim',     desc: '현행 핏갭 진단 · 제품 적합성 워크숍' },
    { name: 'Pilot/POC',   sub: '데모 테넌트',   price: '80M–120M',      unit: 'KRW', dur: '4주',  model: 'Project', tone: 'neutral', desc: '4개 핵심 시나리오 검증 · 본사업 전환용' },
    { name: 'MVP',          sub: '코어 도입',     price: '250M–400M',     unit: 'KRW', dur: '12주', model: 'License', tone: 'green',   desc: '4개 흐름 · 3~5개 연동 · 첫 레퍼런스 정착' },
    { name: 'Annual MA',   sub: '연간 유지보수', price: '구축비 15–18%', unit: '',    dur: '연간', model: 'Recurring', tone: 'green', desc: '운영지원 · 보안패치 · 경량 고도화' },
    { name: 'Option Pack', sub: '브랜딩/정책팩', price: '40M–80M',       unit: 'KRW', dur: '/건',  model: 'Upsell',  tone: 'neutral', desc: '브랜딩팩 · 정책팩 · 추가 커넥터' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={7} density={1.0}>
        <SlideTag num={8} label="Commercial Logic" />
        <RecurringPulseMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>수익 구조</Eyebrow>
          <Headline size={52}>SI 단건 매출을<br/><span style={{ color: ACCENT }}>패키지+구축+MA 구조</span>로 바꿀 수 있다</Headline>
        </div>
        <div style={{ position: 'absolute', top: 400, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            {pkgs.map((p, i) => (
              <FadeUp key={i} delay={0.5 + i * 0.1}>
                <div style={{ padding: '20px 18px', borderRadius: 12, border: `1px solid ${p.tone==='green'?ACCENT:'rgba(255,255,255,.14)'}`, background: p.tone==='green'?ACCENT_SOFT:'rgba(255,255,255,.025)', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 220 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.18em', color: p.tone==='green'?ACCENT:'rgba(255,255,255,.4)', fontWeight: 700, textTransform: 'uppercase' }}>{p.name}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2 }}>{p.sub}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: p.tone==='green'?ACCENT:'#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{p.price}</div>
                    {p.unit && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{p.unit} · {p.dur}</div>}
                    {!p.unit && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{p.dur}</div>}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.4 }}>{p.desc}</div>
                  <Pill tone={p.tone==='green'?'green':'dim'}>{p.model}</Pill>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={1.2}>
            <SourceNote>Note: 가격은 내부 협의용 가정치. 실제 견적은 고객사 보안 연동 범위와 조직 규모에 따라 변동.</SourceNote>
          </FadeUp>
        </div>
        <MainMsg>핵심은 한 번 파는 UI가 아니라 <strong>반복 판매되는 운영 패키지</strong>를 만드는 것이다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function RecurringPulseMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 500 200" style={{ position: 'absolute', right: 80, top: 170, width: 360, height: 140, opacity: 0.9 }}>
      <line x1="20" y1="120" x2="490" y2="120" stroke="rgba(255,255,255,.2)" />
      {Array.from({length:8}).map((_,i) => {
        const x = 40 + i*56;
        const phase = (t*0.8 - i*0.18) % 2;
        const h = phase>0&&phase<1.5 ? Math.sin(phase*Math.PI)*70 : 0;
        return (
          <g key={i}>
            <line x1={x} y1="120" x2={x} y2={120-h} stroke={i===0?'#fff':ACCENT} strokeWidth="2" />
            <circle cx={x} cy={120-h} r={h>4?4:0} fill={i===0?'#fff':ACCENT} />
          </g>
        );
      })}
      <text x="40" y="180" fill="rgba(255,255,255,.5)" style={{ font: `700 11px ${FONT}`, letterSpacing: '0.2em' }}>ONE-OFF</text>
      <text x="480" y="180" textAnchor="end" fill={ACCENT} style={{ font: `700 11px ${FONT}`, letterSpacing: '0.2em' }}>RECURRING</text>
    </svg>
  );
}

/* SLIDE 09 — Conditions To Win · ConditionCards 2×3 */
function Slide09() {
  const conds = [
    { id: 'C-01', title: 'Product Owner 지정',             consequence: '로드맵 표류 · 영업 메시지 부재',         priority: '필수', pTone: 'green',   timing: '0일차' },
    { id: 'C-02', title: 'Tech Lead 지정',                 consequence: '아키텍처 경계 붕괴 · 포크 확산',          priority: '필수', pTone: 'green',   timing: '0일차' },
    { id: 'C-03', title: '인증·브랜딩·연동 분리 착수',    consequence: '재정리 비용이 매 고객마다 발생',           priority: '필수', pTone: 'green',   timing: '30일' },
    { id: 'C-04', title: '제품화 원칙 내부 합의',          consequence: '의사결정 충돌 · 단건 구축으로 회귀',       priority: '필수', pTone: 'green',   timing: '30일' },
    { id: 'C-05', title: '영업·프리세일즈 메시지 병행',   consequence: '제품만 있고 팔 줄 모르는 상태',            priority: '핵심', pTone: 'warn',    timing: '60일' },
    { id: 'C-06', title: '제품 운영 체계 구축',            consequence: '고객사별 핫픽스 누적',                     priority: '핵심', pTone: 'warn',    timing: '90일' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={8} density={0.8}>
        <SlideTag num={9} label="Conditions To Win" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1280 }}>
          <Eyebrow>조건</Eyebrow>
          <Headline size={50}>추진 여부보다 중요한 것은<br/><span style={{ color: ACCENT }}>어떤 조건으로 추진할 것인가</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 360, left: 88, right: 88, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {conds.map((c, i) => (
            <FadeUp key={i} delay={0.4 + i * 0.1}>
              <div style={{ padding: '20px 22px', borderRadius: 10, border: `1px solid ${c.pTone==='green'?ACCENT:'rgba(255,164,43,.4)'}`, background: c.pTone==='green'?ACCENT_SOFT:'rgba(255,164,43,.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '0.15em' }}>{c.id}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Pill tone={c.pTone}>{c.priority}</Pill>
                    <Pill tone="dim">{c.timing}</Pill>
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.45 }}>
                  <span style={{ color: 'rgba(255,100,100,.7)', fontWeight: 600 }}>없을 시 → </span>{c.consequence}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <MainMsg>조직적 준비 없는 추진은 솔루션 사업이 아니라 <strong>또 하나의 SI 프로젝트</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* SLIDE 10 — 12-Week Path · Visual Gantt */
function Slide10() {
  const phases = [
    { span: 'W1–2',  name: '범위 고정',    gate: 'Go/No-Go',    items: ['자산 점검 · 코어/옵션 경계', 'PO/TL 지정', '백로그 확정'] },
    { span: 'W3–4',  name: '코어 정비',    gate: 'Alpha',        items: ['인증 어댑터', '테넌트 설정', '감사 로그 모델'] },
    { span: 'W5–6',  name: '데모 테넌트',  gate: 'Hands-on',    items: ['GitLab 인스턴스', '4개 핵심 흐름', '역할별 화면'] },
    { span: 'W7–8',  name: '정책/연동',    gate: 'PM 리뷰',     items: ['승인선 설정', '메신저/SSO 훅', '정책팩 v1'] },
    { span: 'W9–10', name: '영업 패키지',  gate: '컨설팅 논의', items: ['브랜드 적용 데모', '아키텍처 문서', '제안서 템플릿'] },
    { span: 'W11–12',name: '첫 제안 준비', gate: '첫 미팅 투입', items: ['시연 리허설', '견적안', '리스크 메모'] },
  ];
  return (
    <AutoStage>
      <SlideShell variant={9} density={0.7}>
        <SlideTag num={10} label="12-Week Path To First Demo-Sell" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1380 }}>
          <Eyebrow>로드맵</Eyebrow>
          <Headline size={50}>3개월 안에 완제품이 아니라<br/><span style={{ color: ACCENT }}>3개월 안에 바로 설명·시연·제안 가능한 형태</span></Headline>
        </div>
        <TimelineBar />
        <div style={{ position: 'absolute', top: 480, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {phases.map((p, i) => (
              <FadeUp key={i} delay={0.8 + i * 0.1}>
                <div style={{ padding: '16px 14px', borderRadius: 8, border: `1px solid ${i===0?ACCENT:'rgba(255,255,255,.12)'}`, background: i===0?ACCENT_SOFT:'rgba(255,255,255,.025)' }}>
                  <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700, letterSpacing: '0.18em', marginBottom: 6 }}>{p.span}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{p.name}</div>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.4, marginBottom: 4 }}>
                      <span style={{ color: 'rgba(255,255,255,.25)', flexShrink: 0 }}>·</span>
                      {item}
                    </div>
                  ))}
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.1)' }}>
                    <Pill tone={i===0?'green':'dim'}>{p.gate}</Pill>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <MainMsg>12주 목표는 개발 완료가 아니라 <strong>바로 제안 가능한 데모 패키지</strong> 확보이다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function TimelineBar() {
  const t = useTime();
  const head = clamp((t-1.0)/4.0, 0, 1);
  const steps = ['W1-2','W3-4','W5-6','W7-8','W9-10','W11-12'];
  return (
    <div style={{ position: 'absolute', top: 380, left: 88, right: 88 }}>
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,.15)', marginBottom: 20 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${head*100}%`, background: ACCENT }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
        {steps.map((m,i) => {
          const visible = head > i/6;
          return (
            <div key={i} style={{ opacity: visible?1:0.3 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: visible?ACCENT:'rgba(255,255,255,.3)' }} />
                <span style={{ fontSize: 13, letterSpacing: '0.2em', color: ACCENT, fontWeight: 700 }}>{m}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* SLIDE 11 — Decision Required · BinaryChoice strips */
function Slide11() {
  const qs = [
    { q: '이 자산을 솔루션으로 승격할 것인가',    a: '아니오 · 프로젝트 유지',  b: '예 · 솔루션 승격' },
    { q: 'GitLab-first 전략을 유지할 것인가',      a: '멀티 SCM 고려',            b: 'GitLab-first 유지' },
    { q: '금융권 구축형 포지셔닝으로 갈 것인가',   a: '범용 DevOps 진입',         b: '금융권 구축형' },
    { q: '초기 12주 전담 인력을 투입할 것인가',   a: '대기 · 우선순위 하향',     b: '투입 · 1순위 과제' },
    { q: 'MVP 범위를 4개 흐름으로 제한할 것인가',  a: '요구사항 계속 수용',        b: '범위 고정 후 확장' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={10} density={1.0}>
        <SlideTag num={11} label="Decision Required" />
        <DivergePathsMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>오늘의 결정</Eyebrow>
          <Headline size={48}>오늘 필요한 판단은<br/><span style={{ color: ACCENT }}>추진 여부와 추진 원칙의 동시 확정</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {qs.map((q, i) => (
              <FadeUp key={i} delay={0.4 + i * 0.12}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px 280px', gap: 0, alignItems: 'stretch', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
                  <div style={{ padding: '13px 18px', background: 'rgba(255,255,255,.03)', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: ACCENT, marginRight: 12, fontSize: 12, letterSpacing: '0.18em', fontWeight: 700 }}>Q{i+1}</span>{q.q}
                  </div>
                  <div style={{ padding: '13px 16px', background: 'rgba(255,255,255,.04)', borderLeft: '1px solid rgba(255,255,255,.1)', fontSize: 14, color: 'rgba(255,255,255,.45)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8, opacity: 0.5 }}>A</span>{q.a}
                  </div>
                  <div style={{ padding: '13px 16px', background: ACCENT_SOFT, borderLeft: `1px solid ${ACCENT}`, fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8, color: ACCENT }}>B ★</span>{q.b}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={1.2}>
            <div style={{ marginTop: 20, padding: '18px 24px', border: `1px solid ${ACCENT}`, borderRadius: 8, background: ACCENT_SOFT, fontSize: 18, fontWeight: 600, lineHeight: 1.5 }}>
              <span style={{ color: ACCENT, marginRight: 12 }}>핵심 질문 →</span>
              이 자산을 <strong style={{ color: '#fff' }}>프로젝트 결과물</strong>로 소모할 것인가, 아니면 <strong style={{ color: '#fff' }}>사업 자산</strong>으로 전환할 것인가.
            </div>
          </FadeUp>
        </div>
        <MainMsg>오늘 결정해야 할 것은 <strong>추진 여부 + 추진 원칙</strong>의 동시 확정.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function DivergePathsMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 300" style={{ position: 'absolute', right: 80, top: 150, width: 340, height: 190, opacity: 0.9 }}>
      <circle cx="80" cy="150" r="9" fill="#fff" />
      {[60,240].map((y,i) => (
        <path key={i} d={`M 80 150 C 240 150, 320 ${y}, 500 ${y}`} fill="none"
          stroke={i===0?'rgba(255,255,255,.4)':ACCENT} strokeWidth="1.5" strokeDasharray="6 8"
          strokeDashoffset={(-t*30+i*40)%800} />
      ))}
      <circle cx="500" cy="60"  r="7" fill="rgba(255,255,255,.6)" />
      <circle cx="500" cy="240" r="9" fill={ACCENT} />
    </svg>
  );
}

/* SLIDE 12 — Recommendation · RecoCards */
function Slide12() {
  const recos = [
    { tag: '추진 권고',     title: '자산 → 솔루션 승격',           desc: '이미 확보된 코어와 시장 문맥이 있음', accent: true },
    { tag: '12주 MVP',      title: '4개 흐름 · 1개 데모테넌트 · 3~5개 연동으로 제한', desc: '3개월 내 즉시 착수 가능', accent: true },
    { tag: 'GitLab-first', title: '단일 SCM 기준 좁게 시작',       desc: '경계 통제 · 첫 제안 성공확률 우선', accent: false },
    { tag: '온프레미스 우선',title: '구축형 · 망분리 환경 대응',    desc: '금융권 진입 조건의 기준선', accent: false },
    { tag: '포크 금지',     title: '설정팩 · 커넥터로만 고객화',   desc: '반복 판매 구조 유지의 핵심', accent: false },
  ];
  return (
    <AutoStage>
      <SlideShell variant={11} density={0.9} accent={1.5}>
        <SlideTag num={12} label="Recommendation" />
        <ForwardArrowMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1300 }}>
          <Eyebrow>권고</Eyebrow>
          <Headline size={62}><span style={{ color: ACCENT }}>추진</span> · 단, 금융권 GitLab 운영<br/>고도화 솔루션으로 <span style={{ color: ACCENT }}>12주 MVP부터 좁게 시작</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 430, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 14 }}>
            {recos.map((r, i) => (
              <FadeUp key={i} delay={0.5 + i * 0.1}>
                <div style={{ padding: '20px 18px', borderRadius: 10, border: `1px solid ${r.accent?ACCENT:'rgba(255,255,255,.14)'}`, background: r.accent?ACCENT_SOFT:'rgba(255,255,255,.025)', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180 }}>
                  <Pill tone={r.accent?'green':'neutral'}>{r.tag}</Pill>
                  <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.4 }}>{r.desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={1.2}>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', border: `1px solid ${ACCENT}`, borderRadius: 8, background: ACCENT_SOFT }}>
              <span style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>Final Message</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>대규모 신사업이 아니라 · <strong>이미 가진 자산을 12주 내 판매 가능한 형태로 재조직</strong></span>
            </div>
          </FadeUp>
        </div>
        <MainMsg>권고안은 확장 개발이 아니라 <strong>12주 MVP로 사업화 가능성부터 검증</strong>하는 것이다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ForwardArrowMini() {
  const t = useTime();
  const head = (t*0.55) % 1;
  return (
    <svg viewBox="0 0 600 200" style={{ position: 'absolute', right: 80, top: 200, width: 360, height: 120, opacity: 0.9 }}>
      <line x1="40" y1="100" x2="560" y2="100" stroke="rgba(255,255,255,.18)" />
      <line x1="40" y1="100" x2={40+head*520} y2="100" stroke={ACCENT} strokeWidth="2" />
      <polygon points={`${40+head*520-14},90 ${40+head*520},100 ${40+head*520-14},110`} fill={ACCENT} />
      <circle cx="40" cy="100" r="6" fill="#fff" />
      <text x="40"  y="74" fill="rgba(255,255,255,.6)" style={{ font: `700 11px ${FONT}`, letterSpacing: '0.22em' }}>NOW</text>
      <text x="560" y="74" textAnchor="end" fill={ACCENT} style={{ font: `700 11px ${FONT}`, letterSpacing: '0.22em' }}>FIRST DEAL</text>
    </svg>
  );
}

/* ════════ PART 2: 실행 방안 (13–20) ════════════════════════════════ */

/* SLIDE 13 — 실행 방안 개요 · DomainCards (keep) */
function Slide13() {
  return (
    <AutoStage>
      <SlideShell variant={0} density={0.85}>
        <SlideTag num={13} label="실행 방안 개요" />
        <FourLayersMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1060 }}>
          <FadeUp delay={0.1}><Eyebrow>실행 전략</Eyebrow></FadeUp>
          <FadeUp delay={0.3}><Headline size={58}>4개 영역 병렬 착수 ·<br/><span style={{ color: ACCENT }}>의존성 기반 순차 통합</span></Headline></FadeUp>
          <FadeUp delay={0.6}><Lede>아키텍처 설계, 디자인시스템 수립, 개발 리팩토링, 브랜딩 체계 — 각 영역을 동시에 분석·정의하고 의존 관계 순서에 따라 통합·검증한다.</Lede></FadeUp>
          <FadeUp delay={0.9}>
            <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1120 }}>
              {[
                { tag: '01', sub: 'Architecture',  label: '아키텍처',    desc: '코어·옵션 레이어 분리 · 범용 IA 설계' },
                { tag: '02', sub: 'Design System',  label: '디자인시스템', desc: '피그마 → 토큰 → 코드 핸드오버 파이프라인' },
                { tag: '03', sub: 'Dev / Refactor', label: '개발 리팩토링', desc: '범용화 · 데모 테넌트 · 커넥터 추상화' },
                { tag: '04', sub: 'Branding',       label: '브랜딩',       desc: '고객별 플랫폼 브랜드 자산화 · 차별화' },
              ].map((d, i) => <DomainCard key={i} {...d} />)}
            </div>
          </FadeUp>
        </div>
        <MainMsg>4개 실행 영역을 병렬 정의하고 <strong>단계별 통합으로 솔루션화</strong> 달성.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function DomainCard({ tag, sub, label, desc }) {
  return (
    <div style={{ padding: '22px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: ACCENT_SOFT, border: `1px solid ${ACCENT}`, color: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{tag}</span>
        <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>{sub}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
function FourLayersMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 560 420" style={{ position: 'absolute', right: 60, top: 130, width: 400, height: 300, opacity: 0.7 }}>
      {[0,1,2,3].map(i => {
        const y = 60 + i*85, pulse = 0.5 + Math.sin(t*0.9+i*1.1)*0.3, isCore = i===0;
        return (
          <g key={i}>
            <rect x={40+i*16} y={y} width={480-i*32} height={58} rx={8}
              fill={isCore?`rgba(30,215,96,${0.08+pulse*0.06})`:'rgba(255,255,255,.03)'}
              stroke={isCore?ACCENT:`rgba(255,255,255,${0.12+i*0.04})`}
              strokeWidth={isCore?1.5:1} />
            <text x={280} y={y+34} textAnchor="middle"
              fill={isCore?ACCENT:`rgba(255,255,255,${0.45+i*0.1})`}
              style={{ font: `700 13px ${FONT}`, letterSpacing: '0.22em' }}>
              {['CORE','MODULE','CONNECTOR','PACK'][i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* SLIDE 14 — 레이어 아키텍처 설계 · Visual LayerRows */
function Slide14() {
  const layers = [
    { name: 'CORE',      color: ACCENT,                    bg: ACCENT_SOFT,                  components: ['GitLab 연동 엔진', 'MR·브랜치·파이프라인', '승인 워크플로 엔진', '감사 로그'],         change: '불변 · 버전 관리',    reuse: '모든 고객 공유' },
    { name: 'MODULE',    color: 'rgba(255,255,255,.8)',      bg: 'rgba(255,255,255,.03)',       components: ['보안 정책 대시보드', 'PMS 연동', '리포팅', '알림/메신저'],                            change: '고객별 On/Off',      reuse: '기능 플래그 기반' },
    { name: 'CONNECTOR', color: 'rgba(255,255,255,.65)',     bg: 'rgba(255,255,255,.02)',       components: ['SSO/LDAP', 'Jira', 'BXM · eCAMS', '메신저'],                                         change: '고객별 교체 가능',   reuse: '어댑터 패턴' },
    { name: 'PACK',      color: 'rgba(255,255,255,.5)',      bg: 'rgba(255,255,255,.01)',       components: ['브랜딩 토큰', '메뉴 프리셋', '워크플로 설정'],                                         change: '완전 커스텀',         reuse: '설정 JSON' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={1} density={0.9}>
        <SlideTag num={14} label="레이어 아키텍처 설계" />
        <CoreRingsMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>아키텍처</Eyebrow>
          <Headline size={52}>코어는 불변 · 옵션은 고객별 활성화 —<br/><span style={{ color: ACCENT }}>4계층 분리 구조</span></Headline>
          <Lede>코어를 건드리지 않고 옵션·커넥터·팩 레이어에서만 고객화가 가능해야 반복 판매 구조가 성립한다.</Lede>
        </div>
        <div style={{ position: 'absolute', top: 460, left: 88, right: 88 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {layers.map((l, i) => (
              <FadeUp key={i} delay={0.6 + i * 0.12}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 180px 180px', alignItems: 'center', gap: 0, borderRadius: 8, border: `1px solid ${i===0?ACCENT:'rgba(255,255,255,.1)'}`, background: l.bg, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderRight: `1px solid ${i===0?ACCENT:'rgba(255,255,255,.1)'}`, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: l.color, background: i===0?'rgba(30,215,96,.08)':'rgba(0,0,0,.2)' }}>{l.name}</div>
                  <div style={{ padding: '14px 18px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {l.components.map((c, j) => (
                      <span key={j} style={{ fontSize: 13, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.8)' }}>{c}</span>
                    ))}
                  </div>
                  <div style={{ padding: '14px 14px', borderLeft: '1px solid rgba(255,255,255,.1)', fontSize: 13, color: 'rgba(255,255,255,.55)' }}>{l.change}</div>
                  <div style={{ padding: '14px 14px', borderLeft: '1px solid rgba(255,255,255,.1)', fontSize: 13, color: i===0?ACCENT:'rgba(255,255,255,.55)', fontWeight: i===0?700:400 }}>{l.reuse}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
        <MainMsg>코어 불변 원칙이 지켜질 때만 <strong>반복 판매 구조와 유지보수 효율</strong>이 보장됨.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function CoreRingsMini() {
  const t = useTime();
  const radii = [52,100,148,196];
  return (
    <svg viewBox="0 0 500 500" style={{ position: 'absolute', right: 60, top: 130, width: 320, height: 320, opacity: 0.75 }}>
      {radii.map((r,i) => (
        <circle key={i} cx="250" cy="250" r={r} fill="none"
          stroke={i===0?ACCENT:`rgba(255,255,255,${0.18-i*0.02})`}
          strokeWidth={i===0?2:1} strokeDasharray={i>1?'3 7':'none'}
          transform={`rotate(${t*(i%2===0?10:-7)+i*30} 250 250)`} />
      ))}
      {radii.map((r,i) => {
        const angle = (t*(i%2===0?15:-10))*Math.PI/180;
        const cx = 250+r*Math.cos(angle), cy = 250+r*Math.sin(angle);
        return <circle key={'d'+i} cx={cx} cy={cy} r={i===0?5:3.5} fill={i===0?ACCENT:`rgba(255,255,255,${0.7-i*0.1})`} />;
      })}
      <circle cx="250" cy="250" r="32" fill="rgba(30,215,96,.12)" />
      <circle cx="250" cy="250" r="32" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <text x="250" y="256" textAnchor="middle" fill={ACCENT} style={{ font: `700 12px ${FONT}`, letterSpacing: '0.2em' }}>CORE</text>
    </svg>
  );
}

/* SLIDE 15 — 범용 IA 설계 · IACategory grid */
function Slide15() {
  const cats = [
    { name: '형상관리',   icon: '⬡', core: true,  items: ['MR', '브랜치', '커밋', '태그', '코드 비교', '저장소 설정'] },
    { name: '파이프라인', icon: '▶', core: true,  items: ['CI/CD', '빌드 이력', '배포', '아티팩트', '런너 관리'] },
    { name: '보안·감사', icon: '🔒', core: false, items: ['감사 로그', '권한 관리', '보안 스캔', '정책 설정'] },
    { name: '승인·운영', icon: '✓',  core: true,  items: ['승인 라인 설정', '결재 관리', '환경별 배포 승인'] },
    { name: '통합 연동', icon: '⇄',  core: false, items: ['Jira', '메신저', 'SSO', 'BXM', 'eCAMS', 'Kubernetes'] },
    { name: '관리·설정', icon: '⚙',  core: false, items: ['사용자', '그룹', '멤버', '테넌트 설정', '시스템'] },
  ];
  return (
    <AutoStage>
      <SlideShell variant={2} density={0.8}>
        <SlideTag num={15} label="범용 IA 설계" />
        <MenuDotsMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1200 }}>
          <Eyebrow>IA · 메뉴 구조</Eyebrow>
          <Headline size={52}>신한 특화 IA에서 <span style={{ color: ACCENT }}>범용 메뉴 풀</span>로 —<br/>고객이 서브셋을 선택·활성화</Headline>
        </div>
        <div style={{ position: 'absolute', top: 390, left: 88, right: 88, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {cats.map((c, i) => (
            <FadeUp key={i} delay={0.4 + i * 0.1}>
              <div style={{ padding: '18px 20px', borderRadius: 10, border: `1px solid ${c.core ? ACCENT : 'rgba(255,255,255,.14)'}`, background: c.core ? ACCENT_SOFT : 'rgba(255,255,255,.025)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{c.icon}</span>
                  <span style={{ fontSize: 17, fontWeight: 700, color: c.core ? ACCENT : '#fff' }}>{c.name}</span>
                  <div style={{ marginLeft: 'auto' }}><Pill tone={c.core ? 'green' : 'dim'}>{c.core ? '코어 포함' : '고객 선택'}</Pill></div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.items.map((item, j) => (
                    <span key={j} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.7)' }}>{item}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <MainMsg>모든 메뉴를 미리 정의해두고, <strong>고객별 활성화 플래그</strong>로 서브셋을 구성.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function MenuDotsMini() {
  const t = useTime();
  const cols = 6, rows = 6;
  return (
    <svg viewBox={`0 0 ${cols*28} ${rows*28}`} style={{ position: 'absolute', right: 88, top: 155, width: 220, height: 220, opacity: 0.8 }}>
      {Array.from({length: cols*rows}).map((_,idx) => {
        const cx = (idx%cols)*28+14, cy = Math.floor(idx/cols)*28+14;
        const phase = ((t*0.35+idx*0.07)%4)/4;
        const active = (idx*7+3)%11 < 5;
        const a = active ? 0.7 + Math.sin(phase*Math.PI*2)*0.25 : 0.15;
        return <circle key={idx} cx={cx} cy={cy} r={active?3.5:2} fill={active?ACCENT:'#fff'} opacity={a} />;
      })}
    </svg>
  );
}

/* SLIDE 16 — 디자인시스템 결정 & 토큰 파이프라인 · ABColumns */
function Slide16() {
  const criteria = [
    { label: '초기 공수',     a: '낮음 · 빠른 착수',              b: '높음 · 설계 투자 필수',          pick: 'A' },
    { label: '커스텀 자유도', a: '제한 · Ant token 범위 내',       b: '완전 통제 · 인터랙션 자유',      pick: 'B' },
    { label: '관리 포인트',   a: '커스텀 즉시 폭증',               b: '체계적 · 토큰 단일 관리',        pick: 'B' },
    { label: '피그마 연동',   a: '부분 가능',                      b: '완전 연동 · Variables 활용',     pick: 'B' },
    { label: '브랜딩 대응',   a: '제한적',                         b: '토큰 오버라이드 완전 지원',      pick: 'B' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={3} density={1.0}>
        <SlideTag num={16} label="디자인시스템 결정" />
        <TokenFlowMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1160 }}>
          <Eyebrow>디자인시스템 · 토큰 파이프라인</Eyebrow>
          <Headline size={50}>Ant 안정화 vs 신규 구축 —<br/><span style={{ color: ACCENT }}>피그마→토큰→코드</span> 핸드오버가 핵심 기준</Headline>
          <Lede>어느 방향이든 <strong style={{ color: '#fff' }}>Figma Variables → Style Dictionary → CSS 변수 → 고객 토큰 오버라이드</strong> 파이프라인이 안정적으로 작동해야 솔루션화에 의미가 있다.</Lede>
        </div>
        <div style={{ position: 'absolute', top: 480, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 80px', gap: 0 }}>
            <div style={{ padding: '10px 0', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', fontWeight: 700 }}>평가 기준</div>
            <div style={{ padding: '10px 16px', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', fontWeight: 700, background: 'rgba(255,255,255,.03)', borderRadius: '8px 0 0 0', border: '1px solid rgba(255,255,255,.1)', borderRight: 'none', borderBottom: 'none' }}>A — Ant Design 안정화</div>
            <div style={{ padding: '10px 16px', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, background: ACCENT_SOFT, borderRadius: '0 8px 0 0', border: `1px solid ${ACCENT}`, borderLeft: 'none', borderBottom: 'none' }}>B — 신규 디자인시스템</div>
            <div style={{ padding: '10px 0 10px 16px', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', fontWeight: 700 }}>권고</div>
          </div>
          {criteria.map((c, i) => (
            <FadeUp key={i} delay={0.6 + i * 0.1}>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr 80px', gap: 0 }}>
                <div style={{ padding: '12px 0', fontSize: 14, fontWeight: 700, color: '#fff', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center' }}>{c.label}</div>
                <div style={{ padding: '12px 16px', fontSize: 14, color: c.pick==='A'?'#fff':'rgba(255,255,255,.45)', fontWeight: c.pick==='A'?600:400, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.08)', borderRight: 'none', borderTop: 'none', display: 'flex', alignItems: 'center' }}>{c.a}</div>
                <div style={{ padding: '12px 16px', fontSize: 14, color: c.pick==='B'?ACCENT:'rgba(255,255,255,.45)', fontWeight: c.pick==='B'?700:400, background: c.pick==='B'?ACCENT_SOFT:'rgba(255,255,255,.02)', border: `1px solid ${c.pick==='B'?ACCENT:'rgba(255,255,255,.08)'}`, borderLeft: 'none', borderTop: 'none', display: 'flex', alignItems: 'center' }}>{c.b}</div>
                <div style={{ padding: '12px 16px', fontSize: 16, fontWeight: 700, color: c.pick==='B'?ACCENT:'rgba(255,255,255,.7)', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center' }}>{c.pick}</div>
              </div>
            </FadeUp>
          ))}
        </div>
        <MainMsg>단기 데모는 A, <strong>솔루션 장기 목표는 B</strong> — 병행 검증 후 M2에서 방향 확정.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function TokenFlowMini() {
  const t = useTime();
  const nodes = [{x:80,label:'Figma'},{x:220,label:'Token'},{x:360,label:'Code'},{x:500,label:'Brand'}];
  return (
    <svg viewBox="0 0 600 160" style={{ position: 'absolute', right: 72, top: 185, width: 380, height: 110, opacity: 0.9 }}>
      {nodes.map((n,i) => {
        if (i < nodes.length-1) {
          const progress = ((t*0.6-i*0.4)%1+1)%1;
          const px = n.x + (nodes[i+1].x-n.x)*progress;
          return (
            <g key={'l'+i}>
              <line x1={n.x+28} y1="80" x2={nodes[i+1].x-28} y2="80" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
              <circle cx={px} cy="80" r="4" fill={ACCENT} opacity={0.8} />
            </g>
          );
        }
        return null;
      })}
      {nodes.map((n,i) => (
        <g key={'n'+i}>
          <circle cx={n.x} cy="80" r="26" fill="rgba(0,0,0,.5)" stroke={i===nodes.length-1?ACCENT:'rgba(255,255,255,.3)'} strokeWidth={i===nodes.length-1?2:1} />
          <text x={n.x} y="76" textAnchor="middle" fill={i===nodes.length-1?ACCENT:'#fff'} style={{ font: `700 10px ${FONT}`, letterSpacing: '0.12em' }}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* SLIDE 17 — 프론트엔드 리팩토링 · RefactorCards */
function Slide17() {
  const items = [
    { type: '제거',      tone: 'red',    priority: '1순위',  method: '일괄 탐색·치환',           desc: '신한은행 하드코딩 레이블·텍스트 · 고객사 고유 데이터 구조 · 특화 워크플로 잔재' },
    { type: '추상화',    tone: 'warn',   priority: '1순위',  method: '어댑터 패턴 · config JSON', desc: '인증 레이어 어댑터 분리 · 테넌트 설정 구조화 · 메뉴 설정 파일화' },
    { type: '신규 추가', tone: 'green',  priority: '2순위',  method: '런타임 설정 주입',          desc: '기능 플래그 시스템 · 토큰 오버라이드 로더 · 다국어 키 확장' },
    { type: '검증',      tone: 'neutral',priority: '2순위',  method: '스모크 테스트',             desc: '범용 시나리오 E2E 동작 · 디자인 시스템 토큰 연동 검증' },
  ];
  const toneColor = { red:'rgba(255,80,80,.7)', warn:'#ffa42b', green: ACCENT, neutral:'rgba(255,255,255,.55)' };
  const toneBg = { red:'rgba(255,70,70,.06)', warn:'rgba(255,164,43,.06)', green: ACCENT_SOFT, neutral:'rgba(255,255,255,.02)' };
  const toneBd = { red:'rgba(255,80,80,.3)', warn:'rgba(255,164,43,.4)', green: ACCENT, neutral:'rgba(255,255,255,.12)' };
  return (
    <AutoStage>
      <SlideShell variant={5} density={0.8}>
        <SlideTag num={17} label="프론트엔드 리팩토링" />
        <CodeLinesMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1200 }}>
          <Eyebrow>개발 · 리팩토링</Eyebrow>
          <Headline size={52}>신한 특화 코드를 걷어내고 —<br/><span style={{ color: ACCENT }}>테넌트 중립 범용 구조</span>로 전환</Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {items.map((it, i) => (
              <FadeUp key={i} delay={0.4 + i * 0.12}>
                <div style={{ padding: '20px 20px', borderRadius: 10, border: `1px solid ${toneBd[it.tone]}`, background: toneBg[it.tone], display: 'flex', flexDirection: 'column', gap: 10, minHeight: 240 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: toneColor[it.tone] }}>{it.type}</span>
                    <Pill tone={i < 2 ? 'warn' : 'dim'}>{it.priority}</Pill>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.5, flex: 1 }}>{it.desc}</div>
                  <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.08)', fontSize: 12, color: toneColor[it.tone], fontWeight: 600 }}>{it.method}</div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={1.1}>
            <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['테넌트 ID 기반 설정 주입', '메뉴 플래그 JSON', '인증 어댑터 인터페이스'].map((t, i) => (
                <Pill key={i} tone="green" size="lg">{t}</Pill>
              ))}
            </div>
          </FadeUp>
        </div>
        <MainMsg>리팩토링 후에도 기존 기능 동작을 보장하는 <strong>점진적 전환 전략</strong>이 필수.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function CodeLinesMini() {
  const t = useTime();
  const lines = [{w:0.85,a:false},{w:0.55,a:false},{w:0.70,a:true},{w:0.40,a:false},{w:0.80,a:false},{w:0.60,a:true},{w:0.50,a:false},{w:0.75,a:false}];
  return (
    <svg viewBox="0 0 360 260" style={{ position: 'absolute', right: 80, top: 160, width: 280, height: 200, opacity: 0.7 }}>
      {lines.map((l,i) => {
        const pulse = 0.4 + Math.sin(t*0.7+i*0.9)*0.2;
        return <rect key={i} x="16" y={14+i*28} width={l.w*320} height={14} rx={4}
          fill={l.a?`rgba(30,215,96,${pulse})`:`rgba(255,255,255,${pulse*0.5})`} />;
      })}
    </svg>
  );
}

/* SLIDE 18 — 데모 테넌트 & 핵심 기능 · ScenarioCards */
function Slide18() {
  const scenarios = [
    { name: 'MR → 멀티 승인 → 머지',          priority: '최우선', tone: 'green' },
    { name: '보안 스캔 → 예외 승인 → 배포',    priority: '최우선', tone: 'green' },
    { name: '릴리즈 승인 → 운영 반영 → 이력',  priority: '최우선', tone: 'green' },
    { name: '감사 로그 · 권한 이력 조회',       priority: '최우선', tone: 'green' },
    { name: '운영자 · 승인자 역할별 UX',        priority: '높음',   tone: 'warn' },
    { name: '커밋/파이프라인 액티비티',         priority: '보조',   tone: 'dim' },
  ];
  const tenant = [
    { item: 'GitLab Self-Managed', how: '실 인스턴스 배포',       status: '완전 실동작' },
    { item: '인증 / 계정',          how: 'SSO 모사 stub',          status: '역할 데모용' },
    { item: '감사 / 보안 로그',     how: '실 이벤트 + 시드 데이터', status: '조회·필터' },
    { item: '금융 특화 메뉴',       how: 'UI 셸 + 부분 목 API',   status: '구조·UX 시연' },
    { item: 'CI/CD',                how: '경량 gitlab-ci + 승인 게이트', status: '흐름 시연' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={6} density={0.85}>
        <SlideTag num={18} label="데모 테넌트 & 핵심 기능" />
        <div style={{ position: 'absolute', top: 150, left: 88, right: 88 }}>
          <Eyebrow>데모 테넌트 · 시나리오</Eyebrow>
          <Headline size={46}>실 서비스처럼 보이되 범위는 작게 —<br/><span style={{ color: ACCENT }}>4개 필수 여정 + 2개 보조 기능</span>으로 설득</Headline>
        </div>
        <div style={{ position: 'absolute', top: 370, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 32 }}>
          <FadeUp delay={0.5}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>테넌트 구성</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tenant.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '11px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.025)', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.item}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{t.how}</span>
                      <Pill tone="green">{t.status}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.7}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>핵심 기능 시나리오</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scenarios.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 8, border: `1px solid ${s.tone==='green'?ACCENT:s.tone==='warn'?'rgba(255,164,43,.35)':'rgba(255,255,255,.1)'}`, background: s.tone==='green'?ACCENT_SOFT:s.tone==='warn'?'rgba(255,164,43,.05)':'rgba(255,255,255,.02)' }}>
                    <span style={{ fontSize: 15, fontWeight: s.tone==='green'?700:500, color: s.tone==='dim'?'rgba(255,255,255,.45)':'#fff' }}>{s.name}</span>
                    <Pill tone={s.tone}>{s.priority}</Pill>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
        <MainMsg>데모 목표는 기능 과시가 아니라 <strong>"이 흐름이면 우리도 쓸 수 있겠다"는 확신</strong>을 주는 것이다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* SLIDE 19 — 사업 패키지 · 기대효과 · KPIStats */
function Slide19() {
  const pkgs = [
    { name: '진단 워크숍', dur: '2주',  desc: '현행 핏갭 진단 및 적합성 문서화' },
    { name: 'Demo/POC',    dur: '4주',  desc: '4개 핵심 여정 · 역할 시나리오 검증' },
    { name: 'MVP 구축',    dur: '12주', desc: '코어 도입 · 3~5개 연동 · 정책팩 v1' },
    { name: 'MA/고도화',   dur: '연간', desc: '운영지원 · 추가 커넥터 · 정책팩 확장' },
  ];
  const kpis = [
    { delta: '-30~50%', label: '승인 Lead Time 단축',        base: '현행 메일/수기 결재 대비' },
    { delta: '-60%',    label: '감사 증빙 준비 시간',         base: '로그·승인·배포 이력 일원화 기준' },
    { delta: '2주',     label: '신규 고객 fit-gap 리드타임', base: '진단 워크숍 표준화 기준' },
    { delta: '3일',     label: '데모 테넌트 재구성',          base: '설치 스크립트/시드 데이터 기준' },
    { delta: '1주',     label: '포크 없는 고객화',            base: '정책팩/브랜딩팩 교체 기준' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={8} density={0.9} accent={1.3}>
        <SlideTag num={19} label="사업 패키지 · 기대효과" />
        <div style={{ position: 'absolute', top: 150, left: 88, right: 88 }}>
          <Eyebrow>GTM · KPI</Eyebrow>
          <Headline size={48}>컨설팅 논의에 바로 올릴 수 있는<br/><span style={{ color: ACCENT }}>상품 패키지와 기대효과 수치</span></Headline>
        </div>
        <div style={{ position: 'absolute', top: 370, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32 }}>
          <FadeUp delay={0.4}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>제안 패키지 구조</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pkgs.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 8, border: `1px solid ${i===2?ACCENT:'rgba(255,255,255,.12)'}`, background: i===2?ACCENT_SOFT:'rgba(255,255,255,.025)', overflow: 'hidden' }}>
                    <div style={{ width: 56, padding: '14px 12px', background: i===2?'rgba(30,215,96,.12)':'rgba(0,0,0,.2)', borderRight: `1px solid ${i===2?ACCENT:'rgba(255,255,255,.1)'}`, fontSize: 12, fontWeight: 700, color: i===2?ACCENT:'rgba(255,255,255,.45)', textAlign: 'center' }}>{p.dur}</div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: i===2?ACCENT:'#fff', marginBottom: 3 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.6}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>목표 KPI (내부 가정)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr) 1fr', gap: 10 }}>
                {kpis.map((k, i) => (
                  <div key={i} style={{ padding: '16px 16px', borderRadius: 10, border: `1px solid ${i<2?ACCENT:'rgba(255,255,255,.12)'}`, background: i<2?ACCENT_SOFT:'rgba(255,255,255,.025)', gridColumn: i===4?'span 3':'span 1' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: i<2?ACCENT:'#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{k.delta}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: i<2?ACCENT:'rgba(255,255,255,.8)', marginTop: 5, lineHeight: 1.3 }}>{k.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>{k.base}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
        <MainMsg>컨설팅 논의의 핵심은 <strong>어떤 패키지를 얼마 기간에 어떤 효과로 팔 것인가</strong>다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* SLIDE 20 — 12주 실행 로드맵 · 리스크 · StaffCards + RiskCards */
function Slide20() {
  const staff = [
    { role: 'PO/PM',             fte: '1.0 FTE', resp: '범위 통제 · 의사결정 · 대외 스토리라인' },
    { role: 'Tech Lead/Architect', fte: '1.0 FTE', resp: '코어/옵션 경계 · 연동 구조' },
    { role: 'Backend',            fte: '2.0 FTE', resp: '워크플로 엔진 · 감사로그 · 커넥터' },
    { role: 'Frontend',           fte: '2.0 FTE', resp: '운영자 UX · 테넌트 설정 · 디자인 반영' },
    { role: 'QA/BA',              fte: '1.0 FTE', resp: '시나리오 검증 · 문서화 · 데모 리허설' },
    { role: 'Infra/DevOps',       fte: '0.5–1.0', resp: '배포 자동화 · 환경 구성' },
  ];
  const risks = [
    { id: 'R1', desc: '첫 고객 요구가 MVP 범위를 잠식', action: '4개 핵심 흐름 외 요구는 M2 이후로 이연', level: 'high' },
    { id: 'R2', desc: '고객사별 포크 발생',              action: '정책팩/브랜딩팩/커넥터 외 수정 금지',     level: 'high' },
    { id: 'R3', desc: '인증·연동 난이도 과소평가',       action: 'W3-4에 어댑터 스파이크 선행',             level: 'mid' },
    { id: 'R4', desc: '디자인시스템 방향 지연',           action: '단기 Ant 안정화 + 장기 토큰 파이프라인 병행', level: 'mid' },
    { id: 'R5', desc: '영업 메시지 부재',                 action: 'W9부터 제안서/데모 스크립트 동시 제작',   level: 'low' },
  ];
  return (
    <AutoStage>
      <SlideShell variant={11} density={0.85} accent={1.3}>
        <SlideTag num={20} label="12주 실행 로드맵 · 리스크" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1400 }}>
          <Eyebrow>실행 로드맵</Eyebrow>
          <Headline size={50}>3개월 안에 <span style={{ color: ACCENT }}>바로 스타트 가능한 MVP</span>를 만들기 위한<br/>인력·리스크·Gate 관리</Headline>
        </div>
        <RoadmapProgress />
        <div style={{ position: 'absolute', top: 490, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
          <FadeUp delay={0.8}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>권장 투입 인력 (내부 가정)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {staff.map((s, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 70px 1fr', alignItems: 'center', gap: 0, borderRadius: 7, border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.025)', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700 }}>{s.role}</div>
                    <div style={{ padding: '10px 10px', borderLeft: `1px solid ${ACCENT}`, background: ACCENT_SOFT, fontSize: 13, fontWeight: 700, color: ACCENT, textAlign: 'center' }}>{s.fte}</div>
                    <div style={{ padding: '10px 14px', borderLeft: '1px solid rgba(255,255,255,.1)', fontSize: 12, color: 'rgba(255,255,255,.55)' }}>{s.resp}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={1.0}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 12 }}>핵심 리스크와 대응</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {risks.map((r, i) => {
                  const levelColor = r.level==='high'?'rgba(255,80,80,.6)':r.level==='mid'?'#ffa42b':'rgba(255,255,255,.4)';
                  const levelBd = r.level==='high'?'rgba(255,80,80,.3)':r.level==='mid'?'rgba(255,164,43,.3)':'rgba(255,255,255,.1)';
                  return (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${levelBd}`, background: 'rgba(255,255,255,.02)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: levelColor, letterSpacing: '0.12em', flexShrink: 0, marginTop: 1 }}>{r.id}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{r.desc}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{r.action}</div>
                      </div>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: levelColor, flexShrink: 0, marginTop: 4 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        </div>
        <MainMsg>Go 조건은 12주 내 <strong>제안 가능한 MVP</strong>를 만드는 것이고, No-Go 조건은 범위 통제가 무너지는 순간이다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function RoadmapProgress() {
  const t = useTime();
  const head = clamp((t-1.2)/5.0, 0, 1);
  const phases = ['W1–2 범위고정','W3–4 코어정비','W5–6 데모테넌트','W7–8 정책연동','W9–10 영업패키지','W11–12 첫제안'];
  return (
    <div style={{ position: 'absolute', top: 370, left: 88, right: 88 }}>
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,.12)', marginBottom: 14 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${head*100}%`, background: ACCENT }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
        {phases.map((p, i) => {
          const visible = head > i/6;
          return (
            <div key={i} style={{ opacity: visible?1:0.3 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: visible?ACCENT:'rgba(255,255,255,.3)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: visible?ACCENT:'rgba(255,255,255,.4)', fontWeight: 700, letterSpacing: '0.06em' }}>{p}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Mount ──────────────────────────────────────────────────────── */
const SLIDES = [
  Slide01, Slide02, Slide03, Slide04, Slide05, Slide06,
  Slide07, Slide08, Slide09, Slide10, Slide11, Slide12,
  Slide13, Slide14, Slide15, Slide16, Slide17, Slide18, Slide19, Slide20,
];
SLIDES.forEach((Comp, i) => {
  const mount = document.getElementById(`s${i + 1}`);
  if (mount) ReactDOM.createRoot(mount).render(<Comp />);
});

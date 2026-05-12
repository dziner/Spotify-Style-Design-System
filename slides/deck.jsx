// deck.jsx — Slide content with denser supporting evidence.
// Layout: title block (left) + structured content (table/list/grid) +
//         compact motif graphic. Motion via animations.jsx useTime.

const { useEffect, useState, useRef } = React;
const ACCENT = '#1ed760';
const ACCENT_SOFT = 'rgba(30,215,96,0.10)';
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

/* ─── AutoStage ──────────────────────────────────────────────────────── */
function AutoStage({ duration = 14, children }) {
  const [time, setTime] = useState(0);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let raf = null, last = null;

    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setTime(t => t + dt);
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!raf) { last = null; raf = requestAnimationFrame(tick); } };
    const stop  = () => { if (raf) { cancelAnimationFrame(raf); raf = null; last = null; } };

    // Walk up to the parent <section> to pause/resume with slide visibility
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
    } else {
      start();
    }

    return () => { stop(); if (mo) mo.disconnect(); };
  }, []);

  return (
    <TimelineContext.Provider value={{ time, duration, playing: true }}>
      <span ref={sentinelRef} style={{ display: 'none' }} />
      {children}
    </TimelineContext.Provider>
  );
}

/* ─── Shell ─────────────────────────────────────────────────────────── */
function SlideShell({ variant, density = 1.0, accent = 1.0, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', overflow: 'hidden', color: '#fff', fontFamily: FONT }}>
      <ShaderBG variant={variant} density={density} accent={accent} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
}

function SlideTag({ num, total, label }) {
  return (
    <div style={{
      position: 'absolute', top: 56, left: 88,
      display: 'flex', alignItems: 'center', gap: 16,
      fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.55)', fontWeight: 500,
    }}>
      <span style={{ color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{String(num).padStart(2, '0')}</span>
      <span style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.3)' }} />
      <span>{label}</span>
      <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.3)' }}>/ {String(total).padStart(2, '0')}</span>
    </div>
  );
}

function MainMsg({ children }) {
  return (
    <div style={{
      position: 'absolute', bottom: 56, left: 88, right: 88,
      paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.18)',
      display: 'flex', alignItems: 'center', gap: 24,
    }}>
      <span style={{
        fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: ACCENT, fontWeight: 700, whiteSpace: 'nowrap',
      }}>Main Message</span>
      <span style={{ fontSize: 19, fontWeight: 500, color: 'rgba(255,255,255,0.92)', lineHeight: 1.45 }}>{children}</span>
    </div>
  );
}

function FadeUp({ delay = 0, dur = 0.5, children, style }) {
  const t = useTime();
  const p = clamp((t - delay) / dur, 0, 1);
  const e = Easing.easeOutCubic(p);
  return (
    <div style={{ opacity: e, transform: `translateY(${(1 - e) * 14}px)`, willChange: 'transform, opacity', ...style }}>
      {children}
    </div>
  );
}

/* ─── Reusable content primitives ───────────────────────────────────── */
const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 18 }}>
    {children}
  </div>
);
const Headline = ({ children, size = 48 }) => (
  <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.02em', textWrap: 'balance', color: '#fff' }}>
    {children}
  </div>
);
const Lede = ({ children }) => (
  <div style={{ marginTop: 18, fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, maxWidth: 720 }}>
    {children}
  </div>
);

function DataTable({ cols, rows }) {
  return (
    <div style={{ width: '100%', fontSize: 15 }}>
      <div style={{
        display: 'grid', gridTemplateColumns: cols.template,
        padding: '10px 0', borderBottom: `1px solid ${ACCENT}`,
        fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700,
      }}>
        {cols.heads.map((h, i) => <div key={i}>{h}</div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: cols.template,
          padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.10)',
          fontSize: 16, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4,
        }}>
          {r.map((c, j) => (
            <div key={j} style={j === 0 ? { fontWeight: 700, color: '#fff' } : {}}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 01 — Executive Thesis
   ════════════════════════════════════════════════════════════════════════ */
function Slide01() {
  return (
    <AutoStage>
      <SlideShell variant={0} density={0.9}>
        <SlideTag num={1} total={12} label="Executive Thesis" />
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
            <Lede>
              이번 의사결정의 본질은 신규 개발 착수 여부가 아니라,
              <strong style={{ color: '#fff' }}> 사업 자산으로의 전환 여부</strong>.
              아래 두 선택지 중 하나를 오늘 확정해야 한다.
            </Lede>
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
    <div style={{
      padding: 22, borderRadius: 10,
      border: `1px solid ${accent ? ACCENT : 'rgba(255,255,255,0.22)'}`,
      background: accent ? ACCENT_SOFT : 'rgba(255,255,255,0.02)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{
          width: 26, height: 26, borderRadius: '50%',
          background: accent ? ACCENT : 'rgba(255,255,255,0.15)',
          color: accent ? '#000' : '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700,
        }}>{kind}</span>
        <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent ? ACCENT : 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
          Option {kind}
        </span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
function Orbit() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 60, top: 140, width: 460, height: 460, opacity: 0.65 }}>
      <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(255,255,255,0.15)" />
      <circle cx="300" cy="300" r="160" fill="none" stroke="rgba(255,255,255,0.22)" />
      <circle cx="300" cy="300" r="80"  fill="none" stroke="rgba(255,255,255,0.32)" />
      <circle cx="300" cy="300" r="6"   fill={ACCENT} />
      <g transform={`rotate(${t * 22} 300 300)`}><circle cx="540" cy="300" r="4" fill={ACCENT} /></g>
      <g transform={`rotate(${-t * 35 + 90} 300 300)`}><circle cx="460" cy="300" r="3" fill="rgba(255,255,255,0.75)" /></g>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 02 — Why This Matters Now
   ════════════════════════════════════════════════════════════════════════ */
function Slide02() {
  return (
    <AutoStage>
      <SlideShell variant={1} density={1.1}>
        <SlideTag num={2} total={12} label="Why This Matters Now" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>타이밍</Eyebrow>
          <Headline size={56}>
            지금 제품화하지 않으면<br/>
            <span style={{ color: ACCENT }}>코드 자산은 다시 흩어진다</span>
          </Headline>
          <Lede>
            기능·UI 자산은 이미 상당 수준으로 누적되어 있고, 금융권의 승인·감사·통제 요구는 계속 확대 중.
            타이밍을 놓치면 코드는 다음 고객사 포크와 요구사항 대응물로 소모된다.
          </Lede>
        </div>
        <RipplePulse />
        <div style={{ position: 'absolute', top: 540, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.9}>
            <DataTable
              cols={{ template: '110px 1.1fr 1.6fr 0.9fr', heads: ['Risk', '관성', '결과', '확률'] }}
              rows={[
                ['R-01', '단건 구축 관성 지속', '고객별 커스터마이징 자산으로 자원 분산', '높음'],
                ['R-02', '반복 수익 구조 미형성', '라이선스 · 유지보수 매출 기회 상실', '확정적'],
                ['R-03', '재사용성 저하', '후속 고객 대응 단가·속도 모두 악화', '높음'],
                ['R-04', '경쟁 진입 가속', '대형 SI 또는 외산 솔루션이 표준화 선점', '중간'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>지금은 기술 개발보다 <strong>자산 구조화와 사업 모델 전환</strong>이 필요한 시점.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function RipplePulse() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 140, width: 360, height: 360, opacity: 0.55 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const phase = ((t * 0.5 + i * 0.2) % 1);
        const r = 20 + phase * 240;
        const op = (1 - phase) * 0.6;
        return <circle key={i} cx="300" cy="300" r={r} fill="none" stroke={i === 2 ? ACCENT : 'rgba(255,255,255,0.7)'} strokeWidth="1" opacity={op} />;
      })}
      <circle cx="300" cy="300" r="8" fill={ACCENT} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 03 — What We Already Own
   ════════════════════════════════════════════════════════════════════════ */
function Slide03() {
  return (
    <AutoStage>
      <SlideShell variant={2} density={0.7}>
        <SlideTag num={3} total={12} label="What We Already Own" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>자산</Eyebrow>
          <Headline size={54}>
            출발점은 아이디어가 아니라<br/>
            <span style={{ color: ACCENT }}>이미 구현된 코어 제품 후보</span>
          </Headline>
        </div>
        <AssetGridMini />
        <div style={{ position: 'absolute', top: 440, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '1.1fr 1.4fr 1.4fr 0.9fr', heads: ['확보 자산', '근거', '제품화 적합도', '상태'] }}
              rows={[
                ['GitLab 기반 형상관리 UI', '신한은행 운영용 UI 일체', '코어 · 그대로 활용', '확보'],
                ['MR · 브랜치 · 커밋 · 파이프라인 관리자', '운영자/승인자 워크플로 구현', '코어 · 그대로 활용', '확보'],
                ['다국어 디자인 시스템 · Storybook', '컴포넌트 추출 가능 상태', '코어 · 정리 필요', '확보'],
                ['금융권 승인 운영 UX 경험', '실제 운영 적용 사례', '경쟁 차별 · 비코드 자산', '검증됨'],
                ['보안·감사 통제 도메인 지식', '인증·권한·로그 운영 요건', '커넥터 · 모듈로 분리', '내재'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.4}>
            <div style={{
              marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap',
              fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
            }}>
              {['Zero to One 아님', '재개발보다 제품화 정리', '이미 확보된 코어'].map((t, i) => (
                <span key={i} style={{
                  padding: '8px 16px', borderRadius: 999,
                  border: `1px solid ${ACCENT}`, color: ACCENT, background: ACCENT_SOFT,
                }}>{t}</span>
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
    <svg viewBox={`0 0 ${cols*22} ${rows*22}`} style={{
      position: 'absolute', right: 88, top: 165, width: 320, height: 110, opacity: 0.85,
    }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const cx = (i % cols) * 22 + 11;
        const cy = Math.floor(i / cols) * 22 + 11;
        const phase = ((t * 0.3 + i * 0.04) % 3) / 3;
        const isAccent = (i * 13) % 17 < 5 && phase < 0.45;
        const a = isAccent ? 1 : 0.2 + Math.sin(phase * Math.PI) * 0.15;
        return <circle key={i} cx={cx} cy={cy} r={isAccent ? 2.4 : 1.4} fill={isAccent ? ACCENT : '#fff'} opacity={a} />;
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 04 — What We Can Sell
   ════════════════════════════════════════════════════════════════════════ */
function Slide04() {
  return (
    <AutoStage>
      <SlideShell variant={3} density={1.2} accent={1.4}>
        <SlideTag num={4} total={12} label="What We Can Sell" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>상품 정의</Eyebrow>
          <Headline size={54}>
            판매 대상은 Git UI가 아니라<br/>
            <span style={{ color: ACCENT }}>금융권형 개발운영 통제 플랫폼</span>
          </Headline>
        </div>
        <CapsuleLayersMini />
        <div style={{ position: 'absolute', top: 430, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '120px 1.3fr 1.7fr 0.9fr', heads: ['계층', '구성 요소', '제공 가치', '수익 모델'] }}
              rows={[
                ['Core', '코어 플랫폼 (GitLab 운영 고도화)', '승인·감사·통제 UX, 운영자/승인자 통합', '라이선스'],
                ['Module', '옵션 모듈 (PMS · 보안 정책 · 리포팅)', '고객별 활성/비활성 가능, 라인업 확장', '라이선스'],
                ['Connector', '인증·메신저·업무도구 연동', 'SSO · Jira · 메신저 · 결재 공존', '구축 + 옵션'],
                ['Pack', '고객 설정팩 (브랜딩 · 워크플로 프리셋)', '코드 포크 없이 고객 맞춤화', '구축 + 운영'],
                ['Service', '구축 · 유지보수 · 고도화 서비스', '온프레미스 도입과 운영 책임', '구축 + MA'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.5}>
            <div style={{ marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>
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
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 130, width: 340, height: 340, opacity: 0.85 }}>
      {[260, 200, 140, 80].map((r, i) => (
        <circle key={i} cx="300" cy="300" r={r} fill="none"
          stroke={i === 3 ? ACCENT : `rgba(255,255,255,${0.16 + i * 0.06})`}
          strokeWidth={i === 3 ? 2 : 1}
          strokeDasharray={i < 2 ? '2 6' : 'none'}
          transform={`rotate(${t * (i % 2 === 0 ? 12 : -8)} 300 300)`} />
      ))}
      <circle cx="300" cy="300" r="44" fill="rgba(30,215,96,0.12)" />
      <circle cx="300" cy="300" r="44" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <text x="300" y="306" textAnchor="middle" fill={ACCENT} style={{ font: '700 14px ' + FONT, letterSpacing: '0.22em' }}>CORE</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 05 — Where The Market Is
   ════════════════════════════════════════════════════════════════════════ */
function Slide05() {
  return (
    <AutoStage>
      <SlideShell variant={4} density={1.0}>
        <SlideTag num={5} total={12} label="Where The Market Is" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>시장</Eyebrow>
          <Headline size={54}>
            은행 단독이 아니라<br/>
            <span style={{ color: ACCENT }}>금융권 3업권 동시 공략</span>
          </Headline>
          <Lede>제품 기준선은 가장 까다로운 <strong style={{ color: '#fff' }}>은행급 통제 수준</strong>으로 고정.
            영업 시장은 그 기준을 만족할 수 있는 곳까지 넓게.</Lede>
        </div>
        <ThreeNodesMini />
        <div style={{ position: 'absolute', top: 500, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '110px 1.3fr 1.6fr 1.0fr 1.0fr', heads: ['업권', '공통 수요', '특이 요구', '예상 접근', '진입 난이도'] }}
              rows={[
                ['은행',   '승인·감사·권한 통제 · 폐쇄형 운영', '망분리 · 감독원 보고 요건',     '레퍼런스 기반 구축형',  '높음 · 기준선'],
                ['증권',   '동일 통제 요구 · 거래 시스템 안정성', '체결·정산 시스템과의 분리',     '파일럿 → 단계 확대',     '중상'],
                ['보험',   '동일 통제 요구 · 장기 운영성',         '레거시 코어 연계 다수',         '레거시 통합형 제안',     '중'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>영업 시장은 넓게, <strong>제품 기준은 가장 까다롭게</strong> 설정.</MainMsg>
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
    <svg viewBox="0 0 600 400" style={{ position: 'absolute', right: 80, top: 140, width: 380, height: 270, opacity: 0.92 }}>
      {[[0,1],[1,2],[2,0]].map(([a,b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={ACCENT} strokeWidth="1.2" strokeDasharray="5 6"
          strokeDashoffset={-(t * 30 + i * 20) % 80} opacity="0.55" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.size + 10 + Math.sin(t*1.2 + i)*3} fill="none" stroke="rgba(255,255,255,0.18)" />
          <circle cx={n.x} cy={n.y} r={n.size} fill="rgba(0,0,0,0.55)" stroke="#fff" strokeWidth="1.5" />
          <text x={n.x} y={n.y - 2} textAnchor="middle" fill="#fff" style={{ font: '700 18px ' + FONT }}>{n.label}</text>
          <text x={n.x} y={n.y + 16} textAnchor="middle" fill={ACCENT} style={{ font: '700 9px ' + FONT, letterSpacing: '0.22em' }}>{n.sub}</text>
        </g>
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 06 — Why Customers Will Care
   ════════════════════════════════════════════════════════════════════════ */
function Slide06() {
  return (
    <AutoStage>
      <SlideShell variant={5} density={0.9}>
        <SlideTag num={6} total={12} label="Why Customers Will Care" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>차별 포인트</Eyebrow>
          <Headline size={54}>
            고객이 사는 것은 기능이 아니라<br/>
            <span style={{ color: ACCENT }}>운영 통제와 감사 대응 역량</span>
          </Headline>
        </div>
        <ControlShieldMini />
        <div style={{ position: 'absolute', top: 460, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '1.2fr 1.6fr 1.6fr', heads: ['고객 페인포인트', '범용 DevOps 한계', '우리의 대응'] }}
              rows={[
                ['승인·운영자 UX 부재',           'GitLab 단독은 개발자 중심 UX',    '운영자/승인자 통합 UX 제공'],
                ['승인 파이프라인 흐름 분산',     '도구별 파편화 · 추적 어려움',     '단일 흐름으로 통제 + 감사 로그'],
                ['망분리 · 온프레미스 강제',      'SaaS 종속 · 외부 의존 큼',         '온프레미스 / 프라이빗 클라우드 대응'],
                ['기존 체계와의 공존 요구',       '도입 시 기존 도구 대체 강요',      'Jira · 인증 · 메신저 공존 구조'],
                ['보안 감사 추적성',              '운영 로그 일관성 부족',            '감사 대응 표준 로그 · 권한 모델'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>범용 DevOps 경쟁이 아니라 <strong>금융권 운영 현실 적합성 경쟁</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ControlShieldMini() {
  const t = useTime();
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${300 + Math.cos(a)*160},${300 + Math.sin(a)*160}`);
  }
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 80, top: 130, width: 320, height: 320, opacity: 0.85 }}>
      <polygon points={pts.join(' ')} fill="none" stroke="rgba(255,255,255,0.25)" />
      <polygon points={pts.join(' ')} fill="none" stroke={ACCENT} strokeWidth="1" strokeDasharray="4 8" transform={`rotate(${t * 8} 300 300)`} />
      <circle cx="300" cy="300" r="100" fill="none" stroke="rgba(255,255,255,0.2)" />
      <g transform={`rotate(${t * 55} 300 300)`}>
        <line x1="300" y1="300" x2="300" y2="140" stroke={ACCENT} strokeWidth="1.5" opacity="0.7" />
      </g>
      <circle cx="300" cy="300" r="5" fill={ACCENT} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 07 — Productization Boundary
   ════════════════════════════════════════════════════════════════════════ */
function Slide07() {
  return (
    <AutoStage>
      <SlideShell variant={6} density={0.8}>
        <SlideTag num={7} total={12} label="Productization Boundary" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1280 }}>
          <Eyebrow>경계</Eyebrow>
          <Headline size={50}>
            성공은 기능 수가 아니라<br/>
            <span style={{ color: ACCENT }}>제품 경계 통제 역량</span>이 결정한다
          </Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1.1fr 1.1fr 1fr', gap: 24 }}>
          <FadeUp delay={0.5}>
            <BoundaryCol tone="accent" head="INSIDE · 그대로 활용" items={[
              'GitLab 형상관리 UI',
              'MR · 브랜치 · 커밋 · 파이프라인 관리자',
              '운영자/승인자 워크플로',
            ]} />
          </FadeUp>
          <FadeUp delay={0.7}>
            <BoundaryCol tone="neutral" head="RE-WORK · 재정리 필요" items={[
              '인증 · 권한 · SSO 분리',
              '브랜딩 · 디자인 토큰 추출',
              '외부 연동 커넥터 추상화',
            ]} />
          </FadeUp>
          <FadeUp delay={0.9}>
            <BoundaryCol tone="warn" head="RISK · 경계 침범 주의" items={[
              '고객사별 포크 확대',
              '첫 고객 요구 = 로드맵 위험',
              '멀티 SCM 조기 확장 유혹',
            ]} />
          </FadeUp>
        </div>
        <div style={{ position: 'absolute', top: 760, left: 88, right: 88 }}>
          <FadeUp delay={1.1}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
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
  const c = tone === 'accent' ? ACCENT : tone === 'warn' ? '#ffa42b' : 'rgba(255,255,255,0.55)';
  const bg = tone === 'accent' ? ACCENT_SOFT : tone === 'warn' ? 'rgba(255,164,43,0.06)' : 'rgba(255,255,255,0.03)';
  return (
    <div style={{ padding: 24, border: `1px solid ${c}`, borderRadius: 8, background: bg, minHeight: 280 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: c, fontWeight: 700, marginBottom: 16 }}>{head}</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i === 0 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)', fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>
          <span style={{ color: c, fontVariantNumeric: 'tabular-nums', fontSize: 12, marginTop: 4 }}>0{i + 1}</span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 08 — Commercial Logic
   ════════════════════════════════════════════════════════════════════════ */
function Slide08() {
  return (
    <AutoStage>
      <SlideShell variant={7} density={1.0}>
        <SlideTag num={8} total={12} label="Commercial Logic" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>수익 구조</Eyebrow>
          <Headline size={52}>
            단건 구축 수익을<br/>
            <span style={{ color: ACCENT }}>반복 판매 구조로 전환</span>할 드문 기회
          </Headline>
        </div>
        <RecurringPulseMini />
        <div style={{ position: 'absolute', top: 450, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '120px 1.3fr 1.5fr 1.2fr', heads: ['수익원', '형태', '재계약 / 확장 동력', '단가 성격'] }}
              rows={[
                ['라이선스',   '코어 + 옵션 모듈',         '연 단위 갱신 · 옵션 추가 판매',         '반복 수익'],
                ['구축',       '온프레미스 도입 · 연동',   '레퍼런스 확보 · 후속 고객으로 확장',     '프로젝트성'],
                ['유지보수',   '연간 MA · 운영 지원',      '버전 업그레이드 · 보안 패치 동력',       '반복 수익'],
                ['고도화',     '맞춤 워크플로 · 설정팩',   '고객 성장에 비례하는 추가 매출',         '프로젝트성'],
                ['레퍼런스',   '금융권 확장 효과',         '한 고객 확보가 다음 고객을 부른다',       '간접 효과'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.4}>
            <div style={{ marginTop: 20, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              ※ SI 단건 매출 구조를 <strong style={{ color: '#fff' }}>자산 누적형 사업 구조</strong>로 전환할 수 있는지가 본 전환의 핵심 검증 지점.
            </div>
          </FadeUp>
        </div>
        <MainMsg>기술 검토를 넘어 <strong>사업 구조 전환 논리</strong>까지 확보 가능.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function RecurringPulseMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 500 200" style={{ position: 'absolute', right: 80, top: 170, width: 380, height: 150, opacity: 0.95 }}>
      <line x1="20" y1="120" x2="490" y2="120" stroke="rgba(255,255,255,0.2)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 40 + i * 56;
        const phase = (t * 0.8 - i * 0.18) % 2;
        const visible = phase > 0 && phase < 1.5;
        const h = visible ? Math.sin(phase * Math.PI) * 70 : 0;
        return (
          <g key={i}>
            <line x1={x} y1="120" x2={x} y2={120 - h} stroke={i === 0 ? '#fff' : ACCENT} strokeWidth="2" />
            <circle cx={x} cy={120 - h} r={h > 4 ? 4 : 0} fill={i === 0 ? '#fff' : ACCENT} />
          </g>
        );
      })}
      <text x="40" y="180" fill="rgba(255,255,255,0.5)" style={{ font: '700 11px ' + FONT, letterSpacing: '0.2em' }}>ONE-OFF</text>
      <text x="480" y="180" textAnchor="end" fill={ACCENT} style={{ font: '700 11px ' + FONT, letterSpacing: '0.2em' }}>RECURRING</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 09 — Conditions To Win
   ════════════════════════════════════════════════════════════════════════ */
function Slide09() {
  return (
    <AutoStage>
      <SlideShell variant={8} density={0.8}>
        <SlideTag num={9} total={12} label="Conditions To Win" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>조건</Eyebrow>
          <Headline size={50}>
            추진 여부보다 중요한 것은<br/>
            <span style={{ color: ACCENT }}>어떤 조건으로 추진할 것인가</span>
          </Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.5}>
            <DataTable
              cols={{ template: '120px 1.3fr 1.6fr 1.2fr', heads: ['조건', '내용', '없을 시 결과', '우선순위'] }}
              rows={[
                ['C-01', 'Product Owner 지정',         '로드맵 표류 · 영업 메시지 부재',         '필수 · 0일차'],
                ['C-02', 'Tech Lead 지정',             '아키텍처 경계 붕괴 · 포크 확산',          '필수 · 0일차'],
                ['C-03', '인증·브랜딩·연동 분리 착수', '재정리 비용이 매 고객마다 발생',         '필수 · 30일'],
                ['C-04', '제품화 원칙 내부 합의',     '의사결정 충돌 · 단건 구축으로 회귀',     '필수 · 30일'],
                ['C-05', '영업·프리세일즈 메시지 병행', '제품만 있고 팔 줄 모르는 상태',         '핵심 · 60일'],
                ['C-06', '제품 운영 체계 (이슈·릴리스·QA)', '고객사별 핫픽스 누적',              '핵심 · 90일'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>조직적 준비 없는 추진은 솔루션 사업이 아니라 <strong>또 하나의 SI 프로젝트</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 10 — 6-Month Path To First Deal
   ════════════════════════════════════════════════════════════════════════ */
function Slide10() {
  return (
    <AutoStage>
      <SlideShell variant={9} density={0.7}>
        <SlideTag num={10} total={12} label="6-Month Path To First Deal" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1380 }}>
          <Eyebrow>로드맵</Eyebrow>
          <Headline size={50}>
            6개월 안에 완성이 아니라<br/>
            <span style={{ color: ACCENT }}>6개월 안에 판매 가능한 형태</span>
          </Headline>
        </div>
        <TimelineBar />
        <div style={{ position: 'absolute', top: 580, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '90px 1.1fr 1.5fr 1.0fr', heads: ['시점', '단계', '산출물', 'Gate'] }}
              rows={[
                ['M1',   '제품화 범위 확정',          '코어/옵션/커넥터/팩 경계 정의서',         '의사결정 통과'],
                ['M2',   '인증·브랜딩·연동 분리',    '추상화된 커넥터 인터페이스 v1',           '내부 데모'],
                ['M3',   'GitLab-first 코어 정비',   '레퍼런스 워크플로 + 운영자 UX 정리',     '내부 시연'],
                ['M4-5', '데모 · 파일럿 패키지',     '온프레미스 설치 패키지 + 시연 시나리오',  '잠재 고객 데모'],
                ['M6',   '첫 금융권 제안 착수',      '제안서 · 견적 · POC 계획',                 '제안 제출'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>로드맵 평가는 기능 수가 아니라 <strong>첫 고객 제안 가능 여부</strong> 기준.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function TimelineBar() {
  const t = useTime();
  const head = clamp((t - 1.0) / 4.0, 0, 1);
  const steps = ['M1','M2','M3','M4-5','M6'];
  return (
    <div style={{ position: 'absolute', top: 380, left: 88, right: 88, maxWidth: 1740 }}>
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.15)', marginBottom: 24 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${head*100}%`, background: ACCENT }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
        {steps.map((m, i) => {
          const visible = head > i / 5;
          return (
            <div key={i} style={{ opacity: visible ? 1 : 0.3 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: visible ? ACCENT : 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: 13, letterSpacing: '0.2em', color: ACCENT, fontWeight: 700 }}>{m}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 11 — Decision Required
   ════════════════════════════════════════════════════════════════════════ */
function Slide11() {
  return (
    <AutoStage>
      <SlideShell variant={10} density={1.0}>
        <SlideTag num={11} total={12} label="Decision Required" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>오늘의 결정</Eyebrow>
          <Headline size={48}>
            오늘 필요한 판단은<br/>
            <span style={{ color: ACCENT }}>추진 여부와 추진 원칙의 동시 확정</span>
          </Headline>
        </div>
        <DivergePathsMini />
        <div style={{ position: 'absolute', top: 430, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '70px 1.5fr 1fr 1fr', heads: ['#', '결정 항목', '선택 A', '선택 B'] }}
              rows={[
                ['Q1', '이 자산을 솔루션으로 승격할 것인가',     '아니오 · 프로젝트 유지',     '예 · 솔루션 승격'],
                ['Q2', 'GitLab-first 전략을 유지할 것인가',      '멀티 SCM 고려',                'GitLab-first 유지'],
                ['Q3', '금융권 구축형 포지셔닝으로 갈 것인가',  '범용 DevOps 진입',            '금융권 구축형'],
                ['Q4', '초기 6개월 인력·시간을 투입할 것인가',  '대기 · 우선순위 하향',         '투입 · 1순위 과제'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.4}>
            <div style={{
              marginTop: 26, padding: '20px 24px', border: `1px solid ${ACCENT}`, borderRadius: 8,
              background: ACCENT_SOFT, fontSize: 19, fontWeight: 600, lineHeight: 1.5,
            }}>
              <span style={{ color: ACCENT, marginRight: 12 }}>핵심 질문 →</span>
              이 자산을 <strong style={{ color: '#fff' }}>프로젝트 결과물</strong>로 소모할 것인가,
              아니면 <strong style={{ color: '#fff' }}>사업 자산</strong>으로 전환할 것인가.
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
    <svg viewBox="0 0 600 300" style={{ position: 'absolute', right: 80, top: 150, width: 360, height: 200, opacity: 0.9 }}>
      <circle cx="80" cy="150" r="9" fill="#fff" />
      {[60, 240].map((y, i) => (
        <path key={i} d={`M 80 150 C 240 150, 320 ${y}, 500 ${y}`} fill="none"
          stroke={i === 0 ? 'rgba(255,255,255,0.4)' : ACCENT} strokeWidth="1.5" strokeDasharray="6 8"
          strokeDashoffset={(-t * 30 + i * 40) % 800} />
      ))}
      <circle cx="500" cy="60"  r="7"  fill="rgba(255,255,255,0.6)" />
      <circle cx="500" cy="240" r="9"  fill={ACCENT} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 12 — Recommendation
   ════════════════════════════════════════════════════════════════════════ */
function Slide12() {
  return (
    <AutoStage>
      <SlideShell variant={11} density={0.9} accent={1.5}>
        <SlideTag num={12} total={12} label="Recommendation" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1380 }}>
          <Eyebrow>권고</Eyebrow>
          <Headline size={64}>
            <span style={{ color: ACCENT }}>추진</span> · 단, 금융권 GitLab 운영<br/>
            고도화 솔루션으로 <span style={{ color: ACCENT }}>좁게 시작</span>
          </Headline>
        </div>
        <ForwardArrowMini />
        <div style={{ position: 'absolute', top: 450, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '180px 1.3fr 1.6fr', heads: ['권고', '내용', '근거'] }}
              rows={[
                ['추진 권고',          '자산 → 솔루션 승격 추진',          '코어 자산 확보, 시장 수요 검증됨'],
                ['GitLab-first',       '단일 SCM 기준 좁게 시작',          '경계 통제 · 첫 고객 제안 가능성 우선'],
                ['온프레미스 우선',    '구축형 · 망분리 환경 대응',        '금융권 진입 조건의 기준선'],
                ['PMS 옵션 분리',      'PMS는 코어가 아닌 옵션 모듈',      '코어 정의 흐림 방지'],
                ['고객사별 포크 금지', '설정팩 · 커넥터로 대응',           '반복 판매 구조 유지 핵심'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.5}>
            <div style={{
              marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '18px 24px', border: `1px solid ${ACCENT}`, borderRadius: 8, background: ACCENT_SOFT,
            }}>
              <span style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>Final Message</span>
              <span style={{ fontSize: 19, fontWeight: 600, color: '#fff' }}>
                대규모 신사업이 아니라 · <strong>이미 가진 자산의 전략적 승격</strong>
              </span>
            </div>
          </FadeUp>
        </div>
        <MainMsg>대규모 신사업 착수가 아니라 <strong>이미 가진 자산의 전략적 승격</strong> 과제.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ForwardArrowMini() {
  const t = useTime();
  const head = (t * 0.55) % 1;
  return (
    <svg viewBox="0 0 600 200" style={{ position: 'absolute', right: 80, top: 200, width: 380, height: 130, opacity: 0.95 }}>
      <line x1="40" y1="100" x2="560" y2="100" stroke="rgba(255,255,255,0.18)" />
      <line x1="40" y1="100" x2={40 + head * 520} y2="100" stroke={ACCENT} strokeWidth="2" />
      <polygon points={`${40 + head*520 - 14},90 ${40 + head*520},100 ${40 + head*520 - 14},110`} fill={ACCENT} />
      <circle cx="40" cy="100" r="6" fill="#fff" />
      <text x="40"  y="74" fill="rgba(255,255,255,0.6)" style={{ font: '700 11px ' + FONT, letterSpacing: '0.22em' }}>NOW</text>
      <text x="560" y="74" textAnchor="end" fill={ACCENT} style={{ font: '700 11px ' + FONT, letterSpacing: '0.22em' }}>FIRST DEAL</text>
    </svg>
  );
}

/* ───────── Mount ──────────────────────── */
const SLIDES = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10, Slide11, Slide12];
SLIDES.forEach((Comp, i) => {
  const mount = document.getElementById(`s${i + 1}`);
  if (mount) ReactDOM.createRoot(mount).render(<Comp />);
});

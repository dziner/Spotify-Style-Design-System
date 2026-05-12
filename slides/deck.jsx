// deck.jsx — SCM 솔루션화 Go/No-Go + 실행 방안 (20 slides)

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
function SlideTag({ num, total = 20, label }) {
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
      <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, whiteSpace: 'nowrap' }}>Main Message</span>
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
const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 18 }}>{children}</div>
);
const Headline = ({ children, size = 48 }) => (
  <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.02em', textWrap: 'balance', color: '#fff' }}>{children}</div>
);
const Lede = ({ children }) => (
  <div style={{ marginTop: 18, fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, maxWidth: 720 }}>{children}</div>
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
          padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.10)',
          fontSize: 15, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4,
        }}>
          {r.map((c, j) => <div key={j} style={j === 0 ? { fontWeight: 700, color: '#fff' } : {}}>{c}</div>)}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ── PART 1: 전략·WHY (Slides 01–12) ──────────────────────────────────
   ════════════════════════════════════════════════════════════════════════ */

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
    <div style={{ padding: 22, borderRadius: 10, border: `1px solid ${accent ? ACCENT : 'rgba(255,255,255,0.22)'}`, background: accent ? ACCENT_SOFT : 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: accent ? ACCENT : 'rgba(255,255,255,0.15)', color: accent ? '#000' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{kind}</span>
        <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent ? ACCENT : 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Option {kind}</span>
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

/* SLIDE 02 — Why This Matters Now */
function Slide02() {
  return (
    <AutoStage>
      <SlideShell variant={1} density={1.1}>
        <SlideTag num={2} label="Why This Matters Now" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>타이밍</Eyebrow>
          <Headline size={56}>
            지금 제품화하지 않으면<br/>
            <span style={{ color: ACCENT }}>코드 자산은 다시 흩어진다</span>
          </Headline>
          <Lede>기능·UI 자산은 이미 상당 수준으로 누적되어 있고, 금융권의 승인·감사·통제 요구는 계속 확대 중. 타이밍을 놓치면 코드는 다음 고객사 포크와 요구사항 대응물로 소모된다.</Lede>
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

/* SLIDE 03 — What We Already Own */
function Slide03() {
  return (
    <AutoStage>
      <SlideShell variant={2} density={0.7}>
        <SlideTag num={3} label="What We Already Own" />
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
            <div style={{ marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>
              {['Zero to One 아님', '재개발보다 제품화 정리', '이미 확보된 코어'].map((t, i) => (
                <span key={i} style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${ACCENT}`, color: ACCENT, background: ACCENT_SOFT }}>{t}</span>
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
      {Array.from({ length: cols * rows }).map((_, i) => {
        const cx = (i % cols) * 22 + 11, cy = Math.floor(i / cols) * 22 + 11;
        const phase = ((t * 0.3 + i * 0.04) % 3) / 3;
        const isAccent = (i * 13) % 17 < 5 && phase < 0.45;
        const a = isAccent ? 1 : 0.2 + Math.sin(phase * Math.PI) * 0.15;
        return <circle key={i} cx={cx} cy={cy} r={isAccent ? 2.4 : 1.4} fill={isAccent ? ACCENT : '#fff'} opacity={a} />;
      })}
    </svg>
  );
}

/* SLIDE 04 — What We Can Sell */
function Slide04() {
  return (
    <AutoStage>
      <SlideShell variant={3} density={1.2} accent={1.4}>
        <SlideTag num={4} label="What We Can Sell" />
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
          strokeWidth={i === 3 ? 2 : 1} strokeDasharray={i < 2 ? '2 6' : 'none'}
          transform={`rotate(${t * (i % 2 === 0 ? 12 : -8)} 300 300)`} />
      ))}
      <circle cx="300" cy="300" r="44" fill="rgba(30,215,96,0.12)" />
      <circle cx="300" cy="300" r="44" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <text x="300" y="306" textAnchor="middle" fill={ACCENT} style={{ font: `700 14px ${FONT}`, letterSpacing: '0.22em' }}>CORE</text>
    </svg>
  );
}

/* SLIDE 05 — Where The Market Is */
function Slide05() {
  return (
    <AutoStage>
      <SlideShell variant={4} density={1.0}>
        <SlideTag num={5} label="Where The Market Is" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>시장</Eyebrow>
          <Headline size={54}>
            은행 단독이 아니라<br/>
            <span style={{ color: ACCENT }}>금융권 3업권 동시 공략</span>
          </Headline>
          <Lede>제품 기준선은 가장 까다로운 <strong style={{ color: '#fff' }}>은행급 통제 수준</strong>으로 고정. 영업 시장은 그 기준을 만족할 수 있는 곳까지 넓게.</Lede>
        </div>
        <ThreeNodesMini />
        <div style={{ position: 'absolute', top: 500, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '110px 1.3fr 1.6fr 1.0fr 1.0fr', heads: ['업권', '공통 수요', '특이 요구', '예상 접근', '진입 난이도'] }}
              rows={[
                ['은행',  '승인·감사·권한 통제 · 폐쇄형 운영', '망분리 · 감독원 보고 요건',     '레퍼런스 기반 구축형', '높음 · 기준선'],
                ['증권',  '동일 통제 요구 · 거래 시스템 안정성', '체결·정산 시스템과의 분리',    '파일럿 → 단계 확대',   '중상'],
                ['보험',  '동일 통제 요구 · 장기 운영성',         '레거시 코어 연계 다수',        '레거시 통합형 제안',   '중'],
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
          <text x={n.x} y={n.y - 2} textAnchor="middle" fill="#fff" style={{ font: `700 18px ${FONT}` }}>{n.label}</text>
          <text x={n.x} y={n.y + 16} textAnchor="middle" fill={ACCENT} style={{ font: `700 9px ${FONT}`, letterSpacing: '0.22em' }}>{n.sub}</text>
        </g>
      ))}
    </svg>
  );
}

/* SLIDE 06 — Why Customers Will Care */
function Slide06() {
  return (
    <AutoStage>
      <SlideShell variant={5} density={0.9}>
        <SlideTag num={6} label="Why Customers Will Care" />
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
                ['승인·운영자 UX 부재',         'GitLab 단독은 개발자 중심 UX',  '운영자/승인자 통합 UX 제공'],
                ['승인 파이프라인 흐름 분산',   '도구별 파편화 · 추적 어려움',   '단일 흐름으로 통제 + 감사 로그'],
                ['망분리 · 온프레미스 강제',    'SaaS 종속 · 외부 의존 큼',       '온프레미스 / 프라이빗 클라우드 대응'],
                ['기존 체계와의 공존 요구',     '도입 시 기존 도구 대체 강요',    'Jira · 인증 · 메신저 공존 구조'],
                ['보안 감사 추적성',            '운영 로그 일관성 부족',           '감사 대응 표준 로그 · 권한 모델'],
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

/* SLIDE 07 — Productization Boundary */
function Slide07() {
  return (
    <AutoStage>
      <SlideShell variant={6} density={0.8}>
        <SlideTag num={7} label="Productization Boundary" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1280 }}>
          <Eyebrow>경계</Eyebrow>
          <Headline size={50}>
            성공은 기능 수가 아니라<br/>
            <span style={{ color: ACCENT }}>제품 경계 통제 역량</span>이 결정한다
          </Headline>
        </div>
        <div style={{ position: 'absolute', top: 380, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1.1fr 1.1fr 1fr', gap: 24 }}>
          <FadeUp delay={0.5}>
            <BoundaryCol tone="accent" head="INSIDE · 그대로 활용" items={['GitLab 형상관리 UI', 'MR · 브랜치 · 커밋 · 파이프라인 관리자', '운영자/승인자 워크플로']} />
          </FadeUp>
          <FadeUp delay={0.7}>
            <BoundaryCol tone="neutral" head="RE-WORK · 재정리 필요" items={['인증 · 권한 · SSO 분리', '브랜딩 · 디자인 토큰 추출', '외부 연동 커넥터 추상화']} />
          </FadeUp>
          <FadeUp delay={0.9}>
            <BoundaryCol tone="warn" head="RISK · 경계 침범 주의" items={['고객사별 포크 확대', '첫 고객 요구 = 로드맵 위험', '멀티 SCM 조기 확장 유혹']} />
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

/* SLIDE 08 — Commercial Logic */
function Slide08() {
  return (
    <AutoStage>
      <SlideShell variant={7} density={1.0}>
        <SlideTag num={8} label="Commercial Logic" />
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
                ['라이선스',  '코어 + 옵션 모듈',         '연 단위 갱신 · 옵션 추가 판매',        '반복 수익'],
                ['구축',      '온프레미스 도입 · 연동',   '레퍼런스 확보 · 후속 고객으로 확장',    '프로젝트성'],
                ['유지보수',  '연간 MA · 운영 지원',      '버전 업그레이드 · 보안 패치 동력',      '반복 수익'],
                ['고도화',    '맞춤 워크플로 · 설정팩',   '고객 성장에 비례하는 추가 매출',        '프로젝트성'],
                ['레퍼런스',  '금융권 확장 효과',         '한 고객 확보가 다음 고객을 부른다',      '간접 효과'],
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
      <text x="40"  y="180" fill="rgba(255,255,255,0.5)" style={{ font: `700 11px ${FONT}`, letterSpacing: '0.2em' }}>ONE-OFF</text>
      <text x="480" y="180" textAnchor="end" fill={ACCENT} style={{ font: `700 11px ${FONT}`, letterSpacing: '0.2em' }}>RECURRING</text>
    </svg>
  );
}

/* SLIDE 09 — Conditions To Win */
function Slide09() {
  return (
    <AutoStage>
      <SlideShell variant={8} density={0.8}>
        <SlideTag num={9} label="Conditions To Win" />
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
                ['C-01', 'Product Owner 지정',            '로드맵 표류 · 영업 메시지 부재',         '필수 · 0일차'],
                ['C-02', 'Tech Lead 지정',                '아키텍처 경계 붕괴 · 포크 확산',          '필수 · 0일차'],
                ['C-03', '인증·브랜딩·연동 분리 착수',   '재정리 비용이 매 고객마다 발생',          '필수 · 30일'],
                ['C-04', '제품화 원칙 내부 합의',         '의사결정 충돌 · 단건 구축으로 회귀',      '필수 · 30일'],
                ['C-05', '영업·프리세일즈 메시지 병행',  '제품만 있고 팔 줄 모르는 상태',           '핵심 · 60일'],
                ['C-06', '제품 운영 체계 (이슈·릴리스·QA)', '고객사별 핫픽스 누적',                '핵심 · 90일'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>조직적 준비 없는 추진은 솔루션 사업이 아니라 <strong>또 하나의 SI 프로젝트</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* SLIDE 10 — 6-Month Path To First Deal */
function Slide10() {
  return (
    <AutoStage>
      <SlideShell variant={9} density={0.7}>
        <SlideTag num={10} label="6-Month Path To First Deal" />
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
                ['M1',   '제품화 범위 확정',          '코어/옵션/커넥터/팩 경계 정의서',        '의사결정 통과'],
                ['M2',   '인증·브랜딩·연동 분리',    '추상화된 커넥터 인터페이스 v1',           '내부 데모'],
                ['M3',   'GitLab-first 코어 정비',   '레퍼런스 워크플로 + 운영자 UX 정리',     '내부 시연'],
                ['M4-5', '데모 · 파일럿 패키지',     '온프레미스 설치 패키지 + 시연 시나리오', '잠재 고객 데모'],
                ['M6',   '첫 금융권 제안 착수',      '제안서 · 견적 · POC 계획',                '제안 제출'],
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

/* SLIDE 11 — Decision Required */
function Slide11() {
  return (
    <AutoStage>
      <SlideShell variant={10} density={1.0}>
        <SlideTag num={11} label="Decision Required" />
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
                ['Q2', 'GitLab-first 전략을 유지할 것인가',      '멀티 SCM 고려',               'GitLab-first 유지'],
                ['Q3', '금융권 구축형 포지셔닝으로 갈 것인가',  '범용 DevOps 진입',             '금융권 구축형'],
                ['Q4', '초기 6개월 인력·시간을 투입할 것인가',  '대기 · 우선순위 하향',         '투입 · 1순위 과제'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.4}>
            <div style={{ marginTop: 26, padding: '20px 24px', border: `1px solid ${ACCENT}`, borderRadius: 8, background: ACCENT_SOFT, fontSize: 19, fontWeight: 600, lineHeight: 1.5 }}>
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
      <circle cx="500" cy="60"  r="7" fill="rgba(255,255,255,0.6)" />
      <circle cx="500" cy="240" r="9" fill={ACCENT} />
    </svg>
  );
}

/* SLIDE 12 — Recommendation */
function Slide12() {
  return (
    <AutoStage>
      <SlideShell variant={11} density={0.9} accent={1.5}>
        <SlideTag num={12} label="Recommendation" />
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
                ['추진 권고',          '자산 → 솔루션 승격 추진',         '코어 자산 확보, 시장 수요 검증됨'],
                ['GitLab-first',       '단일 SCM 기준 좁게 시작',         '경계 통제 · 첫 고객 제안 가능성 우선'],
                ['온프레미스 우선',    '구축형 · 망분리 환경 대응',       '금융권 진입 조건의 기준선'],
                ['PMS 옵션 분리',      'PMS는 코어가 아닌 옵션 모듈',     '코어 정의 흐림 방지'],
                ['고객사별 포크 금지', '설정팩 · 커넥터로 대응',          '반복 판매 구조 유지 핵심'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.5}>
            <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', border: `1px solid ${ACCENT}`, borderRadius: 8, background: ACCENT_SOFT }}>
              <span style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>Final Message</span>
              <span style={{ fontSize: 19, fontWeight: 600, color: '#fff' }}>대규모 신사업이 아니라 · <strong>이미 가진 자산의 전략적 승격</strong></span>
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
      <text x="40"  y="74" fill="rgba(255,255,255,0.6)" style={{ font: `700 11px ${FONT}`, letterSpacing: '0.22em' }}>NOW</text>
      <text x="560" y="74" textAnchor="end" fill={ACCENT} style={{ font: `700 11px ${FONT}`, letterSpacing: '0.22em' }}>FIRST DEAL</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ── PART 2: 실행 방안 (Slides 13–20) ─────────────────────────────────
   ════════════════════════════════════════════════════════════════════════ */

/* SLIDE 13 — 실행 방안 개요 */
function Slide13() {
  return (
    <AutoStage>
      <SlideShell variant={0} density={0.85}>
        <SlideTag num={13} label="실행 방안 개요" />
        <FourLayersMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1060 }}>
          <FadeUp delay={0.1}><Eyebrow>실행 전략</Eyebrow></FadeUp>
          <FadeUp delay={0.3}>
            <Headline size={58}>
              4개 영역 병렬 착수 ·<br/>
              <span style={{ color: ACCENT }}>의존성 기반 순차 통합</span>
            </Headline>
          </FadeUp>
          <FadeUp delay={0.6}>
            <Lede>
              아키텍처 설계, 디자인시스템 수립, 개발 리팩토링, 브랜딩 체계 —
              각 영역을 동시에 분석·정의하고 의존 관계 순서에 따라 통합·검증한다.
            </Lede>
          </FadeUp>
          <FadeUp delay={0.9}>
            <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 1120 }}>
              {[
                { tag: '01', sub: 'Architecture', label: '아키텍처', desc: '코어·옵션 레이어 분리 · 범용 IA 설계' },
                { tag: '02', sub: 'Design System', label: '디자인시스템', desc: '피그마 → 토큰 → 코드 핸드오버 파이프라인' },
                { tag: '03', sub: 'Dev / Refactor', label: '개발 리팩토링', desc: '범용화 · 데모 테넌트 · 커넥터 추상화' },
                { tag: '04', sub: 'Branding', label: '브랜딩', desc: '고객별 플랫폼 브랜드 자산화 · 차별화' },
              ].map((d, i) => (
                <DomainCard key={i} {...d} />
              ))}
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
    <div style={{ padding: '22px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: ACCENT_SOFT, border: `1px solid ${ACCENT}`, color: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{tag}</span>
        <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>{sub}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
function FourLayersMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 560 420" style={{ position: 'absolute', right: 60, top: 130, width: 420, height: 315, opacity: 0.7 }}>
      {[0, 1, 2, 3].map(i => {
        const y = 60 + i * 85;
        const pulse = 0.5 + Math.sin(t * 0.9 + i * 1.1) * 0.3;
        const isCore = i === 0;
        return (
          <g key={i}>
            <rect x={40 + i * 16} y={y} width={480 - i * 32} height={58} rx={8}
              fill={isCore ? `rgba(30,215,96,${0.08 + pulse * 0.06})` : 'rgba(255,255,255,0.03)'}
              stroke={isCore ? ACCENT : `rgba(255,255,255,${0.12 + i * 0.04})`}
              strokeWidth={isCore ? 1.5 : 1} />
            <text x={280} y={y + 34} textAnchor="middle"
              fill={isCore ? ACCENT : `rgba(255,255,255,${0.45 + i * 0.1})`}
              style={{ font: `700 13px ${FONT}`, letterSpacing: '0.22em' }}>
              {['CORE', 'MODULE', 'CONNECTOR', 'PACK'][i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* SLIDE 14 — 레이어 아키텍처 설계 */
function Slide14() {
  return (
    <AutoStage>
      <SlideShell variant={1} density={0.9}>
        <SlideTag num={14} label="레이어 아키텍처 설계" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>아키텍처</Eyebrow>
          <Headline size={52}>
            코어는 불변 · 옵션은 고객별 활성화 —<br/>
            <span style={{ color: ACCENT }}>4계층 분리 구조</span>
          </Headline>
          <Lede>솔루션의 핵심은 계층 경계 통제. 코어를 건드리지 않고 옵션·커넥터·팩 레이어에서만 고객화가 가능해야 반복 판매 구조가 성립한다.</Lede>
        </div>
        <CoreRingsMini />
        <div style={{ position: 'absolute', top: 490, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '110px 1.8fr 1.4fr 1.3fr', heads: ['계층', '핵심 구성 요소', '변경 가능 여부', '재사용 방식'] }}
              rows={[
                ['Core',      'GitLab 연동 엔진 · MR/브랜치/파이프라인 · 승인 워크플로 엔진 · 감사 로그', '불변 · 버전 관리', '모든 고객 공유'],
                ['Module',    '보안 정책 대시보드 · PMS 연동 · 리포팅 · 알림/메신저',                      '고객별 On/Off',    '기능 플래그 기반'],
                ['Connector', 'SSO/LDAP · Jira · BXM · eCAMS · 메신저',                                   '고객별 교체 가능', '어댑터 패턴'],
                ['Pack',      '브랜딩 토큰 · 메뉴 프리셋 · 워크플로 설정',                                '고객별 완전 커스텀', '설정 JSON'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>코어 불변 원칙이 지켜질 때만 <strong>반복 판매 구조와 유지보수 효율</strong>이 보장됨.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function CoreRingsMini() {
  const t = useTime();
  const radii = [52, 100, 148, 196];
  return (
    <svg viewBox="0 0 500 500" style={{ position: 'absolute', right: 60, top: 130, width: 340, height: 340, opacity: 0.8 }}>
      {radii.map((r, i) => (
        <circle key={i} cx="250" cy="250" r={r} fill="none"
          stroke={i === 0 ? ACCENT : `rgba(255,255,255,${0.18 - i * 0.02})`}
          strokeWidth={i === 0 ? 2 : 1} strokeDasharray={i > 1 ? '3 7' : 'none'}
          transform={`rotate(${t * (i % 2 === 0 ? 10 : -7) + i * 30} 250 250)`} />
      ))}
      {radii.map((r, i) => {
        const angle = (t * (i % 2 === 0 ? 15 : -10)) * Math.PI / 180;
        const cx = 250 + r * Math.cos(angle), cy = 250 + r * Math.sin(angle);
        return <circle key={'dot'+i} cx={cx} cy={cy} r={i === 0 ? 5 : 3.5}
          fill={i === 0 ? ACCENT : `rgba(255,255,255,${0.7 - i * 0.1})`} />;
      })}
      <circle cx="250" cy="250" r="32" fill="rgba(30,215,96,0.12)" />
      <circle cx="250" cy="250" r="32" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <text x="250" y="256" textAnchor="middle" fill={ACCENT}
        style={{ font: `700 12px ${FONT}`, letterSpacing: '0.2em' }}>CORE</text>
    </svg>
  );
}

/* SLIDE 15 — 범용 IA 설계 */
function Slide15() {
  return (
    <AutoStage>
      <SlideShell variant={2} density={0.8}>
        <SlideTag num={15} label="범용 IA 설계" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1200 }}>
          <Eyebrow>IA · 메뉴 구조</Eyebrow>
          <Headline size={52}>
            신한 특화 IA에서 <span style={{ color: ACCENT }}>범용 메뉴 풀</span>로 —<br/>
            고객이 서브셋을 선택·활성화
          </Headline>
        </div>
        <MenuDotsMini />
        <div style={{ position: 'absolute', top: 420, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.5}>
            <DataTable
              cols={{ template: '180px 2fr 0.9fr 1.1fr', heads: ['메뉴 카테고리', '포함 항목 (전체 풀)', '코어 포함', '고객 선택 적용'] }}
              rows={[
                ['형상관리',    'MR · 브랜치 · 커밋 · 태그 · 코드 비교 · 저장소 설정',               '전체 포함', '—'],
                ['파이프라인',  'CI/CD · 빌드 이력 · 배포 · 아티팩트 · 런너 관리',                  '전체 포함', '—'],
                ['보안 / 감사', '감사 로그 · 권한 관리 · 보안 스캔 · 정책 설정',                    '기본 포함',  '고급 모듈 선택'],
                ['승인 / 운영', '승인 라인 설정 · 결재 관리 · 환경별 배포 승인',                   '전체 포함', '—'],
                ['통합 연동',   'Jira · 메신저 · SSO · BXM · eCAMS · 쿠버네티스',                  '기본 연동', '고객별 선택'],
                ['관리 / 설정', '사용자 · 그룹 · 멤버 · 테넌트 설정 · 시스템',                     '기본 포함',  '확장 선택'],
              ]}
            />
          </FadeUp>
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
    <svg viewBox={`0 0 ${cols * 28} ${rows * 28}`} style={{ position: 'absolute', right: 88, top: 155, width: 240, height: 240, opacity: 0.85 }}>
      {Array.from({ length: cols * rows }).map((_, idx) => {
        const cx = (idx % cols) * 28 + 14, cy = Math.floor(idx / cols) * 28 + 14;
        const phase = ((t * 0.35 + idx * 0.07) % 4) / 4;
        const active = (idx * 7 + 3) % 11 < 5;
        const a = active ? 0.7 + Math.sin(phase * Math.PI * 2) * 0.25 : 0.15;
        return <circle key={idx} cx={cx} cy={cy} r={active ? 3.5 : 2} fill={active ? ACCENT : '#fff'} opacity={a} />;
      })}
    </svg>
  );
}

/* SLIDE 16 — 디자인시스템 결정 & 토큰 파이프라인 */
function Slide16() {
  return (
    <AutoStage>
      <SlideShell variant={3} density={1.0}>
        <SlideTag num={16} label="디자인시스템 결정" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>디자인시스템 · 토큰 파이프라인</Eyebrow>
          <Headline size={50}>
            Ant 안정화 vs 신규 구축 —<br/>
            <span style={{ color: ACCENT }}>피그마→토큰→코드</span> 핸드오버가 핵심 기준
          </Headline>
          <Lede>
            어느 방향이든 <strong style={{ color: '#fff' }}>Figma Variables → Style Dictionary → CSS 변수 → 고객 토큰 오버라이드</strong>
            파이프라인이 안정적으로 작동해야 솔루션화에 의미가 있다.
          </Lede>
        </div>
        <TokenFlowMini />
        <div style={{ position: 'absolute', top: 500, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '1.3fr 1.7fr 1.7fr 0.85fr', heads: ['평가 기준', 'A. Ant Design 안정화', 'B. 신규 디자인시스템 (AI 활용)', '권고'] }}
              rows={[
                ['초기 공수',       '낮음 · 빠른 착수',              '높음 · 초기 설계 투자 필수',        'A (단기)'],
                ['커스텀 자유도',   '제한 · Ant token 범위 내',     '완전 통제 · 인터랙션 자유',          'B (장기)'],
                ['관리 포인트',     '커스텀 즉시 폭증',              '체계적 · 토큰 단일 관리',            'B'],
                ['피그마 연동',     '부분 가능',                     '완전 연동 · Variables 활용',         'B'],
                ['브랜딩 대응',     '제한적',                        '고객별 토큰 오버라이드 완전 지원',   'B'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>단기 데모는 A, <strong>솔루션 장기 목표는 B</strong> — 병행 검증 후 M2에서 방향 확정.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function TokenFlowMini() {
  const t = useTime();
  const nodes = [{ x: 80, label: 'Figma' }, { x: 220, label: 'Token' }, { x: 360, label: 'Code' }, { x: 500, label: 'Brand' }];
  return (
    <svg viewBox="0 0 600 160" style={{ position: 'absolute', right: 72, top: 185, width: 400, height: 110, opacity: 0.9 }}>
      {nodes.map((n, i) => {
        if (i < nodes.length - 1) {
          const progress = ((t * 0.6 - i * 0.4) % 1 + 1) % 1;
          const px = n.x + (nodes[i + 1].x - n.x) * progress;
          return (
            <g key={'line'+i}>
              <line x1={n.x + 28} y1="80" x2={nodes[i+1].x - 28} y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <circle cx={px} cy="80" r="4" fill={ACCENT} opacity={0.8} />
            </g>
          );
        }
        return null;
      })}
      {nodes.map((n, i) => (
        <g key={'node'+i}>
          <circle cx={n.x} cy="80" r="26" fill="rgba(0,0,0,0.5)"
            stroke={i === nodes.length - 1 ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth={i === nodes.length - 1 ? 2 : 1} />
          <text x={n.x} y="76" textAnchor="middle" fill={i === nodes.length - 1 ? ACCENT : '#fff'}
            style={{ font: `700 10px ${FONT}`, letterSpacing: '0.12em' }}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* SLIDE 17 — 프론트엔드 리팩토링 */
function Slide17() {
  return (
    <AutoStage>
      <SlideShell variant={5} density={0.8}>
        <SlideTag num={17} label="프론트엔드 리팩토링" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>개발 · 리팩토링</Eyebrow>
          <Headline size={52}>
            신한 특화 코드를 걷어내고 —<br/>
            <span style={{ color: ACCENT }}>테넌트 중립 범용 구조</span>로 전환
          </Headline>
        </div>
        <CodeLinesMini />
        <div style={{ position: 'absolute', top: 400, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.5}>
            <DataTable
              cols={{ template: '130px 2.2fr 1.4fr 0.9fr', heads: ['작업 유형', '상세 항목', '방법', '우선순위'] }}
              rows={[
                ['제거',      '신한은행 하드코딩 레이블·텍스트 · 고객사 고유 데이터 구조 · 특화 워크플로 잔재', '일괄 탐색·치환',                '1순위'],
                ['추상화',    '인증 레이어 어댑터 분리 · 테넌트 설정 구조화 · 메뉴 설정 파일화',               '어댑터 패턴 · config JSON',      '1순위'],
                ['신규 추가', '기능 플래그 시스템 · 토큰 오버라이드 로더 · 다국어 키 확장',                   '런타임 설정 주입',               '2순위'],
                ['검증',      '범용 시나리오 E2E 동작 · 디자인 시스템 토큰 연동 검증',                        '스모크 테스트',                  '2순위'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.2}>
            <div style={{ marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}>
              {['테넌트 ID 기반 설정 주입', '메뉴 플래그 JSON', '인증 어댑터 인터페이스'].map((t, i) => (
                <span key={i} style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${ACCENT}`, color: ACCENT, background: ACCENT_SOFT }}>{t}</span>
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
  const lines = [{ w: 0.85, a: false }, { w: 0.55, a: false }, { w: 0.70, a: true }, { w: 0.40, a: false }, { w: 0.80, a: false }, { w: 0.60, a: true }, { w: 0.50, a: false }, { w: 0.75, a: false }];
  return (
    <svg viewBox="0 0 360 260" style={{ position: 'absolute', right: 80, top: 160, width: 300, height: 220, opacity: 0.75 }}>
      {lines.map((l, i) => {
        const pulse = 0.4 + Math.sin(t * 0.7 + i * 0.9) * 0.2;
        return <rect key={i} x="16" y={14 + i * 28} width={l.w * 320} height={14} rx={4}
          fill={l.a ? `rgba(30,215,96,${pulse})` : `rgba(255,255,255,${pulse * 0.5})`} />;
      })}
    </svg>
  );
}

/* SLIDE 18 — 데모 테넌트 & 핵심 기능 시나리오 */
function Slide18() {
  return (
    <AutoStage>
      <SlideShell variant={6} density={0.85}>
        <SlideTag num={18} label="데모 테넌트 & 핵심 기능" />
        <div style={{ position: 'absolute', top: 150, left: 88, right: 88 }}>
          <Eyebrow>데모 테넌트 · 시나리오</Eyebrow>
          <Headline size={48}>
            실 서비스처럼 보이되 최소 동작 —<br/>
            <span style={{ color: ACCENT }}>6개 핵심 기능</span>으로 금융권 설득
          </Headline>
        </div>
        <div style={{ position: 'absolute', top: 370, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <FadeUp delay={0.5}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 14 }}>테넌트 구성</div>
              <DataTable
                cols={{ template: '1.1fr 1.3fr 0.8fr', heads: ['구성 요소', '방식', '동작'] }}
                rows={[
                  ['GitLab CE', '실 인스턴스 자체 배포', '완전 실동작'],
                  ['인증 / 계정', '경량 OAuth stub', '역할 데모용'],
                  ['감사 / 보안 로그', '시드 + 실 이벤트', '조회·필터'],
                  ['금융 특화 메뉴', 'UI 셸 + 목 API', '구조·UX 시연'],
                  ['CI/CD', '경량 gitlab-ci.yml', '흐름 시연'],
                ]}
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.7}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 14 }}>핵심 기능 시나리오</div>
              <DataTable
                cols={{ template: '1.3fr 0.7fr', heads: ['기능', '시연 우선도'] }}
                rows={[
                  ['MR 생성 · 멀티 승인 · 머지',     '최우선'],
                  ['코드 리뷰 · 인라인 코멘트',       '최우선'],
                  ['CI/CD 파이프라인 · 승인 게이트',  '높음'],
                  ['감사 로그 · 권한 이력 조회',      '높음'],
                  ['운영자 · 승인자 역할별 UX',       '높음'],
                  ['커밋 히스토리 · 액티비티',        '중간'],
                ]}
              />
            </div>
          </FadeUp>
        </div>
        <MainMsg>데모 목표는 완전 구현이 아니라 <strong>의사결정자가 확신할 수 있는 시연</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* SLIDE 19 — 금융권 연동 · 다국어 · 브랜딩 */
function Slide19() {
  return (
    <AutoStage>
      <SlideShell variant={8} density={0.9} accent={1.3}>
        <SlideTag num={19} label="연동 · 다국어 · 브랜딩" />
        <div style={{ position: 'absolute', top: 150, left: 88, right: 88 }}>
          <Eyebrow>커넥터 · 글로벌 · 브랜딩 차별화</Eyebrow>
          <Headline size={48}>
            금융권 연동 수용 구조 ·
            <span style={{ color: ACCENT }}> 다국어 확장 · 브랜딩 강점</span>
          </Headline>
        </div>
        <div style={{ position: 'absolute', top: 370, left: 88, right: 88, display: 'grid', gridTemplateColumns: '1.1fr 0.75fr 0.85fr', gap: 24 }}>
          <FadeUp delay={0.4}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 14 }}>금융권 특화 연동</div>
              <DataTable
                cols={{ template: '1.1fr 1fr 0.7fr', heads: ['연동 대상', '방식', '단계'] }}
                rows={[
                  ['SSO / LDAP',       'OAuth2 / SAML 어댑터',            'M1'],
                  ['K8s / OpenShift',  'Helm chart · 네임스페이스',       'M1'],
                  ['사내 메신저',      'Webhook 어댑터',                   'M2'],
                  ['BXM (업무)',        'REST 어댑터 · 이벤트 훅',         'M3–4'],
                  ['eCAMS (컴플라)',   '감사로그 포워딩 · 정책 동기화',    'M3–4'],
                ]}
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.6}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 14 }}>다국어 확장</div>
              <DataTable
                cols={{ template: '0.8fr 1fr', heads: ['언어', '상태'] }}
                rows={[
                  ['KO', '완료 · 운영'],
                  ['EN', '완료 · 기준'],
                  ['JA', '번역팩 추가'],
                  ['ZH-CN', '번역팩 추가'],
                  ['기타', '수요 기반'],
                ]}
              />
            </div>
          </FadeUp>
          <FadeUp delay={0.8}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700, marginBottom: 14 }}>브랜딩 차별화</div>
              {[
                ['기능 납품 아님', '플랫폼 브랜드 자산 구축'],
                ['범용 UI 아님',   '고객 전용 디자인시스템'],
                ['코드 포크 아님', '토큰 오버라이드 교체'],
                ['UX 기능 중심 아님', '브랜드 경험 품질 중심'],
              ].map(([from, to], i) => (
                <div key={i} style={{
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 13, lineHeight: 1.45,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', fontSize: 12 }}>{from}</span>
                  <br />
                  <span style={{ color: '#fff', fontWeight: 600 }}>{to}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
        <MainMsg>커넥터 구조 + 다국어 기반 + 브랜딩 역량 — <strong>세 가지 모두 이미 자산으로 보유</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}

/* SLIDE 20 — 6개월 실행 로드맵 */
function Slide20() {
  return (
    <AutoStage>
      <SlideShell variant={11} density={0.85} accent={1.3}>
        <SlideTag num={20} label="6개월 실행 로드맵" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1400 }}>
          <Eyebrow>실행 로드맵</Eyebrow>
          <Headline size={50}>
            6개월 안에 <span style={{ color: ACCENT }}>첫 고객 제안 가능 상태</span>를 만드는<br/>
            단계별 실행 로드맵
          </Headline>
        </div>
        <RoadmapProgress />
        <div style={{ position: 'absolute', top: 510, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.8}>
            <DataTable
              cols={{ template: '120px 120px 2.2fr 1.1fr', heads: ['Phase', '기간', '핵심 작업 · 산출물', 'Gate'] }}
              rows={[
                ['P1 확정',   'M1',    '코어/옵션 경계 정의 · 범용 IA 설계 · 디자인시스템 방향 결정 · PO/TL 지정',      '내부 합의'],
                ['P2 기반',   'M1–M2', '프론트엔드 리팩토링 착수 · 디자인 토큰 셋업 · 인증 어댑터 분리 · K8s 기반',    '내부 데모'],
                ['P3 테넌트', 'M2–M3', 'GitLab CE 배포 · 핵심 6기능 실 동작 · 감사로그 시드 · 역할 기반 라우팅',       '내부 시연'],
                ['P4 디자인', 'M3–M4', '피그마↔토큰↔코드 파이프라인 완성 · 1호 브랜딩팩 · 다국어 확장',               '디자인 리뷰'],
                ['P5 데모',   'M4–M5', '전체 시나리오 완성 · 영업 데크·자료 · BXM/eCAMS 커넥터 프로토타입',           '잠재 고객 데모'],
                ['P6 제안',   'M6',    '1호 금융권 제안서 · 견적 · POC 계획서 · 파트너 채널 준비',                     '제안 제출'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>로드맵 평가 기준은 기능 수가 아니라 <strong>첫 고객 앞에서 설득 가능한 데모</strong>의 완성도.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function RoadmapProgress() {
  const t = useTime();
  const head = clamp((t - 1.2) / 5.0, 0, 1);
  const phases = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
  return (
    <div style={{ position: 'absolute', top: 370, left: 88, right: 88, maxWidth: 1740 }}>
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.12)', marginBottom: 20 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: 2, width: `${head * 100}%`, background: ACCENT }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {phases.map((p, i) => {
          const visible = head > i / 6;
          return (
            <div key={i} style={{ opacity: visible ? 1 : 0.3 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: visible ? ACCENT : 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: 13, letterSpacing: '0.2em', color: ACCENT, fontWeight: 700 }}>{p}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Mount ──────────────────────── */
const SLIDES = [
  Slide01, Slide02, Slide03, Slide04, Slide05, Slide06,
  Slide07, Slide08, Slide09, Slide10, Slide11, Slide12,
  Slide13, Slide14, Slide15, Slide16, Slide17, Slide18, Slide19, Slide20,
];
SLIDES.forEach((Comp, i) => {
  const mount = document.getElementById(`s${i + 1}`);
  if (mount) ReactDOM.createRoot(mount).render(<Comp />);
});

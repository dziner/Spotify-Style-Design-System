// deck.jsx — SCM 솔루션화 실행 방안 슬라이드 덱

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
  <div style={{ marginTop: 18, fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, maxWidth: 760 }}>
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
          padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.10)',
          fontSize: 15, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4,
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
   SLIDE 01 — 실행 방안 개요
   ════════════════════════════════════════════════════════════════════════ */
function Slide01() {
  return (
    <AutoStage>
      <SlideShell variant={0} density={0.9}>
        <SlideTag num={1} total={12} label="실행 방안 개요" />
        <FourLayersMini />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1060 }}>
          <FadeUp delay={0.1}><Eyebrow>실행 전략</Eyebrow></FadeUp>
          <FadeUp delay={0.3}>
            <Headline size={60}>
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
    <div style={{
      padding: '22px 20px', borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: ACCENT_SOFT, border: `1px solid ${ACCENT}`,
          color: ACCENT, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700,
        }}>{tag}</span>
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

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 02 — 레이어 아키텍처 설계
   ════════════════════════════════════════════════════════════════════════ */
function Slide02() {
  return (
    <AutoStage>
      <SlideShell variant={1} density={0.9}>
        <SlideTag num={2} total={12} label="레이어 아키텍처" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1100 }}>
          <Eyebrow>아키텍처</Eyebrow>
          <Headline size={54}>
            코어는 불변 · 옵션은 고객별 활성화 —<br/>
            <span style={{ color: ACCENT }}>4계층 분리 구조</span>
          </Headline>
          <Lede>
            솔루션의 핵심은 계층 경계 통제. 코어를 건드리지 않고
            옵션·커넥터·팩 레이어에서만 고객화가 가능해야 반복 판매 구조가 성립한다.
          </Lede>
        </div>
        <CoreRingsMini />
        <div style={{ position: 'absolute', top: 490, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '110px 1.8fr 1.4fr 1.3fr', heads: ['계층', '핵심 구성 요소', '변경 가능 여부', '재사용 방식'] }}
              rows={[
                ['Core', 'GitLab 연동 엔진 · MR/브랜치/파이프라인 · 승인 워크플로 엔진 · 감사 로그', '불변 · 버전 관리', '모든 고객 공유'],
                ['Module', '보안 정책 대시보드 · PMS 연동 · 리포팅 · 알림/메신저', '고객별 On/Off', '기능 플래그 기반'],
                ['Connector', 'SSO/LDAP · Jira · BXM · eCAMS · 메신저', '고객별 교체 가능', '어댑터 패턴'],
                ['Pack', '브랜딩 토큰 · 메뉴 프리셋 · 워크플로 설정', '고객별 완전 커스텀', '설정 JSON'],
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
  const labels = ['CORE', 'MODULE', 'CONNECTOR', 'PACK'];
  const radii = [52, 100, 148, 196];
  return (
    <svg viewBox="0 0 500 500" style={{ position: 'absolute', right: 60, top: 130, width: 340, height: 340, opacity: 0.8 }}>
      {radii.map((r, i) => (
        <circle key={i} cx="250" cy="250" r={r} fill="none"
          stroke={i === 0 ? ACCENT : `rgba(255,255,255,${0.18 - i * 0.02})`}
          strokeWidth={i === 0 ? 2 : 1}
          strokeDasharray={i > 1 ? '3 7' : 'none'}
          transform={`rotate(${t * (i % 2 === 0 ? 10 : -7) + i * 30} 250 250)`} />
      ))}
      {radii.map((r, i) => {
        const angle = (t * (i % 2 === 0 ? 15 : -10)) * Math.PI / 180;
        const cx = 250 + r * Math.cos(angle);
        const cy = 250 + r * Math.sin(angle);
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

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 03 — 범용 IA 설계
   ════════════════════════════════════════════════════════════════════════ */
function Slide03() {
  return (
    <AutoStage>
      <SlideShell variant={2} density={0.8}>
        <SlideTag num={3} total={12} label="범용 IA 설계" />
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
                ['형상관리', 'MR · 브랜치 · 커밋 · 태그 · 코드 비교 · 저장소 설정', '전체 포함', '—'],
                ['파이프라인', 'CI/CD · 빌드 이력 · 배포 · 아티팩트 · 런너 관리', '전체 포함', '—'],
                ['보안 / 감사', '감사 로그 · 권한 관리 · 보안 스캔 · 정책 설정', '기본 포함', '고급 모듈 선택'],
                ['승인 / 운영', '승인 라인 설정 · 결재 관리 · 환경별 배포 승인', '전체 포함', '—'],
                ['통합 연동', 'Jira · 메신저 · SSO · BXM · eCAMS · 쿠버네티스', '기본 연동', '고객별 선택'],
                ['관리 / 설정', '사용자 · 그룹 · 멤버 · 테넌트 설정 · 시스템', '기본 포함', '확장 선택'],
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
    <svg viewBox={`0 0 ${cols * 28} ${rows * 28}`} style={{
      position: 'absolute', right: 88, top: 155, width: 240, height: 240, opacity: 0.85,
    }}>
      {Array.from({ length: cols * rows }).map((_, idx) => {
        const cx = (idx % cols) * 28 + 14;
        const cy = Math.floor(idx / cols) * 28 + 14;
        const phase = ((t * 0.35 + idx * 0.07) % 4) / 4;
        const active = (idx * 7 + 3) % 11 < 5;
        const a = active ? 0.7 + Math.sin(phase * Math.PI * 2) * 0.25 : 0.15;
        return <circle key={idx} cx={cx} cy={cy} r={active ? 3.5 : 2}
          fill={active ? ACCENT : '#fff'} opacity={a} />;
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 04 — 디자인시스템 결정
   ════════════════════════════════════════════════════════════════════════ */
function Slide04() {
  return (
    <AutoStage>
      <SlideShell variant={3} density={1.0}>
        <SlideTag num={4} total={12} label="디자인시스템 결정" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1200 }}>
          <Eyebrow>디자인시스템</Eyebrow>
          <Headline size={52}>
            앤트 안정화 vs 신규 구축 —<br/>
            <span style={{ color: ACCENT }}>피그마 기반 토큰 파이프라인</span>이 핵심 기준
          </Headline>
          <Lede>
            어느 방향이든 <strong style={{ color: '#fff' }}>피그마 ↔ 토큰 ↔ 코드</strong> 핸드오버가 안정적으로 작동해야
            솔루션화에 의미가 있다. AI 활용 신규 구축 가능성을 병행 검증 중.
          </Lede>
        </div>
        <ForkChoiceMini />
        <div style={{ position: 'absolute', top: 500, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '1.4fr 1.8fr 1.8fr 1fr', heads: ['평가 기준', 'A. Ant Design 안정화', 'B. 신규 디자인시스템 (AI 활용)', '권고'] }}
              rows={[
                ['초기 공수', '낮음 · 빠른 착수 가능', '높음 · 초기 설계 투자 필수', 'A (단기)'],
                ['커스텀 자유도', '제한적 · Ant token 범위 내', '완전 통제 · 인터랙션 자유', 'B (장기)'],
                ['관리 포인트', '커스텀 즉시 폭증', '체계적 · 토큰 단일 관리', 'B'],
                ['피그마 연동', '부분 가능', '완전 연동 · Variables 활용', 'B'],
                ['브랜딩 대응', '제한적', '고객별 토큰 오버라이드 완전 지원', 'B'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>단기 데모는 A, <strong>솔루션 장기 목표는 B</strong> — 병행 검증 후 M2에서 방향 확정.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ForkChoiceMini() {
  const t = useTime();
  return (
    <svg viewBox="0 0 600 320" style={{ position: 'absolute', right: 72, top: 155, width: 360, height: 200, opacity: 0.9 }}>
      <circle cx="80" cy="160" r="9" fill="#fff" />
      {[70, 250].map((y, i) => (
        <path key={i} d={`M 80 160 C 240 160, 320 ${y}, 520 ${y}`} fill="none"
          stroke={i === 1 ? ACCENT : 'rgba(255,255,255,0.4)'} strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeDashoffset={(-t * 28 + i * 40) % 800} />
      ))}
      <text x="535" y="68" fill="rgba(255,255,255,0.6)" style={{ font: `600 13px ${FONT}` }}>A. Ant 안정화</text>
      <text x="535" y="258" fill={ACCENT} style={{ font: `700 13px ${FONT}` }}>B. 신규 구축</text>
      <circle cx="520" cy="70"  r="7" fill="rgba(255,255,255,0.5)" />
      <circle cx="520" cy="250" r="9" fill={ACCENT} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 05 — 피그마 → 토큰 → 코드 파이프라인
   ════════════════════════════════════════════════════════════════════════ */
function Slide05() {
  return (
    <AutoStage>
      <SlideShell variant={4} density={0.9}>
        <SlideTag num={5} total={12} label="디자인 → 코드 파이프라인" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>피그마 · 토큰 · 코드</Eyebrow>
          <Headline size={52}>
            피그마에서 고객사 브랜드 적용까지 —<br/>
            <span style={{ color: ACCENT }}>토큰이 전 단계를 연결</span>
          </Headline>
          <Lede>
            Figma Variables → Style Dictionary → CSS 변수 → 고객 토큰 오버라이드.
            코드 포크 없이 설정팩 교체만으로 브랜딩이 완성된다.
          </Lede>
        </div>
        <TokenFlowMini />
        <div style={{ position: 'absolute', top: 500, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '180px 1.6fr 1.6fr 1.0fr', heads: ['단계', '도구 / 방법', '산출물', '적용 범위'] }}
              rows={[
                ['① 피그마 설계', 'Figma Variables + Component · MCP 연동', '컴포넌트 라이브러리 · 토큰 정의서', '전체 UI'],
                ['② 토큰 추출', 'Style Dictionary / Token Transformer', 'tokens.json (색상·타이포·간격·반경)', '공통 토큰'],
                ['③ 코드 연결', 'CSS Variables · Tailwind config · 컴포넌트 props', '테마 파일 · 스타일 베이스라인', '프론트엔드'],
                ['④ 고객 적용', '테넌트별 토큰 오버라이드 JSON', '브랜딩 설정팩 · 화이트라벨', '고객별 배포'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.4}>
            <div style={{
              marginTop: 20, padding: '14px 20px', border: `1px solid ${ACCENT}`, borderRadius: 8,
              background: ACCENT_SOFT, fontSize: 16, color: 'rgba(255,255,255,0.85)',
            }}>
              <span style={{ color: ACCENT, fontWeight: 700, marginRight: 12 }}>핵심 원칙</span>
              피그마가 <strong style={{ color: '#fff' }}>단일 진실 소스(Single Source of Truth)</strong>가 되어야
              디자인·개발 핸드오버 비용이 0에 수렴한다.
            </div>
          </FadeUp>
        </div>
        <MainMsg>토큰 파이프라인이 안정화될 때 <strong>고객별 브랜딩이 설정 교체로 완성</strong>된다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function TokenFlowMini() {
  const t = useTime();
  const nodes = [
    { x: 80,  label: 'Figma' },
    { x: 220, label: 'Token' },
    { x: 360, label: 'Code' },
    { x: 500, label: 'Brand' },
  ];
  return (
    <svg viewBox="0 0 600 160" style={{ position: 'absolute', right: 72, top: 185, width: 400, height: 110, opacity: 0.9 }}>
      {nodes.map((n, i) => {
        if (i < nodes.length - 1) {
          const progress = ((t * 0.6 - i * 0.4) % 1 + 1) % 1;
          const dx = nodes[i + 1].x - n.x;
          const px = n.x + dx * progress;
          return (
            <g key={'line'+i}>
              <line x1={n.x + 28} y1="80" x2={nodes[i+1].x - 28} y2="80"
                stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <circle cx={px} cy="80" r="4" fill={ACCENT} opacity={0.8} />
            </g>
          );
        }
        return null;
      })}
      {nodes.map((n, i) => (
        <g key={'node'+i}>
          <circle cx={n.x} cy="80" r="26" fill="rgba(0,0,0,0.5)"
            stroke={i === nodes.length - 1 ? ACCENT : 'rgba(255,255,255,0.3)'}
            strokeWidth={i === nodes.length - 1 ? 2 : 1} />
          <text x={n.x} y="76" textAnchor="middle" fill={i === nodes.length - 1 ? ACCENT : '#fff'}
            style={{ font: `700 10px ${FONT}`, letterSpacing: '0.12em' }}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 06 — 프론트엔드 리팩토링
   ════════════════════════════════════════════════════════════════════════ */
function Slide06() {
  return (
    <AutoStage>
      <SlideShell variant={5} density={0.8}>
        <SlideTag num={6} total={12} label="프론트엔드 리팩토링" />
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
                ['제거', '신한은행 하드코딩 레이블·텍스트 · 고객사 고유 데이터 구조 · 특화 워크플로 잔재', '일괄 탐색·치환', '1순위'],
                ['추상화', '인증 레이어 어댑터 분리 · 테넌트 설정 구조화 · 메뉴 설정 파일화', '어댑터 패턴 · config JSON', '1순위'],
                ['신규 추가', '기능 플래그 시스템 · 토큰 오버라이드 로더 · 다국어 키 확장', '런타임 설정 주입', '2순위'],
                ['검증', '범용 시나리오 E2E 동작 · 디자인 시스템 토큰 연동 검증', '스모크 테스트', '2순위'],
              ]}
            />
          </FadeUp>
          <FadeUp delay={1.2}>
            <div style={{
              marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap',
              fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
            }}>
              {['테넌트 ID 기반 설정 주입', '메뉴 플래그 JSON', '인증 어댑터 인터페이스'].map((t, i) => (
                <span key={i} style={{
                  padding: '8px 16px', borderRadius: 999,
                  border: `1px solid ${ACCENT}`, color: ACCENT, background: ACCENT_SOFT,
                }}>{t}</span>
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
  const lines = [
    { w: 0.85, accent: false }, { w: 0.55, accent: false }, { w: 0.70, accent: true  },
    { w: 0.40, accent: false }, { w: 0.80, accent: false }, { w: 0.60, accent: true  },
    { w: 0.50, accent: false }, { w: 0.75, accent: false },
  ];
  return (
    <svg viewBox="0 0 360 260" style={{ position: 'absolute', right: 80, top: 160, width: 300, height: 220, opacity: 0.75 }}>
      {lines.map((l, i) => {
        const pulse = 0.4 + Math.sin(t * 0.7 + i * 0.9) * 0.2;
        return (
          <rect key={i} x="16" y={14 + i * 28} width={l.w * 320} height={14} rx={4}
            fill={l.accent ? `rgba(30,215,96,${pulse})` : `rgba(255,255,255,${pulse * 0.5})`} />
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 07 — 데모 테넌트 구성
   ════════════════════════════════════════════════════════════════════════ */
function Slide07() {
  return (
    <AutoStage>
      <SlideShell variant={6} density={0.85}>
        <SlideTag num={7} total={12} label="데모 테넌트 구성" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>데모 테넌트</Eyebrow>
          <Headline size={52}>
            실 서비스처럼 보이되 —<br/>
            <span style={{ color: ACCENT }}>핵심 기능만 최소 동작</span>
          </Headline>
          <Lede>
            모든 기능을 구현하는 것은 불필요하다. 핵심 기능은 실제 동작하고,
            금융권 특화 메뉴는 UI 셸과 목(Mock) API로 구조를 보여주는 것이 목표.
          </Lede>
        </div>
        <StackBoxMini />
        <div style={{ position: 'absolute', top: 510, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '220px 1.3fr 1.5fr 0.9fr', heads: ['구성 요소', '방식', '동작 범위', '비고'] }}
              rows={[
                ['GitLab 인스턴스 (CE)', '실 GitLab CE 자체 배포', 'MR · 커밋 · 파이프라인 · 코드리뷰 실 동작', '핵심 기능 실 구동'],
                ['인증 / 계정', '경량 OAuth stub + 역할 시드', '관리자·운영자·승인자 역할 데모', '실 SSO 불필요'],
                ['감사 / 보안 로그', '시드 데이터 + 실 GitLab 이벤트', '조회·필터·권한 이력 동작', '일부 목 데이터'],
                ['금융 특화 메뉴', 'UI 셸 구현 + 목 API 응답', '구조·UX·워크플로 시연', '실 연동 없음'],
                ['CI/CD 파이프라인', '경량 .gitlab-ci.yml 실 동작', '빌드·스테이지·배포 흐름 시연', '간소화 스크립트'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>데모 테넌트의 목표는 완전 구현이 아니라 <strong>의사결정자가 확신할 수 있는 시연</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function StackBoxMini() {
  const t = useTime();
  const layers = ['CI/CD', 'Auth', 'GitLab CE', 'Audit', 'UI Shell'];
  return (
    <svg viewBox="0 0 400 300" style={{ position: 'absolute', right: 72, top: 160, width: 320, height: 240, opacity: 0.8 }}>
      {layers.map((l, i) => {
        const y = 220 - i * 44;
        const glow = 0.06 + Math.sin(t * 0.8 + i * 0.7) * 0.03;
        const isCore = l === 'GitLab CE';
        return (
          <g key={i}>
            <rect x={30 + i * 8} y={y} width={340 - i * 16} height={34} rx={6}
              fill={isCore ? `rgba(30,215,96,${glow * 2.5})` : `rgba(255,255,255,${glow})`}
              stroke={isCore ? ACCENT : `rgba(255,255,255,${0.18 + i * 0.03})`}
              strokeWidth={isCore ? 1.5 : 1} />
            <text x="200" y={y + 22} textAnchor="middle"
              fill={isCore ? ACCENT : `rgba(255,255,255,0.65)`}
              style={{ font: `600 11px ${FONT}`, letterSpacing: '0.18em' }}>{l}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 08 — 핵심 기능 데모 시나리오
   ════════════════════════════════════════════════════════════════════════ */
function Slide08() {
  return (
    <AutoStage>
      <SlideShell variant={7} density={1.0}>
        <SlideTag num={8} total={12} label="핵심 기능 데모 시나리오" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>데모 시나리오</Eyebrow>
          <Headline size={50}>
            6개 핵심 기능으로 구성하는<br/>
            <span style={{ color: ACCENT }}>금융권 설득 데모 시나리오</span>
          </Headline>
        </div>
        <ScenarioHexMini />
        <div style={{ position: 'absolute', top: 430, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.6}>
            <DataTable
              cols={{ template: '220px 1.8fr 1.4fr 0.9fr', heads: ['핵심 기능', '시나리오', '기술 방식', '시연 우선도'] }}
              rows={[
                ['MR 생성 · 승인', '코드 변경 → MR 생성 → 멀티 승인 라인 → 머지', '실 GitLab MR API', '최우선'],
                ['코드 리뷰', '인라인 코멘트 · 스레드 · 변경 이력 · 승인 처리', '실 GitLab API', '최우선'],
                ['CI/CD 파이프라인', '빌드 → 스테이지 결과 → 승인 게이트 → 배포', '경량 .gitlab-ci.yml', '높음'],
                ['감사 / 보안 조회', '로그 필터 · 권한 이력 · 사용자 이벤트 타임라인', '시드 + 실 이벤트', '높음'],
                ['승인 워크플로', '운영자·승인자 역할별 화면·권한·결재 흐름', '역할 기반 라우팅', '높음'],
                ['히스토리 · 액티비티', '커밋 이력 · 저장소 변경 흐름 · 기여자 현황', '실 GitLab API', '중간'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>데모 순서는 <strong>MR → 코드리뷰 → 파이프라인 → 감사</strong> 순 — 금융권 관심 순서대로.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ScenarioHexMini() {
  const t = useTime();
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    pts.push([300 + Math.cos(a) * 140, 300 + Math.sin(a) * 140]);
  }
  return (
    <svg viewBox="0 0 600 600" style={{ position: 'absolute', right: 60, top: 130, width: 300, height: 300, opacity: 0.85 }}>
      <polygon points={pts.map(p => p.join(',')).join(' ')} fill="none"
        stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        transform={`rotate(${t * 6} 300 300)`} />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={14 + Math.sin(t * 1.1 + i) * 3}
            fill="none" stroke={i < 2 ? ACCENT : 'rgba(255,255,255,0.3)'} strokeWidth="1.5" />
          <circle cx={x} cy={y} r="6" fill={i < 2 ? ACCENT : 'rgba(255,255,255,0.4)'} />
        </g>
      ))}
      <circle cx="300" cy="300" r="5" fill={ACCENT} />
      {pts.map(([x, y], i) => (
        <line key={'line'+i} x1="300" y1="300" x2={x} y2={y}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 09 — 금융권 특화 연동 구조
   ════════════════════════════════════════════════════════════════════════ */
function Slide09() {
  return (
    <AutoStage>
      <SlideShell variant={8} density={0.9}>
        <SlideTag num={9} total={12} label="금융권 특화 연동" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>커넥터 레이어</Eyebrow>
          <Headline size={52}>
            커넥터 추상화로<br/>
            <span style={{ color: ACCENT }}>금융권 특화 연동을 수용</span>
          </Headline>
          <Lede>
            BXM · eCAMS · Kubernetes는 커넥터 레이어에서 어댑터 패턴으로 연결.
            코어를 건드리지 않고 고객사 인프라에 맞게 교체·추가할 수 있는 구조.
          </Lede>
        </div>
        <ConnectorHubMini />
        <div style={{ position: 'absolute', top: 530, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '200px 1.3fr 1.5fr 0.9fr', heads: ['연동 대상', '연동 방식', '적용 범위', '구현 단계'] }}
              rows={[
                ['SSO / LDAP', 'OAuth2 / SAML 어댑터', '전 인증 통합 · 역할 매핑', 'M1 필수'],
                ['사내 메신저 (Teams 등)', 'Webhook 어댑터 · 이벤트 구독', 'MR · 파이프라인 · 승인 알림', 'M2'],
                ['Kubernetes / OpenShift', 'Helm chart · 네임스페이스 격리', '배포 환경 표준화 · 멀티 테넌시', 'M1 기반'],
                ['BXM (은행 업무)', 'REST API 어댑터 · 이벤트 훅', '승인 연계 · 결재 흐름 통합', 'M3–M4'],
                ['eCAMS (컴플라이언스)', '감사 로그 포워딩 · 정책 동기화', '보안/컴플라이언스 메뉴 연동', 'M3–M4'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>커넥터 레이어가 분리되어야 <strong>첫 고객 이후 추가 연동 요청을 코어 손상 없이 수용</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function ConnectorHubMini() {
  const t = useTime();
  const spokes = [
    { label: 'SSO', angle: -60 },
    { label: 'K8s', angle: 0 },
    { label: 'BXM', angle: 60 },
    { label: 'eCAMS', angle: 120 },
    { label: 'Msg', angle: 180 },
  ];
  return (
    <svg viewBox="0 0 560 400" style={{ position: 'absolute', right: 60, top: 140, width: 380, height: 270, opacity: 0.85 }}>
      {spokes.map((s, i) => {
        const a = s.angle * Math.PI / 180;
        const r = 145;
        const x = 280 + Math.cos(a) * r;
        const y = 200 + Math.sin(a) * r;
        const pulse = ((t * 0.5 - i * 0.18) % 1 + 1) % 1;
        const px = 280 + Math.cos(a) * r * pulse;
        const py = 200 + Math.sin(a) * r * pulse;
        return (
          <g key={i}>
            <line x1="280" y1="200" x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <circle cx={px} cy={py} r="3.5" fill={ACCENT} opacity={0.8} />
            <circle cx={x} cy={y} r="22" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <text x={x} y={y + 5} textAnchor="middle" fill="rgba(255,255,255,0.7)"
              style={{ font: `700 10px ${FONT}`, letterSpacing: '0.1em' }}>{s.label}</text>
          </g>
        );
      })}
      <circle cx="280" cy="200" r="42" fill="rgba(30,215,96,0.1)" stroke={ACCENT} strokeWidth="1.5" />
      <text x="280" y="196" textAnchor="middle" fill={ACCENT}
        style={{ font: `700 11px ${FONT}`, letterSpacing: '0.18em' }}>CORE</text>
      <text x="280" y="212" textAnchor="middle" fill={ACCENT}
        style={{ font: `600 10px ${FONT}`, letterSpacing: '0.14em' }}>HUB</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 10 — 다국어 & 글로벌 확장
   ════════════════════════════════════════════════════════════════════════ */
function Slide10() {
  return (
    <AutoStage>
      <SlideShell variant={9} density={0.75}>
        <SlideTag num={10} total={12} label="다국어 · 글로벌 확장" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1300 }}>
          <Eyebrow>글로벌 확장</Eyebrow>
          <Headline size={52}>
            이미 확보한 다국어 기반을<br/>
            <span style={{ color: ACCENT }}>글로벌 전파 자산</span>으로 확장
          </Headline>
          <Lede>
            현재 KO/EN 구현 완료. i18n 키 구조가 이미 갖춰져 있어
            번역팩 추가만으로 신규 로케일 지원이 가능한 구조.
          </Lede>
        </div>
        <GlobalNodesMini />
        <div style={{ position: 'absolute', top: 530, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '200px 1.0fr 1.4fr 1.3fr', heads: ['언어', '현재 상태', '확장 계획', '대상'] }}
              rows={[
                ['한국어 (KO)', '완료 · 운영 중', '지속 유지 · 마스터 소스', '국내 고객사'],
                ['영어 (EN)', '완료 · 운영 중', '글로벌 기준 레이어 유지', '전 지역 공통'],
                ['일본어 (JA)', '미구현', 'i18n 키 기반 번역팩 추가', '일본 지사 / 고객사'],
                ['중국어 간체 (ZH-CN)', '미구현', '번역팩 + CJK 타이포 설정', '중화권'],
                ['추가 로케일', '수요 기반 결정', '번역팩 기여 구조로 확장 가능', '글로벌 거점'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>다국어 확장은 <strong>신규 개발이 아닌 번역팩 추가</strong>만으로 가능 — 기반은 이미 있다.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function GlobalNodesMini() {
  const t = useTime();
  const nodes = [
    { x: 300, y: 50,  label: 'KO', active: true  },
    { x: 520, y: 120, label: 'EN', active: true  },
    { x: 480, y: 320, label: 'JA', active: false },
    { x: 160, y: 300, label: 'ZH', active: false },
    { x: 100, y: 150, label: '…',  active: false },
  ];
  const edges = [[0,1],[0,3],[1,2],[1,4],[0,2]];
  return (
    <svg viewBox="0 0 640 400" style={{ position: 'absolute', right: 60, top: 140, width: 380, height: 240, opacity: 0.85 }}>
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(255,255,255,0.12)" strokeWidth="1"
          strokeDasharray={(!nodes[a].active || !nodes[b].active) ? '4 8' : 'none'} />
      ))}
      {nodes.map((n, i) => {
        const pulse = 1 + Math.sin(t * 1.2 + i * 0.9) * 0.12;
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={22 * pulse} fill="none"
              stroke={n.active ? 'rgba(30,215,96,0.25)' : 'rgba(255,255,255,0.08)'} />
            <circle cx={n.x} cy={n.y} r="18" fill="rgba(0,0,0,0.6)"
              stroke={n.active ? ACCENT : 'rgba(255,255,255,0.25)'} strokeWidth={n.active ? 2 : 1} />
            <text x={n.x} y={n.y + 5} textAnchor="middle"
              fill={n.active ? ACCENT : 'rgba(255,255,255,0.55)'}
              style={{ font: `700 11px ${FONT}` }}>{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 11 — 브랜딩 차별화
   ════════════════════════════════════════════════════════════════════════ */
function Slide11() {
  return (
    <AutoStage>
      <SlideShell variant={10} density={0.9} accent={1.4}>
        <SlideTag num={11} total={12} label="브랜딩 차별화" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1240 }}>
          <Eyebrow>브랜딩 컨설턴시 강점</Eyebrow>
          <Headline size={52}>
            기능 납품이 아니라 —<br/>
            <span style={{ color: ACCENT }}>고객사 플랫폼 브랜드 자산 구축</span>
          </Headline>
          <Lede>
            우리는 일반 개발사가 아니다. 브랜딩 컨설턴시로서 각 고객사에 특화된
            플랫폼 브랜드를 구축하는 역량이 타사 대비 핵심 차별화 포인트.
          </Lede>
        </div>
        <BrandTokenMini />
        <div style={{ position: 'absolute', top: 500, left: 88, right: 88, maxWidth: 1740 }}>
          <FadeUp delay={0.7}>
            <DataTable
              cols={{ template: '1.4fr 1.6fr 1.8fr', heads: ['차별화 포인트', '일반 개발사', '우리 (브랜딩 컨설턴시)'] }}
              rows={[
                ['제품 납품 방식', '기능 구현 후 인계', '플랫폼 브랜드 자산 구축 포함 납품'],
                ['디자인시스템', '범용 UI 라이브러리 적용', '고객 전용 피그마 디자인시스템 구축'],
                ['고객별 차별화', '코드 포크·커스텀 개발', '토큰 오버라이드 · 브랜드팩 교체'],
                ['UX 수준', '기능 중심 · 인터랙션 평이', '브랜드 경험 · 인터랙션 품질 중심'],
                ['영업 메시지', '기능 목록 · 스펙 시트 중심', '브랜드 + 경험 + 기능 통합 제안'],
              ]}
            />
          </FadeUp>
        </div>
        <MainMsg>브랜딩 역량은 <strong>솔루션 경쟁에서 타사가 복제할 수 없는 비코드 자산</strong>.</MainMsg>
      </SlideShell>
    </AutoStage>
  );
}
function BrandTokenMini() {
  const t = useTime();
  const colors = [ACCENT, '#4e9eff', '#ff6b6b', '#ffd166', '#a855f7'];
  return (
    <svg viewBox="0 0 560 300" style={{ position: 'absolute', right: 70, top: 160, width: 380, height: 210, opacity: 0.9 }}>
      {colors.map((c, i) => {
        const x = 50 + i * 90;
        const pulse = 0.85 + Math.sin(t * 0.9 + i * 0.7) * 0.1;
        return (
          <g key={i}>
            <circle cx={x} cy="80" r={32 * pulse}
              fill={c} opacity={i === 0 ? 0.9 : 0.55} />
            <rect x={x - 28} y="135" width="56" height="8" rx="4"
              fill="rgba(255,255,255,0.2)" />
            <rect x={x - 28} y="153" width="40" height="6" rx="3"
              fill="rgba(255,255,255,0.12)" />
          </g>
        );
      })}
      <text x="280" y="220" textAnchor="middle" fill="rgba(255,255,255,0.4)"
        style={{ font: `600 11px ${FONT}`, letterSpacing: '0.22em' }}>TOKEN OVERRIDE PER CLIENT</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SLIDE 12 — 6개월 실행 로드맵
   ════════════════════════════════════════════════════════════════════════ */
function Slide12() {
  return (
    <AutoStage>
      <SlideShell variant={11} density={0.85} accent={1.3}>
        <SlideTag num={12} total={12} label="6개월 실행 로드맵" />
        <div style={{ position: 'absolute', top: 150, left: 88, width: 1400 }}>
          <Eyebrow>로드맵</Eyebrow>
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
                ['P1 확정',  'M1',    '코어/옵션 경계 정의 · 범용 IA 설계 · 디자인시스템 방향 결정 · PO/TL 지정', '내부 합의'],
                ['P2 기반',  'M1–M2', '프론트엔드 리팩토링 착수 · 디자인 토큰 셋업 · 인증 어댑터 분리 · K8s 기반', '내부 데모'],
                ['P3 테넌트', 'M2–M3', 'GitLab CE 배포 · 핵심 6기능 실 동작 · 감사로그 시드 · 역할 기반 라우팅', '내부 시연'],
                ['P4 디자인', 'M3–M4', '피그마↔토큰↔코드 파이프라인 완성 · 1호 브랜딩팩 · 다국어 확장', '디자인 리뷰'],
                ['P5 데모',   'M4–M5', '전체 시나리오 완성 · 영업 데크·자료 · BXM/eCAMS 커넥터 프로토타입', '잠재 고객 데모'],
                ['P6 제안',   'M6',    '1호 금융권 제안서 · 견적 · POC 계획서 · 파트너 채널 준비', '제안 제출'],
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
            <div key={i} style={{ opacity: visible ? 1 : 0.3, transition: 'opacity 0.3s' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: visible ? ACCENT : 'rgba(255,255,255,0.3)',
                }} />
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
const SLIDES = [Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07, Slide08, Slide09, Slide10, Slide11, Slide12];
SLIDES.forEach((Comp, i) => {
  const mount = document.getElementById(`s${i + 1}`);
  if (mount) ReactDOM.createRoot(mount).render(<Comp />);
});

// shader-bg.jsx — WebGL fragment-shader background for slide deck.
// Each slide picks a `variant` (0–11). Same shader; per-variant parameters
// shift the motion, density, and intensity so each slide has its own mood.
//
// Palette: deep black base, white-on-low-alpha flow, sparing #1ed760 accent.
// Text overlays sit on top of a dimming gradient so they stay readable.

const SHADER_VS = `
  attribute vec2 a;
  void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const SHADER_FS = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_t;       // seconds
  uniform float u_var;     // variant index 0..11
  uniform float u_density; // motion density
  uniform float u_accent;  // 0..1 mix of accent
  uniform vec3  u_accCol;  // accent rgb

  // hash / noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<3;i++){ v += a*noise(p); p*=2.02; a*=0.5; }
    return v;
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
    float t = u_t * 0.08;

    // Per-variant base flow
    vec2 q = uv * (1.4 + u_density*0.5);
    q += vec2(sin(t + u_var)*0.6, cos(t*1.1 - u_var*0.3)*0.4);

    float n1 = fbm(q + fbm(q*1.7 + t));
    float n2 = fbm(q*2.3 - t*0.5);

    // soft flow field as scalar 0..1, very low energy
    float flow = smoothstep(0.35, 0.85, n1);
    flow *= 0.18 + 0.05*sin(t*2.0 + u_var);

    // thin ring isolines pull out structure
    float ring = abs(fract(n2*3.0 + t*0.3) - 0.5);
    ring = smoothstep(0.02, 0.0, ring) * 0.10;

    // accent "bloom" — rare bright pockets
    float bloom = smoothstep(0.78, 0.92, n1) * u_accent;

    // base color: deep black + white flow + sparing accent
    vec3 base = vec3(0.0);
    vec3 col  = base + vec3(flow + ring);
    col = mix(col, u_accCol, bloom);

    // strong vignette so center stays readable
    float r = length(uv);
    float vig = smoothstep(1.05, 0.25, r);
    col *= vig*0.55 + 0.35;

    // film grain (very low)
    float g = (hash(gl_FragCoord.xy + u_t) - 0.5) * 0.03;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderBG({ variant = 0, density = 1.0, accent = 1.0 }) {
  const canvasRef = React.useRef(null);
  const stateRef  = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
      }
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, SHADER_VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, SHADER_FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1, -1, 1,
      -1, 1,  1,-1,  1, 1,
    ]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u('u_res');
    const uT   = u('u_t');
    const uVar = u('u_var');
    const uDen = u('u_density');
    const uAcc = u('u_accent');
    const uAccCol = u('u_accCol');

    const state = { gl, prog, uRes, uT, uVar, uDen, uAcc, uAccCol, raf: null, t0: performance.now() };
    stateRef.current = state;

    const resize = () => {
      // DPR=1: shader backgrounds don't need retina resolution
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const FRAME_MS = 1000 / 24; // 24fps is enough for slow-moving backgrounds
    let lastFrame = 0;

    const draw = (ts) => {
      if (ts - lastFrame < FRAME_MS) { state.raf = requestAnimationFrame(draw); return; }
      lastFrame = ts;
      resize();
      const t = (performance.now() - state.t0) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uVar, variant);
      gl.uniform1f(uDen, density);
      gl.uniform1f(uAcc, accent);
      gl.uniform3f(uAccCol, 30/255, 215/255, 96/255); // #1ed760
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      state.raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!state.raf) state.raf = requestAnimationFrame(draw); };
    const stop  = () => { if (state.raf) { cancelAnimationFrame(state.raf); state.raf = null; } };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause when slide is not visible, resume when active
    const section = canvas.closest('section');
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

    return () => {
      stop();
      ro.disconnect();
      if (mo) mo.disconnect();
    };
  }, [variant, density, accent]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}

window.ShaderBG = ShaderBG;

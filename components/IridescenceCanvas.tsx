"use client";

import { useRef, useEffect } from "react";

export default function IridescenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    const uColorVal = [0.5, 0.1, 0.8];
    const uSpeedVal = 0.5;
    const uAmplitudeVal = 0.1;

    const vsSrc = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    const fsSrc = `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uResolution;
      uniform vec2 uMouse;
      uniform float uAmplitude;
      uniform float uSpeed;
      varying vec2 vUv;
      void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
        uv += (uMouse - vec2(0.5)) * uAmplitude;
        float d = -uTime * 0.5 * uSpeed;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += uTime * 0.5 * uSpeed;
        vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
        col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(vsSrc, gl.VERTEX_SHADER));
    gl.attachShader(prog, compile(fsSrc, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]),
      gl.STATIC_DRAW
    );

    const pLoc = gl.getAttribLocation(prog, "position");
    const uLoc = gl.getAttribLocation(prog, "uv");
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uLoc);
    gl.vertexAttribPointer(uLoc, 2, gl.FLOAT, false, 16, 8);

    const loc = {
      time: gl.getUniformLocation(prog, "uTime"),
      color: gl.getUniformLocation(prog, "uColor"),
      res: gl.getUniformLocation(prog, "uResolution"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      amp: gl.getUniformLocation(prog, "uAmplitude"),
      spd: gl.getUniformLocation(prog, "uSpeed"),
    };

    gl.uniform3f(loc.color, uColorVal[0], uColorVal[1], uColorVal[2]);
    gl.uniform2f(loc.mouse, 0.5, 0.5);
    gl.uniform1f(loc.amp, uAmplitudeVal);
    gl.uniform1f(loc.spd, uSpeedVal);

    function resize() {
      canvas!.width = container!.offsetWidth;
      canvas!.height = container!.offsetHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.uniform3f(loc.res, canvas!.width, canvas!.height, canvas!.width / canvas!.height);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    function render(t: number) {
      gl!.uniform1f(loc.time, t * 0.001);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

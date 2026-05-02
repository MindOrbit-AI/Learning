let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function beep(freq: number, durationMs: number, type: OscillatorType = "sine", gain = 0.08) {
  const c = ctx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + durationMs / 1000);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + durationMs / 1000);
}

export const arenaSounds = {
  resume() {
    void ctx()?.resume();
  },
  tap() {
    beep(880, 40, "square", 0.04);
  },
  correct() {
    beep(523, 60, "sine", 0.07);
    setTimeout(() => beep(784, 80, "sine", 0.06), 70);
  },
  wrong() {
    beep(180, 120, "sawtooth", 0.06);
  },
  attack() {
    beep(120, 40, "square", 0.12);
    setTimeout(() => beep(90, 100, "sawtooth", 0.08), 50);
  },
  win() {
    beep(392, 100, "sine", 0.07);
    setTimeout(() => beep(523, 100, "sine", 0.07), 100);
    setTimeout(() => beep(659, 180, "sine", 0.08), 200);
  },
  lose() {
    beep(220, 200, "triangle", 0.07);
  },
  powerUp() {
    beep(660, 50, "sine", 0.05);
    setTimeout(() => beep(990, 70, "sine", 0.06), 60);
  },
};

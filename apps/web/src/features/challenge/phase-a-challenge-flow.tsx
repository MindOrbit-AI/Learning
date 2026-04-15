"use client";

import {
  ArrowLeft,
  BarChart3,
  Brain,
  Check,
  Flag,
  Loader2,
  Mic,
  Palette,
  SkipForward,
  Timer,
  UserRound,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Step = "select" | "match" | "play";

type ChallengeKind =
  | "grammar"
  | "pronounce"
  | "blanks"
  | "speak"
  | "picture";

const CHALLENGES: {
  id: ChallengeKind;
  label: string;
  icon: typeof Brain;
  iconClass: string;
}[] = [
  { id: "grammar", label: "Fix That Grammar!", icon: Brain, iconClass: "text-pink-500" },
  { id: "pronounce", label: "Say It Like a Pro!", icon: Mic, iconClass: "text-[hsl(var(--duo-blue))]" },
  { id: "blanks", label: "Fill in the Blanks!", icon: BarChart3, iconClass: "text-violet-500" },
  { id: "speak", label: "Speak to Impress!", icon: UserRound, iconClass: "text-amber-600" },
  { id: "picture", label: "Spot That Picture!", icon: Palette, iconClass: "text-emerald-600" },
];

/** One playable question (Phase A: static pools; one is chosen at random per round). */
type PlayRoundContent = {
  title: string;
  context?: string;
  listenHint?: string;
  listen?: { utterance: string; lang: string; rate: number };
  pictureEmoji?: string;
  options: readonly string[];
  correct: string;
  successTail: string;
};

const LISTEN_HINT =
  "Tap the speaker — English word (demo uses speech synthesis)" as const;

const ROUNDS_BY_KIND: Record<ChallengeKind, PlayRoundContent[]> = {
  grammar: [
    {
      title: "Which sentence uses correct grammar?",
      options: [
        "Me and him went to the lab.",
        "He and I went to the lab.",
        "Him and I went to the lab.",
        "Me went with he to the lab.",
      ],
      correct: "He and I went to the lab.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence is correct?",
      options: [
        "Its time to review the chapter.",
        "It's time to review the chapter.",
        "Its' time to review the chapter.",
        "Its time' to review the chapter.",
      ],
      correct: "It's time to review the chapter.",
      successTail: "solid grammar",
    },
    {
      title: "Pick the best sentence.",
      options: [
        "Your going to love this unit.",
        "You're going to love this unit.",
        "Youre going to love this unit.",
        "Your'e going to love this unit.",
      ],
      correct: "You're going to love this unit.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence uses the right word?",
      options: [
        "The results will affect your grade.",
        "The results will effect your grade.",
        "The results will affects your grade.",
        "The results will effecting your grade.",
      ],
      correct: "The results will affect your grade.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence is written correctly?",
      options: [
        "She has fewer homework than last week.",
        "She has less homework than last week.",
        "She has fewer homeworks than last week.",
        "She has more less homework than last week.",
      ],
      correct: "She has less homework than last week.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence is correct?",
      options: [
        "Dont forget to show your work.",
        "Don't forget to show your work.",
        "Do'nt forget to show your work.",
        "Don't forget to show youre work.",
      ],
      correct: "Don't forget to show your work.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence is correct?",
      options: [
        "I'm going to lay down for a minute.",
        "I'm going to lie down for a minute.",
        "I'm going to lied down for a minute.",
        "I'm going to layed down for a minute.",
      ],
      correct: "I'm going to lie down for a minute.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence uses the right word?",
      options: [
        "She did good on the quiz.",
        "She did well on the quiz.",
        "She did goodly on the quiz.",
        "She did bestest on the quiz.",
      ],
      correct: "She did well on the quiz.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence is correct?",
      options: [
        "First, than we graph the line.",
        "First, then we graph the line.",
        "First, than we graph than line.",
        "First, then we graph than line.",
      ],
      correct: "First, then we graph the line.",
      successTail: "solid grammar",
    },
    {
      title: "Pick the best sentence.",
      options: [
        "The principal of the reaction is simple.",
        "The principle of the reaction is simple.",
        "The principale of the reaction is simple.",
        "The princple of the reaction is simple.",
      ],
      correct: "The principle of the reaction is simple.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence is correct?",
      options: [
        "Between you and I, the lab was easy.",
        "Between you and me, the lab was easy.",
        "Between you and myself, the lab was easy.",
        "Between we and you, the lab was easy.",
      ],
      correct: "Between you and me, the lab was easy.",
      successTail: "solid grammar",
    },
    {
      title: "Which sentence uses correct grammar?",
      options: [
        "There's fewer students here today.",
        "There are fewer students here today.",
        "There's less students here today.",
        "There are less students here today.",
      ],
      correct: "There are fewer students here today.",
      successTail: "solid grammar",
    },
  ],
  pronounce: [
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Thanks", lang: "en-US", rate: 0.9 },
      options: ["Hello", "Thanks", "Apple", "Cold"],
      correct: "Thanks",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Science", lang: "en-US", rate: 0.88 },
      options: ["Silence", "Sirens", "Science", "License"],
      correct: "Science",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Tuesday", lang: "en-US", rate: 0.88 },
      options: ["Thursday", "Tuesday", "Choose day", "News day"],
      correct: "Tuesday",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Quiet", lang: "en-US", rate: 0.88 },
      options: ["Quite", "Quit", "Quiet", "Queen"],
      correct: "Quiet",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Mountain", lang: "en-US", rate: 0.85 },
      options: ["Mention", "Mountain", "Counting", "Fountain"],
      correct: "Mountain",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Answer", lang: "en-US", rate: 0.88 },
      options: ["Anchor", "Antler", "Answer", "After"],
      correct: "Answer",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Practice", lang: "en-US", rate: 0.88 },
      options: ["Practice", "Practices", "Practical", "Praetors"],
      correct: "Practice",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Library", lang: "en-US", rate: 0.86 },
      options: ["Liberty", "Literary", "Library", "Livery"],
      correct: "Library",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "February", lang: "en-US", rate: 0.84 },
      options: ["January", "February", "Factory", "Very berry"],
      correct: "February",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Vegetable", lang: "en-US", rate: 0.86 },
      options: ["Vestibule", "Vegetable", "Venerable", "Venture"],
      correct: "Vegetable",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Chocolate", lang: "en-US", rate: 0.86 },
      options: ["Chalk lit", "Chocolate", "Chop stick", "Chose late"],
      correct: "Chocolate",
      successTail: "great ear",
    },
    {
      title: "What do you hear?",
      listenHint: LISTEN_HINT,
      listen: { utterance: "Surprise", lang: "en-US", rate: 0.88 },
      options: ["Surprise", "Supplies", "Supervise", "Surface"],
      correct: "Surprise",
      successTail: "great ear",
    },
  ],
  blanks: [
    {
      title: "Fill in the blank.",
      context: "Water _____ at 100°C at sea level.",
      options: ["boil", "boils", "boiling", "boiled"],
      correct: "boils",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "She _____ to school by bus every weekday.",
      options: ["walk", "walks", "walking", "walked"],
      correct: "walks",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "If I _____ you, I'd start the essay tonight.",
      options: ["was", "were", "am", "be"],
      correct: "were",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "The data _____ collected during the experiment.",
      options: ["were", "is", "was", "are"],
      correct: "was",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "Neither the coach nor the players _____ happy with the call.",
      options: ["was", "were", "is", "be"],
      correct: "were",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "Everyone in the group _____ a short presentation.",
      options: ["give", "gives", "giving", "given"],
      correct: "gives",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "Each of the experiments _____ repeated twice.",
      options: ["was", "were", "are", "be"],
      correct: "was",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "The committee _____ debating the proposal all afternoon.",
      options: ["was", "were", "are", "be"],
      correct: "was",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "Neither my notes nor my textbook _____ where I left them.",
      options: ["was", "were", "is", "be"],
      correct: "were",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "By next week, she _____ finished the research paper.",
      options: ["will have", "will has", "would of", "will had"],
      correct: "will have",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "The sun _____ in the east.",
      options: ["rise", "rises", "rising", "rose"],
      correct: "rises",
      successTail: "nailed it",
    },
    {
      title: "Fill in the blank.",
      context: "One of the answers _____ clearly wrong.",
      options: ["are", "were", "is", "be"],
      correct: "is",
      successTail: "nailed it",
    },
  ],
  speak: [
    {
      title: "What would you say first?",
      context: "You meet your teacher in the morning.",
      options: ["Hey, what's up?", "Good morning.", "Yo, teacher!", "See you later."],
      correct: "Good morning.",
      successTail: "natural choice",
    },
    {
      title: "What's the most polite reply?",
      context: "A classmate says they're sorry for bumping your desk.",
      options: ["Not cool.", "Watch it!", "No worries.", "Whatever."],
      correct: "No worries.",
      successTail: "natural choice",
    },
    {
      title: "What would you say first?",
      context: "You answer the phone when a relative calls.",
      options: ["Yeah?", "Who is this?", "Hello?", "What do you want?"],
      correct: "Hello?",
      successTail: "natural choice",
    },
    {
      title: "What's the best way to ask?",
      context: "You need one extra day for an assignment.",
      options: [
        "I need more time, okay?",
        "Could I possibly have a one-day extension?",
        "You have to give me more time.",
        "The due date is unfair.",
      ],
      correct: "Could I possibly have a one-day extension?",
      successTail: "natural choice",
    },
    {
      title: "What fits best?",
      context: "Your friend sneezes right beside you.",
      options: ["Excuse me?", "Bless you.", "Gross.", "Move."],
      correct: "Bless you.",
      successTail: "natural choice",
    },
    {
      title: "What would you say?",
      context: "You're leaving and want to sound friendly.",
      options: ["Leave me alone.", "Goodbye — have a good one!", "Finally.", "I'm out."],
      correct: "Goodbye — have a good one!",
      successTail: "natural choice",
    },
    {
      title: "What would you say?",
      context: "You're at a cafe counter and it's your turn.",
      options: ["Gimme a latte.", "Could I get a latte, please?", "Latte. Now.", "You owe me a latte."],
      correct: "Could I get a latte, please?",
      successTail: "natural choice",
    },
    {
      title: "What's the politest choice?",
      context: "You need the salt at a shared dinner table.",
      options: ["Pass the salt.", "Salt?", "Could you pass the salt, please?", "Hey, salt."],
      correct: "Could you pass the salt, please?",
      successTail: "natural choice",
    },
    {
      title: "What fits best?",
      context: "You need to interrupt two people who are talking.",
      options: [
        "Shut up for a second.",
        "Sorry to interrupt — quick question?",
        "Listen to me.",
        "You're both wrong.",
      ],
      correct: "Sorry to interrupt — quick question?",
      successTail: "natural choice",
    },
    {
      title: "What would you say first?",
      context: "Someone holds the door open for you.",
      options: ["Finally.", "Thanks!", "About time.", "Move."],
      correct: "Thanks!",
      successTail: "natural choice",
    },
    {
      title: "What's the best reply?",
      context: "A friend gives you a birthday gift.",
      options: ["You shouldn't have.", "This is mine now.", "What is this?", "Keep it."],
      correct: "You shouldn't have.",
      successTail: "natural choice",
    },
    {
      title: "What would you say?",
      context: "You're lost and see someone on the sidewalk.",
      options: [
        "Where am I?",
        "Excuse me — do you know how to get to the library?",
        "Follow me.",
        "Map.",
      ],
      correct: "Excuse me — do you know how to get to the library?",
      successTail: "natural choice",
    },
  ],
  picture: [
    {
      title: "What do you see?",
      pictureEmoji: "🚗",
      options: ["Car", "Bus", "Train", "Bicycle"],
      correct: "Car",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "🍎",
      options: ["Orange", "Apple", "Tomato", "Grape"],
      correct: "Apple",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "✈️",
      options: ["Helicopter", "Rocket", "Airplane", "Kite"],
      correct: "Airplane",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "🏠",
      options: ["Tent", "Castle", "House", "Igloo"],
      correct: "House",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "🐶",
      options: ["Cat", "Rabbit", "Dog", "Fox"],
      correct: "Dog",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "⚽",
      options: ["Basketball", "Tennis ball", "Soccer ball", "Baseball"],
      correct: "Soccer ball",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "🌳",
      options: ["Flower", "Tree", "Bush", "Grass"],
      correct: "Tree",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "🍕",
      options: ["Sandwich", "Burger", "Pizza", "Taco"],
      correct: "Pizza",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "☕",
      options: ["Tea", "Juice", "Coffee", "Soda"],
      correct: "Coffee",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "📚",
      options: ["Newspapers", "Books", "Folders", "Boxes"],
      correct: "Books",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "🎸",
      options: ["Violin", "Trumpet", "Guitar", "Piano"],
      correct: "Guitar",
      successTail: "sharp eyes",
    },
    {
      title: "What do you see?",
      pictureEmoji: "⛰️",
      options: ["Volcano", "Mountain", "Wave", "Desert"],
      correct: "Mountain",
      successTail: "sharp eyes",
    },
  ],
};

function fingerprintRound(r: PlayRoundContent): string {
  return [
    r.title,
    r.correct,
    r.context ?? "",
    r.pictureEmoji ?? "",
    r.listen?.utterance ?? "",
  ].join("\x1f");
}

/** Picks a random question; avoids an immediate repeat when the pool has more than one item. */
function pickRandomRound(kind: ChallengeKind, avoid?: PlayRoundContent | null): PlayRoundContent {
  const pool = ROUNDS_BY_KIND[kind];
  if (pool.length <= 1) return pool[0]!;
  const avoidFp = avoid ? fingerprintRound(avoid) : null;
  const others = avoidFp ? pool.filter((r) => fingerprintRound(r) !== avoidFp) : pool;
  const use = others.length > 0 ? others : pool;
  return use[Math.floor(Math.random() * use.length)]!;
}

function speakListen(listen: { utterance: string; lang: string; rate: number }) {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(listen.utterance);
  u.lang = listen.lang;
  u.rate = listen.rate;
  window.speechSynthesis.speak(u);
}

function PlayRoundView({
  round,
  primaryBtn,
  selected,
  setSelected,
  checked,
  setChecked,
  onPlayAgain,
  onChangeMode,
}: {
  round: PlayRoundContent;
  primaryBtn: string;
  selected: string | null;
  setSelected: (v: string | null) => void;
  checked: boolean;
  setChecked: (v: boolean) => void;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}) {
  const compactOptions = round.options.some((o) => o.length > 24);
  const isCorrect = selected === round.correct;

  return (
    <div className="relative pb-40 pt-6">
      <div className="mb-6 flex items-center justify-between gap-2 text-xs font-extrabold sm:text-sm">
        <span className="flex min-w-0 items-center gap-2 truncate text-[hsl(var(--duo-blue))]">
          <span className="truncate">You</span>
        </span>
        <span className="text-muted-foreground">vs</span>
        <span className="flex min-w-0 items-center gap-2 truncate text-amber-700">
          <span className="truncate">Alex M.</span>
        </span>
      </div>

      <div className="pointer-events-none absolute left-2 top-[4.5rem] bottom-40 w-0 border-l-2 border-dashed border-[hsl(var(--duo-gold))] sm:left-2.5" />
      <div className="pointer-events-none absolute right-2 top-[4.5rem] bottom-40 w-0 border-r-2 border-dashed border-[hsl(var(--duo-gold))] sm:right-2.5" />

      <div className="relative z-[1] px-6 sm:px-10 md:px-12">
        <p className="text-center text-lg font-extrabold text-foreground">{round.title}</p>
        {round.context && (
          <p className="mt-3 text-center text-base font-semibold leading-snug text-foreground">{round.context}</p>
        )}
        {round.pictureEmoji && (
          <div className="mt-6 flex justify-center" aria-hidden>
            <div className="flex h-36 w-36 items-center justify-center rounded-3xl border-[3px] border-border bg-card text-7xl shadow-inner">
              {round.pictureEmoji}
            </div>
          </div>
        )}

        {round.listen && (
          <>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (round.listen) speakListen(round.listen);
                }}
                className="flex h-24 w-24 items-center justify-center rounded-full border-b-[5px] border-[#2b6cb0] bg-[hsl(var(--duo-blue))] text-white shadow-lg transition hover:brightness-105 active:translate-y-0.5 active:border-b-[3px]"
                aria-label="Play audio"
              >
                <Volume2 className="h-10 w-10" strokeWidth={2.5} />
              </button>
            </div>
            {round.listenHint && (
              <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">{round.listenHint}</p>
            )}
          </>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          {round.options.map((opt, i) => {
            const isSel = selected === opt;
            return (
              <button
                key={`${i}-${opt}`}
                type="button"
                disabled={checked}
                onClick={() => !checked && setSelected(opt)}
                className={`rounded-2xl border-[3px] py-3 text-center font-extrabold shadow-sm transition sm:py-4 ${
                  compactOptions ? "text-sm leading-snug sm:text-base" : "text-lg"
                } ${
                  isSel
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted/80"
                } ${checked ? "opacity-90" : ""}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {checked && (
          <div className="mt-8 rounded-2xl border-2 border-primary/40 bg-primary/10 p-4 text-center">
            <p className="text-lg font-extrabold leading-snug text-foreground">
              {isCorrect
                ? `Correct — ${round.successTail}!`
                : `Not quite — the answer was “${round.correct}”.`}
            </p>
            <button type="button" onClick={onPlayAgain} className={`${primaryBtn} mt-6 border-[#43a005] bg-[#58cc02]`}>
              Play again
            </button>
            <button
              type="button"
              onClick={onChangeMode}
              className="mt-3 w-full text-center text-sm font-extrabold text-[hsl(var(--duo-blue))] underline-offset-2 hover:underline"
            >
              Change challenge type
            </button>
          </div>
        )}
      </div>

      {selected && !checked && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-primary/30 bg-primary/15 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg items-start gap-2">
            <p className="flex-1 text-sm font-bold text-foreground">
              Nice! Keep it up when you&apos;re ready to lock it in.
            </p>
            <button
              type="button"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Report"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
          <div className="mx-auto mt-4 flex max-w-lg gap-3">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-[3px] border-border bg-card text-sm font-extrabold uppercase tracking-wide text-foreground shadow-sm"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </button>
            <button
              type="button"
              onClick={() => setChecked(true)}
              className="inline-flex h-12 flex-[1.2] items-center justify-center rounded-2xl border-b-[4px] border-[#43a005] bg-[#58cc02] text-sm font-extrabold uppercase tracking-wide text-white shadow-sm"
            >
              <Check className="mr-2 h-4 w-4" />
              Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PhaseAChallengeFlow() {
  const [step, setStep] = useState<Step>("select");
  const [kind, setKind] = useState<ChallengeKind | null>(null);
  const [playRound, setPlayRound] = useState<PlayRoundContent | null>(null);
  const [matchProgress, setMatchProgress] = useState(0);
  const [matchReady, setMatchReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetPlay = useCallback(() => {
    setSelected(null);
    setChecked(false);
    setTimeLeft(45);
  }, []);

  useEffect(() => {
    if (step !== "match") return;
    setMatchProgress(0);
    setMatchReady(false);
    const start = performance.now();
    const duration = 2400;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setMatchProgress(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setMatchReady(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  useEffect(() => {
    if (step !== "play" || checked) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, checked]);

  const progressPct =
    step === "play"
      ? Math.min(100, ((45 - timeLeft) / 45) * 100)
      : step === "match"
        ? matchProgress
        : 0;

  const goMatch = () => {
    if (!kind) return;
    setPlayRound(null);
    setStep("match");
  };

  const goPlay = () => {
    if (!matchReady || !kind) return;
    setPlayRound(pickRandomRound(kind));
    resetPlay();
    setStep("play");
  };

  const changeChallengeMode = () => {
    setStep("select");
    setKind(null);
    setPlayRound(null);
    resetPlay();
  };

  const primaryBtn =
    "inline-flex h-14 w-full max-w-md items-center justify-center rounded-2xl border-b-[4px] px-6 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 active:translate-y-px active:border-b-[3px] disabled:pointer-events-none disabled:opacity-60 sm:text-base";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[hsl(47_100%_96%)] to-background pb-10 pt-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-16 top-24 h-64 w-64 rounded-full bg-[hsl(var(--duo-gold)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-20 right-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--duo-gold))] to-primary transition-[width] duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          {step === "play" && (
            <div className="flex shrink-0 items-center gap-1 rounded-full border-2 border-border bg-card px-2.5 py-1 text-sm font-extrabold tabular-nums text-foreground">
              <Timer className="h-4 w-4 text-[hsl(var(--duo-orange))]" />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        {step === "select" && (
          <div className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-[3px] border-primary/30 bg-primary/15 text-5xl shadow-inner"
                aria-hidden
              >
                🦉
              </div>
              <div className="rounded-2xl border-2 border-primary/25 bg-card px-4 py-3 shadow-sm">
                <p className="text-center text-base font-bold leading-snug text-foreground sm:text-left">
                  Hey there, word wizard! Ready to flex those brain muscles? Pick your battle!
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {CHALLENGES.map((c) => {
                const Icon = c.icon;
                const active = kind === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setKind(c.id)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-[3px] px-4 py-4 text-left shadow-sm transition ${
                        active
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-muted/80"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-background ${c.iconClass}`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={2.5} />
                      </span>
                      <span className="text-base font-extrabold text-foreground">{c.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                disabled={!kind}
                onClick={goMatch}
                className={`${primaryBtn} border-[#43a005] bg-[#58cc02] disabled:grayscale`}
              >
                Let&apos;s get started
              </button>
            </div>
          </div>
        )}

        {step === "match" && (
          <div className="pt-8 text-center">
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
              Buckle up! We&apos;ve found you a worthy opponent!
            </h1>
            <div className="mx-auto mt-8 flex h-28 w-28 items-center justify-center text-7xl" aria-hidden>
              🦉
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--duo-blue)_/_0.15)] text-2xl font-extrabold text-[hsl(var(--duo-blue))]">
                  You
                </div>
                <p className="mt-3 truncate text-sm font-extrabold text-foreground">You</p>
                <p className="text-xs font-bold text-muted-foreground">Level 12</p>
                <p className="mt-1 text-lg" aria-hidden>
                  🇬🇧
                </p>
              </div>
              <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-2xl">
                  🤖
                </div>
                <p className="mt-3 truncate text-sm font-extrabold text-foreground">Alex M.</p>
                <p className="text-xs font-bold text-muted-foreground">Level 11</p>
                <p className="mt-1 text-lg" aria-hidden>
                  🇨🇦
                </p>
              </div>
            </div>

            <div className="mt-10">
              {!matchReady && (
                <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pairing players…
                </p>
              )}
              <button
                type="button"
                disabled={!matchReady}
                onClick={goPlay}
                className={`${primaryBtn} border-b-[4px] ${
                  matchReady
                    ? "border-[#43a005] bg-[#58cc02]"
                    : "border-neutral-300 bg-neutral-200 text-neutral-500"
                }`}
              >
                Let the games begin!
              </button>
            </div>
          </div>
        )}

        {step === "play" && kind && playRound && (
          <PlayRoundView
            round={playRound}
            primaryBtn={primaryBtn}
            selected={selected}
            setSelected={setSelected}
            checked={checked}
            setChecked={setChecked}
            onPlayAgain={() => {
              if (!kind) return;
              resetPlay();
              setPlayRound((prev) => pickRandomRound(kind, prev));
            }}
            onChangeMode={changeChallengeMode}
          />
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion";

// ──────────────────────────────────────────────
// DATA: SCRIPT & DIALOGUE
// ──────────────────────────────────────────────
const STAGES = {
  INTRO: "intro",
  NODE1: "node1",
  NODE1_BRANCH: "node1_branch",
  NODE2: "node2",
  NODE2_BRANCH: "node2_branch",
  NODE3: "node3",
  NODE4: "node4",
  NODE5: "node5",
  COMPLETE: "complete",
};

const DIALOGUE = {
  node1: {
    tianGong: [
      "⚠️ 轴向受力检测异常，偏差率 47%",
      "警告：穿枋速度过快，榫头结合度不足",
      "✓ 轴向对齐完成，受力均匀，结构稳定",
    ],
    yeShi: [
      "心不稳，木则涩！做人要方正！",
      "急什么！祖师爷说过，慢工出细活！",
      "嗯……有点像样了。记住：正心，方能正木。",
    ],
  },
  node2: {
    tianGong: "斗拱单元激活中……重量分散矢量计算完毕，荷载效率提升 340%",
    yeShi: "看见了吗？力，不是死扛的，要四散分流——人也一样，遇事要懂得借力。",
  },
  node3: {
    tianGong: "节拍锁定中……量子共振频率 432Hz",
    yeShi_chant: [
      "嘿——哟！大梁起！",
      "嘿——哟！百年基！",
      "嘿——哟！千人行！",
    ],
    complete: "百人齐呼的回音，穿越三百年时光，仍在此刻震颤。",
  },
  node4: {
    tianGong: "木材纹理顺应风向，可降低 30% 风阻。最优角度：0°（垂直天枢）",
    yeShi: "这叫顺应天时，天人合一。木有木的性子，人要懂得顺势而为。",
  },
  node5: {
    tianGong: "锁位键就位。推入鲁班锁——触发最终构架固化程序。",
    yeShi: "孩子，这最后一键，是整座桥的魂。轻着点，稳着点……",
    complete: "一声悠长的钟鸣，穿透数据洪流——",
  },
};

// ──────────────────────────────────────────────
// SUB-COMPONENTS
// ──────────────────────────────────────────────

// HUD Bar at top
function HUD({ stability }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between"
      style={{ background: "rgba(8,15,30,0.92)", borderBottom: "1px solid rgba(56,189,248,0.3)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <span className="text-sky-300 text-xs tracking-[0.3em] font-mono">天工量子演算系统 · TIANWORK OS v2.3</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-amber-400 text-xs font-mono tracking-widest">架构稳定度</span>
        <div className="w-48 h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(251,191,36,0.4)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #b45309, #f59e0b, #fde68a)" }}
            animate={{ width: `${stability}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <motion.span
          key={stability}
          initial={{ scale: 1.4, color: "#fde68a" }}
          animate={{ scale: 1, color: "#f59e0b" }}
          className="text-amber-500 text-sm font-mono font-bold w-10 text-right"
        >
          {stability}%
        </motion.span>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-slate-500 text-xs font-mono">第二幕·构影篇</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>
    </div>
  );
}

// Cyber grid background
function CyberGrid() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep background */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, #0a1628 0%, #020a18 100%)" }} />
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0ea5e9" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid2" width="300" height="300" patternUnits="userSpaceOnUse">
            <path d="M 300 0 L 0 0 0 300" fill="none" stroke="#f59e0b" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#grid2)" opacity="0.5" />
      </svg>
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${(i * 8.3 + 5)}%`,
            background: i % 2 === 0 ? "#38bdf8" : "#f59e0b",
            boxShadow: i % 2 === 0 ? "0 0 8px #38bdf8" : "0 0 8px #f59e0b",
          }}
          animate={{ y: [0, -120, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
      {/* Diagonal accent lines */}
      <div className="absolute inset-0 opacity-10"
        style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(56,189,248,0.1) 80px, rgba(56,189,248,0.1) 81px)" }} />
    </div>
  );
}

// Dialogue Box
function DialogueBox({ speaker, text, variant = "tianGong" }) {
  const isTian = variant === "tianGong";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-3 mb-2"
      style={{
        background: isTian ? "rgba(8,25,50,0.85)" : "rgba(30,20,5,0.85)",
        border: isTian ? "1px solid rgba(56,189,248,0.6)" : "1px solid rgba(245,158,11,0.6)",
        backdropFilter: "blur(12px)",
        boxShadow: isTian ? "0 0 15px rgba(56,189,248,0.15), inset 0 0 20px rgba(56,189,248,0.05)"
          : "0 0 15px rgba(245,158,11,0.15), inset 0 0 20px rgba(245,158,11,0.05)",
      }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: isTian ? "#38bdf8" : "#f59e0b", boxShadow: `0 0 6px ${isTian ? "#38bdf8" : "#f59e0b"}` }} />
        <span className="text-xs font-mono tracking-widest" style={{ color: isTian ? "#7dd3fc" : "#fcd34d" }}>
          {isTian ? "【天工·AI】" : "【叶师傅·幻影】"}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: isTian ? "#bae6fd" : "#fde68a", fontFamily: "'Noto Serif SC', serif" }}>
        {text}
      </p>
    </motion.div>
  );
}

// Stage Title Banner
function StageBanner({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="inline-block relative">
        <div className="absolute -inset-3 rounded-lg opacity-30" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(56,189,248,0.3))", filter: "blur(8px)" }} />
        <h2 className="relative text-3xl font-bold tracking-[0.2em]"
          style={{ color: "#fde68a", textShadow: "0 0 20px rgba(245,158,11,0.8), 0 0 40px rgba(245,158,11,0.4)", fontFamily: "'Noto Serif SC', serif" }}>
          {title}
        </h2>
        <p className="text-sky-400 text-sm tracking-[0.3em] mt-1 font-mono">{subtitle}</p>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// NODE 1: 穿枋·守正
// ──────────────────────────────────────────────
function Node1({ onComplete, onStabilityChange }) {
  const x = useMotionValue(0);
  const [phase, setPhase] = useState("idle"); // idle | dragging | warning | success
  const [dialogIdx, setDialogIdx] = useState(0);
  const [showBranch, setShowBranch] = useState(false);
  const [branchDone, setBranchDone] = useState(false);
  const constraintsRef = useRef(null);

  const targetCenter = 0;
  const tolerance = 40;

  const handleDragEnd = useCallback(() => {
    const val = x.get();
    const speed = Math.abs(val);
    if (Math.abs(val - targetCenter) < tolerance) {
      setPhase("success");
      setDialogIdx(2);
      setTimeout(() => setShowBranch(true), 1200);
    } else {
      setPhase("warning");
      setDialogIdx(speed > 80 ? 1 : 0);
      setTimeout(() => setPhase("idle"), 1500);
    }
  }, [x]);

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <StageBanner title="穿枋·守正" subtitle="NODE 01 · PILLAR THREADING" />

      {/* The pillar with hole */}
      <div ref={constraintsRef} className="relative w-full h-48 flex items-center justify-center mb-6">
        {/* Pillar */}
        <div className="absolute w-20 h-40 rounded-sm flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, #92400e, #451a03)", border: "2px solid rgba(245,158,11,0.6)", boxShadow: "0 0 20px rgba(245,158,11,0.2)" }}>
          {/* Hole */}
          <div className="w-32 h-8 rounded-sm flex items-center justify-center"
            style={{ background: "rgba(2,6,23,0.9)", border: phase === "success" ? "2px solid rgba(56,189,248,0.9)" : "2px solid rgba(56,189,248,0.3)", boxShadow: phase === "success" ? "0 0 20px rgba(56,189,248,0.6)" : "none", transition: "all 0.5s" }}>
            {/* Guide line */}
            <div className="w-full h-0.5 opacity-40" style={{ background: "linear-gradient(90deg, transparent, #38bdf8, transparent)" }} />
          </div>
        </div>

        {/* Draggable beam */}
        <motion.div
          drag={phase !== "success" ? "x" : false}
          dragConstraints={{ left: -160, right: 160 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="absolute h-8 rounded cursor-grab active:cursor-grabbing z-10"
          animate={phase === "warning" ? { x: [x.get(), x.get() + 8, x.get() - 8, x.get()], borderColor: ["rgba(245,158,11,0.6)", "rgba(239,68,68,1)", "rgba(239,68,68,1)", "rgba(245,158,11,0.6)"] } : {}}
          transition={phase === "warning" ? { duration: 0.3 } : {}}
          style={{
            x,
            width: "200px",
            background: phase === "success" ? "linear-gradient(90deg, #b45309, #fde68a, #b45309)" : "linear-gradient(90deg, #78350f, #d97706, #78350f)",
            border: `2px solid ${phase === "success" ? "rgba(253,230,138,0.9)" : "rgba(245,158,11,0.6)"}`,
            boxShadow: phase === "success" ? "0 0 25px rgba(253,230,138,0.8)" : "0 0 10px rgba(245,158,11,0.3)",
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-amber-100 text-xs font-mono tracking-widest">— 穿 枋 —</span>
          </div>
        </motion.div>

        {/* Warning flash */}
        <AnimatePresence>
          {phase === "warning" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }} exit={{ opacity: 0 }} className="absolute inset-0 rounded"
              style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)" }} />
          )}
        </AnimatePresence>
      </div>

      <p className="text-slate-400 text-xs font-mono mb-4 tracking-widest">← 拖动穿枋穿过柱孔，保持水平对齐 →</p>

      {/* Dialogues */}
      <div className="w-full space-y-2">
        <AnimatePresence mode="wait">
          {phase !== "idle" && (
            <DialogueBox key={`tian-${dialogIdx}`} speaker="tianGong" text={DIALOGUE.node1.tianGong[dialogIdx]} variant="tianGong" />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {phase !== "idle" && (
            <DialogueBox key={`ye-${dialogIdx}`} speaker="yeShi" text={DIALOGUE.node1.yeShi[dialogIdx]} variant="yeShi" />
          )}
        </AnimatePresence>
      </div>

      {/* Branch Button */}
      <AnimatePresence>
        {showBranch && !branchDone && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setBranchDone(true);
              onStabilityChange(15);
              setTimeout(() => onComplete(), 1500);
            }}
            className="mt-4 px-6 py-2 rounded text-sm font-mono tracking-widest"
            style={{ background: "rgba(30,20,5,0.8)", border: "1px solid rgba(245,158,11,0.7)", color: "#fde68a", boxShadow: "0 0 15px rgba(245,158,11,0.3)" }}
            whileHover={{ boxShadow: "0 0 25px rgba(245,158,11,0.6)" }}
          >
            📜 翻阅《造桥账本》（支线）
          </motion.button>
        )}
        {branchDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
            <DialogueBox speaker="yeShi" text="你小子，懂得敬畏百姓的力气。这账本里，每一文钱都是汗水铸就。" variant="yeShi" />
            <p className="text-emerald-400 text-xs font-mono mt-2">✓ 稳定度 +15%　正在进入节点二……</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct continue if branch not available */}
      <AnimatePresence>
        {phase === "success" && !showBranch && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => onComplete()}
            className="mt-4 px-6 py-2 rounded text-sky-300 text-sm font-mono"
            style={{ border: "1px solid rgba(56,189,248,0.4)" }}>
            继续 →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// NODE 2: 斗拱·化劲
// ──────────────────────────────────────────────
const DOUGONG_PIECES = [
  { id: "sheng1", label: "升", color: "#92400e" },
  { id: "gong1", label: "拱", color: "#78350f" },
  { id: "sheng2", label: "升", color: "#b45309" },
];

function Node2({ onComplete, onStabilityChange }) {
  const [stacked, setStacked] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [showBranch, setShowBranch] = useState(false);
  const [branchDone, setBranchDone] = useState(false);

  const handleClick = (piece) => {
    if (stacked.find(s => s.id === piece.id)) return;
    if (stacked.length !== DOUGONG_PIECES.indexOf(piece)) return;
    setStacked(prev => [...prev, piece]);
    if (stacked.length === 2) {
      // All 3 stacked
      setRipples([1, 2, 3]);
      setTimeout(() => setShowBranch(true), 1800);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <StageBanner title="斗拱·化劲" subtitle="NODE 02 · BRACKET STACKING" />

      {/* Stacking area */}
      <div className="relative w-full h-56 flex items-end justify-center mb-4">
        {/* Ripples */}
        <AnimatePresence>
          {ripples.map((r, i) => (
            <motion.div key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ border: "2px solid rgba(56,189,248,0.7)", left: "50%", bottom: "20px", translateX: "-50%" }}
              initial={{ width: 40, height: 40, opacity: 0.8 }}
              animate={{ width: 300 + i * 80, height: 300 + i * 80, opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.3, ease: "easeOut" }}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>

        {/* Stacked pieces */}
        <div className="flex flex-col-reverse items-center gap-0">
          {stacked.map((piece, i) => (
            <motion.div key={piece.id}
              initial={{ y: -60, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="flex items-center justify-center text-amber-100 font-bold text-lg tracking-widest"
              style={{
                width: `${160 - i * 20}px`,
                height: `${28 + i * 4}px`,
                background: `linear-gradient(90deg, ${piece.color}, ${piece.color}cc)`,
                border: "1px solid rgba(245,158,11,0.7)",
                boxShadow: "0 0 15px rgba(245,158,11,0.4)",
                borderRadius: "3px",
                fontFamily: "'Noto Serif SC', serif",
              }}>
              {piece.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Clickable pieces */}
      <div className="flex gap-4 mb-6">
        {DOUGONG_PIECES.map((piece, i) => {
          const isStacked = stacked.find(s => s.id === piece.id);
          const isNext = stacked.length === i;
          return (
            <motion.button key={piece.id}
              onClick={() => handleClick(piece)}
              whileHover={isNext ? { scale: 1.1, boxShadow: "0 0 20px rgba(245,158,11,0.6)" } : {}}
              whileTap={isNext ? { scale: 0.95 } : {}}
              className="w-16 h-16 rounded flex items-center justify-center text-xl font-bold"
              style={{
                background: isStacked ? "rgba(20,30,20,0.5)" : `linear-gradient(135deg, ${piece.color}, ${piece.color}99)`,
                border: isStacked ? "1px solid rgba(100,100,100,0.3)" : isNext ? "2px solid rgba(245,158,11,0.9)" : "1px solid rgba(245,158,11,0.4)",
                color: isStacked ? "#4b5563" : "#fde68a",
                boxShadow: isNext ? "0 0 15px rgba(245,158,11,0.4)" : "none",
                cursor: isNext ? "pointer" : "default",
                fontFamily: "'Noto Serif SC', serif",
              }}>
              {piece.label}
            </motion.button>
          );
        })}
      </div>

      <p className="text-slate-400 text-xs font-mono mb-4 tracking-widest">按顺序点击「升」「拱」「升」，自下而上堆叠斗拱</p>

      {stacked.length === 3 && (
        <div className="w-full space-y-2 mt-2">
          <DialogueBox text={DIALOGUE.node2.tianGong} variant="tianGong" />
          <DialogueBox text={DIALOGUE.node2.yeShi} variant="yeShi" />
        </div>
      )}

      <AnimatePresence>
        {showBranch && !branchDone && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => { setBranchDone(true); onStabilityChange(20); setTimeout(() => onComplete(), 2000); }}
            className="mt-4 px-6 py-2 rounded text-sm font-mono tracking-widest"
            style={{ background: "rgba(10,15,30,0.8)", border: "1px solid rgba(56,189,248,0.7)", color: "#7dd3fc", boxShadow: "0 0 15px rgba(56,189,248,0.3)" }}
            whileHover={{ boxShadow: "0 0 25px rgba(56,189,248,0.6)" }}
          >
            🌉 解锁【廊桥遗梦】（支线）
          </motion.button>
        )}
        {branchDone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 w-full">
            {/* Ghost lovers silhouette */}
            <div className="w-full h-24 rounded-lg flex items-center justify-center relative overflow-hidden mb-3"
              style={{ background: "rgba(10,15,30,0.7)", border: "1px solid rgba(56,189,248,0.3)" }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="flex gap-8">
                <div className="w-12 h-20 rounded-t-full" style={{ background: "linear-gradient(180deg, rgba(165,180,252,0.6), transparent)" }} />
                <div className="w-10 h-18 rounded-t-full" style={{ background: "linear-gradient(180deg, rgba(165,180,252,0.4), transparent)" }} />
              </motion.div>
              <p className="absolute bottom-2 text-slate-400 text-xs font-mono tracking-widest">修桥就是修补人间烟火</p>
            </div>
            <p className="text-emerald-400 text-xs font-mono text-center">✓ 稳定度 +20%　正在进入节点三……</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// NODE 3: 大梁·担当 (Rhythm Game)
// ──────────────────────────────────────────────
function Node3({ onComplete }) {
  const [hits, setHits] = useState(0);
  const [ringScale, setRingScale] = useState(3);
  const [feedback, setFeedback] = useState(null); // "perfect" | "miss"
  const [chantIdx, setChantIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(false);
  const ringRef = useRef(null);
  const animRef = useRef(null);

  const startRound = useCallback(() => {
    setActive(true);
    setRingScale(3);
    let start = null;
    const duration = 2000;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setRingScale(3 - progress * 2.8);
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, []);

  const handleHit = () => {
    if (!active) return;
    cancelAnimationFrame(animRef.current);
    const perfect = ringScale < 0.35 && ringScale > 0.05;
    if (perfect) {
      setFeedback("perfect");
      setChantIdx(prev => Math.min(prev + 1, 2));
      const newHits = hits + 1;
      setHits(newHits);
      setActive(false);
      if (newHits >= 3) {
        setDone(true);
        return;
      }
      setTimeout(() => { setFeedback(null); startRound(); }, 1000);
    } else {
      setFeedback("miss");
      setActive(false);
      setTimeout(() => { setFeedback(null); startRound(); }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <StageBanner title="大梁·担当" subtitle="NODE 03 · RIDGE BEAM RITUAL" />

      {!done ? (
        <>
          {/* Chant display */}
          <div className="w-full mb-4 text-center h-10">
            <AnimatePresence mode="wait">
              <motion.p key={chantIdx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-2xl tracking-widest"
                style={{ color: "#fde68a", textShadow: "0 0 20px rgba(245,158,11,0.8)", fontFamily: "'Noto Serif SC', serif" }}>
                {DIALOGUE.node3.yeShi_chant[chantIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Ring target */}
          <div className="relative w-48 h-48 flex items-center justify-center mb-4 cursor-pointer" onClick={handleHit}>
            {/* Outer ring */}
            <motion.div className="absolute rounded-full border-2"
              style={{
                width: `${ringScale * 80}px`,
                height: `${ringScale * 80}px`,
                borderColor: feedback === "perfect" ? "#34d399" : feedback === "miss" ? "#ef4444" : "#f59e0b",
                boxShadow: `0 0 20px ${feedback === "perfect" ? "rgba(52,211,153,0.8)" : feedback === "miss" ? "rgba(239,68,68,0.8)" : "rgba(245,158,11,0.5)"}`,
              }} />
            {/* Center target */}
            <motion.div className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: "#38bdf8", boxShadow: "0 0 15px rgba(56,189,248,0.8)" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }} />
            {/* Feedback text */}
            <AnimatePresence>
              {feedback && (
                <motion.span initial={{ opacity: 1, y: 0, scale: 1.5 }} animate={{ opacity: 0, y: -30 }} exit={{}}
                  className="absolute text-lg font-bold font-mono"
                  style={{ color: feedback === "perfect" ? "#34d399" : "#ef4444" }}>
                  {feedback === "perfect" ? "夯实！" : "错节！"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Beat indicator */}
          <div className="flex gap-3 mb-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-4 h-4 rounded-full"
                style={{ background: i < hits ? "#34d399" : "rgba(30,41,59,0.8)", border: i < hits ? "1px solid #34d399" : "1px solid rgba(100,100,100,0.4)", boxShadow: i < hits ? "0 0 8px rgba(52,211,153,0.8)" : "none", transition: "all 0.3s" }} />
            ))}
          </div>

          <DialogueBox text={DIALOGUE.node3.tianGong} variant="tianGong" />

          {!active && !done && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={startRound}
              className="mt-4 px-8 py-3 rounded text-sm font-mono tracking-widest"
              style={{ background: "linear-gradient(135deg, rgba(146,64,14,0.8), rgba(180,83,9,0.8))", border: "2px solid rgba(245,158,11,0.8)", color: "#fde68a", boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
              whileHover={{ boxShadow: "0 0 30px rgba(245,158,11,0.7)" }}>
              {hits === 0 ? "▶ 开始上梁礼" : "▶ 继续"}
            </motion.button>
          )}
          {active && (
            <motion.button onClick={handleHit}
              className="mt-4 px-8 py-3 rounded text-base font-bold tracking-widest"
              style={{ background: "linear-gradient(135deg, rgba(146,64,14,0.9), rgba(251,191,36,0.9))", border: "2px solid #fde68a", color: "#1a0a00", boxShadow: "0 0 25px rgba(245,158,11,0.7)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              夯实！
            </motion.button>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
          <motion.div
            animate={{ boxShadow: ["0 0 20px rgba(253,230,138,0.4)", "0 0 60px rgba(253,230,138,0.9)", "0 0 20px rgba(253,230,138,0.4)"] }}
            transition={{ duration: 1.5, repeat: 3 }}
            className="w-full py-6 rounded-lg mb-4"
            style={{ background: "rgba(30,20,5,0.7)", border: "1px solid rgba(253,230,138,0.6)" }}>
            <p className="text-2xl tracking-widest" style={{ color: "#fde68a", fontFamily: "'Noto Serif SC', serif", textShadow: "0 0 20px rgba(245,158,11,1)" }}>🔔 {DIALOGUE.node3.complete}</p>
          </motion.div>
          <motion.button onClick={onComplete} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="px-6 py-2 rounded font-mono text-sm"
            style={{ border: "1px solid rgba(56,189,248,0.5)", color: "#7dd3fc" }}>
            继续 →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// NODE 4: 脊檩·通天 (Rotation Slider)
// ──────────────────────────────────────────────
function Node4({ onComplete }) {
  const [angle, setAngle] = useState(45);
  const [aligned, setAligned] = useState(false);
  const tolerance = 8;

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setAngle(val);
    if (Math.abs(val) < tolerance) setAligned(true);
    else setAligned(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <StageBanner title="脊檩·通天" subtitle="NODE 04 · RIDGE POLE ALIGNMENT" />

      {/* Wood block with grain */}
      <div className="relative w-32 h-64 flex items-center justify-center mb-6">
        {/* Heaven axis indicator */}
        <motion.div className="absolute w-0.5 h-72 left-1/2 -translate-x-1/2"
          style={{ background: "linear-gradient(180deg, transparent, rgba(56,189,248,0.9), transparent)", boxShadow: "0 0 15px rgba(56,189,248,0.5)" }} />
        <p className="absolute -top-8 text-sky-400 text-xs font-mono tracking-widest">天枢·0°</p>

        {/* Rotating wood */}
        <motion.div
          animate={{ rotate: angle }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="relative w-16 h-56 rounded"
          style={{
            background: `repeating-linear-gradient(${angle}deg, #78350f 0px, #92400e 3px, #78350f 6px, #451a03 9px, #78350f 12px)`,
            border: aligned ? "2px solid rgba(56,189,248,0.9)" : "2px solid rgba(245,158,11,0.6)",
            boxShadow: aligned ? "0 0 25px rgba(56,189,248,0.7)" : "0 0 10px rgba(245,158,11,0.3)",
          }}>
          {/* Wood grain lines */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 h-px opacity-40" style={{ top: `${10 + i * 12}%`, background: "#b45309" }} />
          ))}
          {aligned && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded"
              style={{ background: "rgba(56,189,248,0.1)" }} />
          )}
        </motion.div>
      </div>

      {/* Angle display */}
      <div className="flex items-center gap-4 mb-2">
        <span className="text-amber-400 text-sm font-mono">{Math.round(angle)}°</span>
        {aligned && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sky-400 text-xs font-mono">✓ 天人合一</motion.span>}
      </div>

      {/* Slider */}
      <input type="range" min="-90" max="90" value={angle} onChange={handleChange}
        className="w-64 mb-6 accent-amber-500" style={{ accentColor: "#f59e0b" }} />

      <div className="w-full space-y-2">
        <DialogueBox text={DIALOGUE.node4.tianGong} variant="tianGong" />
        <DialogueBox text={DIALOGUE.node4.yeShi} variant="yeShi" />
      </div>

      <AnimatePresence>
        {aligned && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onComplete}
            className="mt-4 px-8 py-3 rounded font-mono text-sm tracking-widest"
            style={{ background: "linear-gradient(135deg, rgba(8,25,50,0.9), rgba(8,25,50,0.9))", border: "2px solid rgba(56,189,248,0.8)", color: "#7dd3fc", boxShadow: "0 0 20px rgba(56,189,248,0.4)" }}
            whileHover={{ boxShadow: "0 0 30px rgba(56,189,248,0.7)" }}>
            ✓ 顺应天时，进入终章 →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// NODE 5: 锁位键·点睛
// ──────────────────────────────────────────────
function Node5({ onComplete }) {
  const [phase, setPhase] = useState("dark"); // dark | inserting | explode | done
  const controls = useAnimation();

  const handleInsert = async () => {
    setPhase("inserting");
    await controls.start({ x: [0, -8, 8, -5, 5, -2, 2, 0], transition: { duration: 0.6 } });
    setPhase("explode");
    setTimeout(() => { setPhase("done"); }, 2500);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl">
      <StageBanner title="锁位键·点睛" subtitle="NODE 05 · LUBAN LOCK FINAL KEY" />

      <div className="w-full space-y-2 mb-6">
        <DialogueBox text={DIALOGUE.node5.tianGong} variant="tianGong" />
        <DialogueBox text={DIALOGUE.node5.yeShi} variant="yeShi" />
      </div>

      <motion.div animate={controls} className="flex flex-col items-center w-full">
        {/* Dark void with ghost */}
        <div className="relative w-full h-48 flex items-center justify-center rounded-lg overflow-hidden"
          style={{ background: phase === "dark" || phase === "inserting" ? "rgba(2,6,23,0.95)" : "transparent", border: "1px solid rgba(56,189,248,0.2)" }}>

          {/* Ghost wedge */}
          {(phase === "dark" || phase === "inserting") && (
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2">
              <div className="w-4 h-20 rounded"
                style={{ background: "linear-gradient(180deg, rgba(253,230,138,0.4), transparent)", border: "1px solid rgba(253,230,138,0.3)" }} />
              <span className="text-amber-200/40 text-xs font-mono tracking-widest">鲁班锁</span>
            </motion.div>
          )}

          {/* Explosion of bridge */}
          {phase === "explode" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="absolute inset-0 flex items-center justify-center">
              {/* Bridge wireframe SVG */}
              <svg viewBox="0 0 400 160" className="w-full h-full" style={{ filter: "drop-shadow(0 0 15px rgba(245,158,11,0.9))" }}>
                {/* Main span */}
                <line x1="20" y1="80" x2="380" y2="80" stroke="#f59e0b" strokeWidth="3" />
                {/* Arch */}
                <path d="M 50 80 Q 200 10 350 80" fill="none" stroke="#fde68a" strokeWidth="2" />
                {/* Pillars */}
                {[80, 130, 200, 270, 320].map((x, i) => (
                  <line key={i} x1={x} y1="80" x2={x} y2="140" stroke="#f59e0b" strokeWidth="2" />
                ))}
                {/* Hangers */}
                {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((x, i) => (
                  <line key={i} x1={x} y1="35" x2={x} y2="80" stroke="rgba(56,189,248,0.7)" strokeWidth="1" />
                ))}
                {/* Water reflection */}
                <path d="M 50 140 Q 200 155 350 140" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="5,5" />
                {/* Glow dots */}
                {[50, 130, 200, 270, 350].map((x, i) => (
                  <circle key={i} cx={x} cy="80" r="4" fill="#fde68a" style={{ filter: "drop-shadow(0 0 6px rgba(253,230,138,1))" }} />
                ))}
              </svg>
            </motion.div>
          )}

          {/* Golden flash on explode */}
          <AnimatePresence>
            {phase === "explode" && (
              <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }}
                className="absolute inset-0"
                style={{ background: "rgba(253,230,138,0.4)" }} />
            )}
          </AnimatePresence>
        </div>

        {/* Completion text */}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center w-full">
              <p className="text-2xl tracking-widest mb-2" style={{ color: "#fde68a", textShadow: "0 0 30px rgba(245,158,11,1)", fontFamily: "'Noto Serif SC', serif" }}>
                🔔 {DIALOGUE.node5.complete}
              </p>
              <p className="text-sky-300 text-sm font-mono tracking-widest mb-4">稳定度已达到 100%　广安桥·数字重生</p>
              <motion.button onClick={onComplete}
                className="px-10 py-3 rounded text-base font-bold tracking-widest"
                style={{ background: "linear-gradient(135deg, rgba(146,64,14,0.9), rgba(251,191,36,0.7))", border: "2px solid #fde68a", color: "#1a0a00", boxShadow: "0 0 30px rgba(245,158,11,0.8)" }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(245,158,11,1)" }}
                animate={{ boxShadow: ["0 0 20px rgba(245,158,11,0.6)", "0 0 40px rgba(245,158,11,0.9)", "0 0 20px rgba(245,158,11,0.6)"] }}
                transition={{ repeat: Infinity, duration: 1.5 }}>
                ✦ 第二幕完成 · 进入终章 ✦
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "dark" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleInsert}
            className="mt-6 px-10 py-3 rounded text-sm font-mono tracking-widest"
            style={{ background: "rgba(2,6,23,0.9)", border: "2px solid rgba(253,230,138,0.7)", color: "#fde68a", boxShadow: "0 0 20px rgba(253,230,138,0.3)" }}
            whileHover={{ boxShadow: "0 0 40px rgba(253,230,138,0.7)" }}>
            ▶ 推入鲁班锁
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────
// COMPLETE SCREEN
// ──────────────────────────────────────────────
function CompleteScreen({ onRestart }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen text-center px-8">
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="mb-8">
        <h1 className="text-5xl font-bold tracking-[0.2em] mb-4"
          style={{ color: "#fde68a", textShadow: "0 0 40px rgba(245,158,11,1), 0 0 80px rgba(245,158,11,0.5)", fontFamily: "'Noto Serif SC', serif" }}>
          广安桥影
        </h1>
        <p className="text-sky-300 text-lg font-mono tracking-[0.4em]">第二幕·构影篇　完成</p>
      </motion.div>

      {/* Bridge full wireframe */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="w-full max-w-2xl mb-8 rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(245,158,11,0.4)", boxShadow: "0 0 40px rgba(245,158,11,0.2)" }}>
        <svg viewBox="0 0 600 200" className="w-full"
          style={{ background: "rgba(2,6,23,0.8)", filter: "drop-shadow(0 0 10px rgba(245,158,11,0.5))" }}>
          <defs>
            <linearGradient id="bridgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245,158,11,0.3)" />
              <stop offset="50%" stopColor="rgba(253,230,138,1)" />
              <stop offset="100%" stopColor="rgba(245,158,11,0.3)" />
            </linearGradient>
          </defs>
          {/* Main road */}
          <line x1="30" y1="110" x2="570" y2="110" stroke="url(#bridgeGlow)" strokeWidth="4" />
          {/* Main arch */}
          <path d="M 60 110 Q 300 20 540 110" fill="none" stroke="#fde68a" strokeWidth="2.5" strokeDasharray="0" />
          {/* Secondary arches */}
          <path d="M 100 110 Q 200 65 300 110" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" />
          <path d="M 300 110 Q 400 65 500 110" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="1.5" />
          {/* Pillars */}
          {[100, 180, 300, 420, 500].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="110" x2={x} y2="170" stroke="#f59e0b" strokeWidth="3" />
              <rect x={x - 8} y="168" width="16" height="6" fill="#b45309" rx="2" />
            </g>
          ))}
          {/* Hangers */}
          {[80, 110, 140, 170, 220, 260, 300, 340, 380, 420, 460, 500, 530].map((x, i) => (
            <line key={i} x1={x} y1={55 - Math.abs(x - 300) * 0.15} x2={x} y2="110" stroke="rgba(56,189,248,0.6)" strokeWidth="1" />
          ))}
          {/* Water */}
          <path d="M 0 180 Q 150 175 300 180 Q 450 185 600 180" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
          <path d="M 0 190 Q 150 185 300 190 Q 450 195 600 190" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="1" />
          {/* Glow nodes */}
          {[60, 180, 300, 420, 540].map((x, i) => (
            <motion.circle key={i} cx={x} cy="110" r="5" fill="#fde68a"
              animate={{ r: [5, 7, 5], opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} />
          ))}
          {/* Data lines */}
          {[...Array(6)].map((_, i) => (
            <motion.line key={i} x1="30" y1={120 + i * 8} x2="570" y2={120 + i * 8}
              stroke="rgba(56,189,248,0.15)" strokeWidth="0.5"
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} />
          ))}
        </svg>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="max-w-md text-center mb-8">
        <p className="text-amber-200/80 text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          "叶师傅"的量子幻影在桥影中渐渐消散，留下一声轻叹：
        </p>
        <p className="text-amber-300 text-base mt-2 leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          "桥是木头造的，但桥魂是人心铸的。记住了，孩子。"
        </p>
      </motion.div>

      <motion.button onClick={onRestart}
        className="px-8 py-3 rounded font-mono text-sm tracking-widest"
        style={{ background: "rgba(8,25,50,0.8)", border: "1px solid rgba(56,189,248,0.6)", color: "#7dd3fc", boxShadow: "0 0 15px rgba(56,189,248,0.3)" }}
        whileHover={{ boxShadow: "0 0 25px rgba(56,189,248,0.6)" }}>
        ↺ 重启第二幕
      </motion.button>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
export default function GuangAnBridgeAct2({ onComplete }) {
  const [stage, setStage] = useState(STAGES.INTRO);
  const [stability, setStability] = useState(50);

  const addStability = useCallback((amount) => {
    setStability(prev => Math.min(100, prev + amount));
  }, []);

  const goTo = useCallback((next) => {
    setStage(next);
  }, []);

  // Stage content renderer
  const renderStage = () => {
    switch (stage) {
      case STAGES.INTRO:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-screen text-center px-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="mb-8">
              <div className="text-sky-400 text-xs font-mono tracking-[0.5em] mb-4">— 第二幕 · 构影篇 —</div>
              <h1 className="text-4xl font-bold tracking-[0.15em] mb-3"
                style={{ color: "#fde68a", textShadow: "0 0 30px rgba(245,158,11,0.9)", fontFamily: "'Noto Serif SC', serif" }}>
                广安桥影
              </h1>
              <p className="text-amber-300/80 text-lg tracking-widest" style={{ fontFamily: "'Noto Serif SC', serif" }}>榫卯里的中国魂</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="max-w-md mb-8 p-4 rounded-xl"
              style={{ background: "rgba(10,20,40,0.7)", border: "1px solid rgba(56,189,248,0.3)", backdropFilter: "blur(12px)" }}>
              <p className="text-slate-300 text-sm leading-relaxed" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                叶师傅的量子幻影已被唤醒。现在，你将与他共同完成这座消失三百年的廊桥——
                五个榫卯构影节点，等待你的匠心。
              </p>
            </motion.div>

            <DialogueBox text="量子纠缠稳定。叶师傅幻影具现度 78%。开始构影解谜程序……" variant="tianGong" />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => goTo(STAGES.NODE1)}
              className="mt-8 px-10 py-4 rounded-lg text-base font-bold tracking-widest"
              style={{
                background: "linear-gradient(135deg, rgba(146,64,14,0.8), rgba(180,83,9,0.6))",
                border: "2px solid rgba(245,158,11,0.8)",
                color: "#fde68a",
                boxShadow: "0 0 25px rgba(245,158,11,0.4)",
                fontFamily: "'Noto Serif SC', serif",
              }}
              whileHover={{ boxShadow: "0 0 40px rgba(245,158,11,0.8)", scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              ▶ 入画·开始构影
            </motion.button>
          </motion.div>
        );

      case STAGES.NODE1:
        return <Node1 onComplete={() => { addStability(5); goTo(STAGES.NODE2); }} onStabilityChange={addStability} />;

      case STAGES.NODE2:
        return <Node2 onComplete={() => { addStability(5); goTo(STAGES.NODE3); }} onStabilityChange={addStability} />;

      case STAGES.NODE3:
        return <Node3 onComplete={() => { addStability(10); goTo(STAGES.NODE4); }} />;

      case STAGES.NODE4:
        return <Node4 onComplete={() => { addStability(5); goTo(STAGES.NODE5); }} />;

      case STAGES.NODE5:
        return <Node5 onComplete={() => { setStability(100); goTo(STAGES.COMPLETE); }} />;

      case STAGES.COMPLETE:
        return <CompleteScreen onRestart={() => { setStability(50); goTo(STAGES.INTRO); }} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
      <CyberGrid />
      <HUD stability={stability} />

      {/* Progress dots */}
      {stage !== STAGES.INTRO && stage !== STAGES.COMPLETE && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {[STAGES.NODE1, STAGES.NODE2, STAGES.NODE3, STAGES.NODE4, STAGES.NODE5].map((s, i) => {
            const stages = [STAGES.NODE1, STAGES.NODE2, STAGES.NODE3, STAGES.NODE4, STAGES.NODE5];
            const currentIdx = stages.indexOf(stage);
            const isActive = i === currentIdx;
            const isDone = i < currentIdx;
            return (
              <div key={s} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full transition-all duration-500"
                  style={{
                    background: isDone ? "#34d399" : isActive ? "#f59e0b" : "rgba(71,85,105,0.5)",
                    boxShadow: isActive ? "0 0 8px rgba(245,158,11,0.8)" : isDone ? "0 0 8px rgba(52,211,153,0.6)" : "none",
                  }} />
                {i < 4 && <div className="w-4 h-px" style={{ background: isDone ? "rgba(52,211,153,0.5)" : "rgba(71,85,105,0.3)" }} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Main content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}>
              {renderStage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

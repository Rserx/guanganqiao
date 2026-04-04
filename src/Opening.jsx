import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, Search } from "lucide-react";

// ============================================================
// 剧本常量
// ============================================================
const script = [
  { text: "中国现存古桥约12000座。", speed: 100, pause: 800, className: "" },
  { text: "其中有据可查的结构档案，不足3%。", speed: 100, pause: 1200, className: "" },
  { text: "每消失一座古桥，人类失去的不只是石头和木头——", speed: 80, pause: 800, className: "" },
  { text: "是一套用千年试错换来的，与自然共处的答案。", speed: 120, pause: 2500, className: "" },
  { text: "天工系统，启动。", speed: 150, pause: 1000, className: "system-start glitch" },
  { text: "任务：找回广安桥。", speed: 100, pause: 2000, className: "system-start" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// AR 扫描子组件
// ============================================================
function ARScanner({ onComplete, onSkip }) {
  const videoRef = useRef(null);
  const [scanState, setScanState] = useState("initializing"); // initializing, scanning, analyzing, success
  const [scanResult, setScanResult] = useState(null);

  const knowledgeGraph = [
    { type: "直榫", location: "泰顺廊桥·中间节点", match: "63%" },
    { type: "燕尾榫", location: "应县木塔·二层平座", match: "78%" },
    { type: "馒头榫", location: "故宫太和殿·柱础", match: "82%" },
    { type: "银锭榫", location: "川西民居·梁架", match: "91%" },
  ];

  useEffect(() => {
    let streamToStop = null;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamToStop = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setScanState("scanning");
      } catch (err) {
        console.warn("摄像头调用失败或被拒绝:", err);
        onSkip();
      }
    };
    startCamera();

    return () => {
      if (streamToStop) {
        streamToStop.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onSkip]);

  const handleStartScan = () => {
    setScanState("analyzing");
    setTimeout(() => {
      const randomResult = knowledgeGraph[Math.floor(Math.random() * knowledgeGraph.length)];
      setScanResult(randomResult);
      setScanState("success");
      localStorage.setItem("ar_scan_data", JSON.stringify(randomResult));
      setTimeout(() => {
        onComplete();
      }, 3500);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono"
    >
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[30%] contrast-125" />
      
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative w-64 h-64 sm:w-80 sm:h-80 border border-cyan-500/30 flex items-center justify-center backdrop-blur-[2px]">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

        {(scanState === "scanning" || scanState === "analyzing") && (
          <motion.div animate={{ y: ["-100%", "300%", "-100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
        )}
        {scanState === "scanning" && (
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-cyan-400/50 animate-ping"></div></div>
        )}
      </div>

      <div className="z-10 mt-12 flex flex-col items-center">
        {scanState === "initializing" && <p className="text-cyan-500 animate-pulse">正在初始化视觉传感器...</p>}
        {scanState === "scanning" && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-cyan-300 bg-black/50 px-4 py-1 rounded">请将镜头对准附近的【木质结构】</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStartScan} className="flex items-center gap-2 px-8 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-500/40 transition-colors">
              <Camera size={18} /> 锁定结构特征
            </motion.button>
            <button onClick={onSkip} className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-4">跳过扫描</button>
          </div>
        )}
        {scanState === "analyzing" && (
          <div className="flex flex-col items-center gap-3">
            <Search size={24} className="text-cyan-400 animate-spin" />
            <p className="text-cyan-400 bg-black/50 px-4 py-1 rounded">AI 轮廓提取中，正在比对古建知识图谱...</p>
          </div>
        )}
        {scanState === "success" && scanResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/80 p-5 border-l-4 border-cyan-400 max-w-sm shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <div className="flex items-center gap-2 text-green-400 mb-2"><Check size={16} /><span className="font-bold">匹配完成</span></div>
            <p className="text-sm text-gray-200 mb-1">检测到 <span className="text-cyan-400 font-bold px-1">[{scanResult.type}]</span> 结构特征。</p>
            <p className="text-sm text-gray-400 mb-3">最近似案例：{scanResult.location}，相似度 <span className="text-cyan-400">{scanResult.match}</span>。</p>
            <div className="h-[1px] w-full bg-gray-800 my-2"></div>
            <p className="text-[10px] text-gray-500 leading-relaxed">该结构数据已匿名上传至天工公共古建知识库。<br/>感谢您的贡献。</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// 主导览组件 (融合了复古终端样式和AR提示)
// ============================================================
export default function Opening({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [phase, setPhase] = useState("typing"); // typing -> prompt -> scanning -> done
  
  // 仅在浏览器环境下初始化 Audio
  const typeSound = useRef(typeof window !== "undefined" ? new Audio('/type-sound.mp3') : null);

  useEffect(() => {
    let isCancelled = false;

    const playScript = async () => {
      let currentLines = [];
      await sleep(1000);

      for (let i = 0; i < script.length; i++) {
        if (isCancelled) return;
        
        const lineData = script[i];
        currentLines.push({ text: '', className: lineData.className });
        setActiveLineIndex(i);

        for (let j = 0; j < lineData.text.length; j++) {
          if (isCancelled) return;
          
          currentLines[i].text = lineData.text.substring(0, j + 1);
          setLines([...currentLines]);
          
          if (typeSound.current) {
            typeSound.current.currentTime = 0;
            typeSound.current.play().catch(()=>{}); 
          }

          await sleep(lineData.speed + (Math.random() * 50 - 25));
        }

        if (lineData.className.includes("glitch")) {
          setTimeout(() => {
            if (isCancelled) return;
            currentLines[i].className = lineData.className.replace("glitch", "").trim();
            setLines([...currentLines]);
          }, 500);
        }

        await sleep(lineData.pause);
      }

      if (!isCancelled) {
        setIsFinished(true);
        setPhase("prompt");
      }
    };

    playScript();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSkip = () => {
    localStorage.removeItem("ar_scan_data");
    onComplete();
  };

  if (phase === "scanning") {
    return <ARScanner onComplete={onComplete} onSkip={handleSkip} />;
  }

  return (
    <>
      <style>{`
        .opening-bg {
          position: fixed; inset: 0; background-color: #050505; color: #ffffff;
          font-family: 'Courier New', Courier, monospace, 'SimHei';
          display: flex; justify-content: center; align-items: center; z-index: 50;
        }
        .scanlines {
          position: fixed; inset: 0; pointer-events: none; z-index: 52;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
        }
        .vignette {
          position: fixed; inset: 0; pointer-events: none; z-index: 53;
          background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%);
        }
        .terminal {
          width: 80%; max-width: 800px; font-size: 1.5rem; line-height: 2;
          text-shadow: 0 0 5px #ffffff; z-index: 51;
        }
        .line { min-height: 2rem; margin-bottom: 15px; opacity: 0.9; }
        .cursor {
          display: inline-block; width: 12px; height: 1.2rem; background-color: currentColor;
          animation: blink 1s step-end infinite; vertical-align: text-bottom; margin-left: 5px;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .system-start {
          color: #4084f1; text-shadow: 0 0 10px #4084f1, 0 0 20px #4084f1;
          font-weight: bold; font-size: 2rem;
        }
        .glitch { animation: glitch-anim 0.2s linear infinite; }
        @keyframes glitch-anim {
          0% { transform: translate(0) } 20% { transform: translate(-2px, 1px) }
          40% { transform: translate(-1px, -1px) } 60% { transform: translate(2px, 1px) }
          80% { transform: translate(1px, -1px) } 100% { transform: translate(0) }
        }
      `}</style>

      <div className="opening-bg font-mono">
        <div className="scanlines"></div>
        <div className="vignette"></div>
        
        {/* 终端文字层 */}
        <div className="terminal">
          {lines.map((line, index) => (
            <div key={index} className={`line ${line.className || ''}`}>
              {line.text}
              {(index === activeLineIndex || (isFinished && index === lines.length - 1)) && (
                <span className="cursor"></span>
              )}
            </div>
          ))}
        </div>

       {/* 覆盖在终端上的 AR 扫描提示层 */}
        <AnimatePresence>
          {phase === "prompt" && (
            // 👇 这里加了一个 fixed 全屏居中的遮罩层
            <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-[1px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                // 👇 去掉了 absolute 和 bottom 属性，直接依靠父级居中
                className="w-[90%] max-w-md bg-[#020617]/95 border border-cyan-500/40 p-6 shadow-[0_0_30px_rgba(34,211,238,0.15)] rounded-sm"
              >
                <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/20 pb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className="text-cyan-400 text-sm tracking-widest font-bold">天工系统提示</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-8 font-sans">
                  检测到您所在位置附近存在<span className="text-amber-400 font-bold px-1 text-base">木质建筑结构</span>。
                  是否开启实景采集模式，扫描并上传结构特征至古建知识图谱？
                </p>
                <div className="flex justify-end gap-5 font-sans">
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    忽略跳过
                  </button>
                  <button
                    onClick={() => setPhase("scanning")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-500 hover:text-black transition-all font-bold shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]"
                  >
                    <Camera size={16} />
                    开启实景扫描
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
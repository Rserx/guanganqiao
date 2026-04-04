// ============================================================
//  《广安桥影:榫卯里的中国魂》第一幕
//  顶部常量 - 请在此填入你的 DeepSeek API Key
// ============================================================
const DEEPSEEK_API_KEY = "sk-694d089c60c1424f842dbc69d38e80b5";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Cpu, Radio, Wifi, AlertTriangle, Send, RotateCcw, Settings,BookOpen, X, Loader2 , Undo2, ChevronDown } from "lucide-react";
import { Sun, Volume2 } from "lucide-react";

// ============================================================
//  剧本路由状态机 SCENES (🌟 升级为多轮对话数组结构)
// ============================================================
const SCENES = {
  "0_opening": {
    id: "0_opening",
    mediaType: "video",
    mediaSrc: "/bridge_fog.mp4",
    dialogues: [
      { speaker: "天工", speakerType: "system", text: "天工系统已连接。广安桥数字档案——损坏率87%。" },
      { speaker: "天工", speakerType: "system", text: "已提取残存结构特征向量……与知识图谱比对中……" },
      { speaker: "天工", speakerType: "system", text: "结论：现有数据不足以支撑独立重建。广安桥的结构智慧，分散保存在历史上与它同类的名桥里。" },
      { speaker: "天工", speakerType: "system", text: "启动'结构基因溯源'协议。我将主动检索，告诉你去哪里找答案。" }
    ],
    choices: [{ label: "触碰断桥主梁", nextId: "1_meet_master" }],
  },
  "1_meet_master": {
    id: "1_meet_master",
    mediaType: "video",
    mediaSrc: "/叶师傅出现.mp4",
    dialogues: [
      { speaker: "叶师傅", speakerType: "master", text: "……" },
      { speaker: "叶师傅", speakerType: "master", text: "你来了。" },
      { speaker: "叶师傅", speakerType: "master", text: "我等这个人，等了很久了。" },
      { speaker: "天工", speakerType: "system", text: "检测到基于史料重构的工匠数字体——叶姓，川西廊桥工艺传承人，生卒不详。RAG知识库匹配中……已接入《营造法式》、川西县志、1911年洪灾档案。" },
      { speaker: "天工", speakerType: "system", text: "叶师傅，我需要您的经验来填补我数据库里的空白。" },
      { speaker: "叶师傅", speakerType: "master", text: "铁盒子，你还算识数。" },
      { speaker: "叶师傅", speakerType: "master", text: "行，我陪你走一趟。" }
    ],
    choices: [{ label: "进入自由交流", nextId: "2_free_talk" }],
  },
  "2_free_talk": {
    id: "2_free_talk",
    mediaType: "image",
    mediaSrc: "/叶师傅.png",
    dialogues: [
      { speaker: "天工", speakerType: "system", text: "操作员，认知接口已建立。您可以尝试询问他关于建造、材料或历史的细节。" }
    ],
    isFreeTalk: true,
    choices: [],
  },
  "3_scan_wood": {
    id: "3_scan_wood",
    mediaType: "image",
    mediaSrc: "/木料苔藓.png",
    dialogues: [
      { speaker: "天工", speakerType: "system", text: "量子扫描启动——检测到悬浮木料。材质：千年阴沉楠木。表面附着苔藓，榫头结构受损约 37%。" }
    ],
    choices: [
      { label: "【细心】拂去苔藓，观察纹理", nextId: "4a_side_quest", tag: "careful" },
      { label: "【快捷】强行拼合，直取要道", nextId: "4b_main_line", tag: "fast" },
    ],
  },
  "4a_side_quest": {
    id: "4a_side_quest",
    mediaType: "image",
    mediaSrc: "/木料.png",
    dialogues: [
      { speaker: "叶师傅", speakerType: "master", text: "好……有耐性。这纹理走向，藏着桥魂的呼吸。" },
      { speaker: "叶师傅", speakerType: "master", text: "苔藓之下有铜钱，是老朽当年镇桥所用。取去吧，后生，这份细心，比十把铁锤都值钱。" }
    ],
    stabilityBonus: 10,
    choices: [{ label: "执行榫卯拼合", nextId: "5_amber" }],
  },
  "4b_main_line": {
    id: "4b_main_line",
    mediaType: "image",
    mediaSrc: "/tenon_scan.png",
    dialogues: [
      { speaker: "天工", speakerType: "system", text: "警告——强行拼合导致木纤维微裂，时空稳定度轻微下降。但结构基本成型。" },
      { speaker: "天工", speakerType: "system", text: "系统提示：效率优先，但有时候，慢即是快。" }
    ],
    choices: [{ label: "继续前进", nextId: "5_amber" }],
  },
  "5_amber": {
    id: "5_amber",
    mediaType: "image",
    mediaSrc: "/结构.png",
    dialogues: [
      { speaker: "叶师傅", speakerType: "master", text: "榫入卯，卯合榫……看，时光琥珀正在重现。这桥，不是木头的桥，是人心的桥。" },
      { speaker: "叶师傅", speakerType: "master", text: "后生，你已触摸到了第一块桥板。去吧，构影之境在等着你。" }
    ],
    choices: [{ label: "进入构影之境", nextId: "chapter1_end" }],
  },
  chapter1_end: {
    id: "chapter1_end",
    mediaType: "image",
    mediaSrc: "/晶核.png",
    dialogues: [
      { speaker: "天工", speakerType: "system", text: "第一幕存档完成。榫卯数据写入量子晶格。广安桥的灵魂，已在你指尖苏醒。" }
    ],
    choices: [
      { label: "载入下一幕", nextId: "JUMP_TO_CHAP2" },
    ],
  },
};
// ============================================================
//  useTypewriter 打字机钩子
// ============================================================
function useTypewriter(text, speed = 40, onComplete) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
        onComplete && onComplete();
      }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text]);

  return { displayed, done };
}

// ============================================================
//  DeepSeek API 调用
// ============================================================
async function callDeepSeek(userMessage) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content:
            "你现在是'叶师傅',清代川西广安桥的首席大木匠,目前以量子数字幻影的形态存在于系统中。你满脑子都是中国传统的榫卯技艺、阴阳哲学和工匠精神。你认为钢筋水泥是冷冰冰的死物,而木头是活物,懂'气韵连通'。你的说话风格:沧桑、简练、喜欢用木工原理隐喻人生哲理,称呼对方为'后生'。请根据玩家的提问给出回应,字数控制在80字以内,切忌啰嗦。",
        },
        { role: "user", content: userMessage },
      ],
    }),
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "天机混沌,老朽听不真切,去看看那木料吧。";
}
// ============================================================
//  天工 AI 建筑知识库调用
// ============================================================
async function callTiangong(userMessage, chatHistory = []) {
  const messages = [
    {
      role: "system",
      content:
        "你是'天工·量子演算系统'内置的古建筑数据库AI。你的任务是客观、专业、简明扼要地解答玩家关于中国古代建筑、榫卯结构、材料力学等常识问题。你的语气：绝对理性、像一个高科技AI、不带人类情感、称呼对方为'操作员'。字数尽量控制在100字以内。",
    },
    ...chatHistory, // 传入历史记录，让AI有上下文记忆
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 250,
      messages: messages,
    }),
  });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "数据库检索失败，请重试。";
}
// ============================================================
//  稳定度 HUD 组件
// ============================================================
function StabilityBar({ value }) {
  const color = value > 60 ? "#22d3ee" : value > 30 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "#94a3b8", fontSize: "10px", letterSpacing: "0.15em", fontFamily: "monospace" }}>
        稳定度
      </span>
      <div
        style={{
          width: 120,
          height: 6,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: color, borderRadius: 3, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span style={{ color, fontSize: "10px", fontFamily: "monospace", minWidth: 32 }}>{value}%</span>
    </div>
  );
}

// ============================================================
//  扫描网格覆层
// ============================================================
function ScanGrid() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

// ============================================================
//  媒体区组件
// ============================================================
function MediaArea({ scene, brightness, globalVolume, onMediaEnd }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => setImgError(false), [scene.mediaSrc]);

  const placeholder = (
    <div style={{
      width: "100%", height: "100%", display: "flex", 
      alignItems: "center", justifyContent: "center",
      background: "#0f172a", color: "rgba(56,189,248,0.5)",
      fontFamily: "monospace", fontSize: 12, letterSpacing: "0.2em"
    }}>
      [ 媒体信号丢失 / MEDIA NOT FOUND ]
    </div>
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {scene.mediaType === "video" ? (
        <video
          key={scene.mediaSrc}
          src={scene.mediaSrc}
          autoPlay
          playsInline
          muted 
          onEnded={() => { if (onMediaEnd) onMediaEnd(); }}
          onError={() => { if (onMediaEnd) onMediaEnd(); }} 
          ref={(el) => {
            if (el) {
              const vol = parseFloat(globalVolume);
              el.volume = Number.isFinite(vol) ? Math.max(0, Math.min(1, vol / 100)) : 0.5;
            }
          }}
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "center",
            filter: `brightness(${brightness}%)`, transition: "filter 0.3s ease",
          }}
        />
      ) : (
        <img
          src={scene.mediaSrc}
          alt="scene"
          style={{
            width: "100%", height: "100%", objectFit: "cover", objectPosition: "center",
            filter: `brightness(${brightness}%)`, transition: "filter 0.3s ease",
          }}
          onError={(e) => {
            setImgError(true);
            e.target.style.display = "none";
            if (onMediaEnd) onMediaEnd(); 
          }}
          onLoad={() => { if (onMediaEnd) onMediaEnd(); }} 
        />
      )}
      {imgError && placeholder}
      <ScanGrid />
    </div>
  );
}

// ============================================================
//  对话气泡组件
// ============================================================
function DialogBubble({ speaker, speakerType, text, isTyping }) {
  const isSystem = speakerType === "system";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Speaker label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: isSystem ? "#38bdf8" : "#fbbf24",
            boxShadow: isSystem ? "0 0 8px #38bdf8" : "0 0 8px #fbbf24",
          }}
        />
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            fontFamily: "monospace",
            color: isSystem ? "#38bdf8" : "#fbbf24",
            fontWeight: 600,
          }}
        >
          {isSystem ? "【 天工·量子演算 】" : `【 ${speaker}·数字幻影 】`}
        </span>
        {isTyping && (
          <div style={{ display: "flex", gap: 3, marginLeft: 4 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                style={{ width: 3, height: 3, borderRadius: "50%", background: "#fbbf24" }}
              />
            ))}
          </div>
        )}
      </div>
      {/* Text box */}
      <div
        style={{
          background: isSystem
            ? "linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(14,165,233,0.03) 100%)"
            : "linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(245,158,11,0.03) 100%)",
          border: isSystem ? "1px solid rgba(56,189,248,0.2)" : "1px solid rgba(251,191,36,0.25)",
          borderRadius: 4,
          padding: "10px 14px",
          boxShadow: isSystem ? "inset 0 0 20px rgba(56,189,248,0.03)" : "inset 0 0 20px rgba(251,191,36,0.04)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle shimmer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: isSystem
              ? "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)"
              : "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)",
          }}
        />
        <p
          style={{
            color: "#e2e8f0",
            fontSize: 14,
            lineHeight: 1.8,
            fontFamily: "'Noto Serif SC', 'Source Han Serif CN', STSong, serif",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          {text}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: isSystem ? "#38bdf8" : "#fbbf24",
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "blink 1s step-end infinite",
            }}
          />
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  选择按钮
// ============================================================
function ChoiceButton({ choice, onClick, index }) {
  const isCareful = choice.tag === "careful";
  const isFast = choice.tag === "fast";
  const accentColor = isCareful ? "#34d399" : isFast ? "#f87171" : "#38bdf8";

  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
        border: `1px solid ${accentColor}40`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 4,
        padding: "12px 20px",
        cursor: "pointer",
        width: "100%",
        maxWidth: "600px", 
        margin: "0 auto",  
        textAlign: "left",
        transition: "all 0.2s",
        boxShadow: `0 0 12px ${accentColor}10`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}06 100%)`;
        e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`;
        e.currentTarget.style.boxShadow = `0 0 12px ${accentColor}10`;
      }}
    >
      <ChevronRight size={14} style={{ color: accentColor, flexShrink: 0 }} />
      <span style={{ color: "#e2e8f0", fontSize: 14, fontFamily: "'Noto Serif SC', STSong, serif", letterSpacing: "0.06em" }}>
        {choice.label}
      </span>
    </motion.button>
  );
}

// ============================================================
//  自由对话输入区
// ============================================================
function FreeTalkInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", gap: 8, alignItems: "stretch", zIndex: 20, position: "relative" }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: -1, left: -1, width: 12, height: 12, borderTop: "1.5px solid rgba(251,191,36,0.6)", borderLeft: "1.5px solid rgba(251,191,36,0.6)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderBottom: "1.5px solid rgba(251,191,36,0.6)", borderRight: "1.5px solid rgba(251,191,36,0.6)", zIndex: 1, pointerEvents: "none" }} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="向叶师傅发问……（按 Enter 或点击发送）"
          disabled={isLoading}
          style={{ width: "100%", background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 3, padding: "10px 14px", color: "#fef3c7", fontSize: 13, fontFamily: "'Noto Serif SC', STSong, serif", letterSpacing: "0.06em", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", caretColor: "#fbbf24" }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(251,191,36,0.5)"; e.target.style.boxShadow = "0 0 16px rgba(251,191,36,0.1)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(251,191,36,0.2)"; e.target.style.boxShadow = "none"; }}
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={handleSend} disabled={isLoading || !input.trim()}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: input.trim() && !isLoading ? "linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.12) 100%)" : "rgba(255,255,255,0.04)", border: `1px solid ${input.trim() && !isLoading ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 3, padding: "0 16px", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", color: input.trim() && !isLoading ? "#fbbf24" : "#475569", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.1em", transition: "all 0.2s", whiteSpace: "nowrap", minWidth: 72 }}
      >
        <Send size={13} />发送
      </motion.button>
    </motion.div>
  );
}

// ============================================================
//  主游戏组件
// ============================================================
export default function GuangAnBridge({ onComplete }) {
  const [sceneId, setSceneId] = useState("0_opening");
  const [stability, setStability] = useState(75);
  
  // 🌟 新增：对话行索引状态
  const [dialogueIdx, setDialogueIdx] = useState(0);

  const [typingDone, setTypingDone] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [mediaFinished, setMediaFinished] = useState(false);
  const [brightness, setBrightness] = useState(100); 
  const [globalVolume, setGlobalVolume] = useState(50); 
  const [showSettings, setShowSettings] = useState(false); 
  const [historyStack, setHistoryStack] = useState([]);
  
  // Free talk states
  const [freeTalkPhase, setFreeTalkPhase] = useState("input"); 
  const [masterReply, setMasterReply] = useState("");
  const [freeTalkDone, setFreeTalkDone] = useState(false);
  
  // AI 侧栏状态
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: "assistant", content: "天工古建数据库已连接。检索模式就绪，请提交您要查询的建筑结构或榫卯名词。" }
  ]);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiChatHistory, showAiPanel]);

  const handleAiSubmit = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    const userText = aiInput.trim();
    const newHistory = [...aiChatHistory, { role: "user", content: userText }];
    setAiChatHistory(newHistory);
    setAiInput("");
    setIsAiLoading(true);

    try {
      const context = newHistory.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const reply = await callTiangong(userText, context);
      setAiChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (e) {
      setAiChatHistory([...newHistory, { role: "assistant", content: "[系统错误] 量子网络波动，检索中断。" }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const scene = SCENES[sceneId];
const dialogues = scene?.dialogues ?? [];
const currentDialogData = dialogues[dialogueIdx] ?? dialogues[0] ?? {
  speaker: "天工",
  speakerType: "system",
  text: "",
};
let currentText = currentDialogData.text ?? "";

  // 拦截“初见叶师傅”这幕的第一句话，拼接 AR 扫描彩蛋
  if (sceneId === "2_free_talk" && dialogueIdx === 0) {
    const scanDataStr = localStorage.getItem("ar_scan_data");
    if (scanDataStr) {
      try {
        const scanData = JSON.parse(scanDataStr);
        currentText = `（看了一眼你的扫描终端）你刚才扫的那块木头，老头子见过。那是用在${scanData.location}里的『${scanData.type}』制式。`;
      } catch (e) {
        console.error("解析扫描数据失败");
      }
    }
  }

  // 媒体没播完就给空字符串，播完了才给真实剧本
  const textToType = mediaFinished ? currentText : "";
  
  const { displayed: replyDisplayed, done: replyDone } = useTypewriter(
  masterReply,
  45
  );
  const { displayed: sceneTextDisplayed, done: sceneTextDone } = useTypewriter(
    textToType, 
    35,
    () => {
      setTypingDone(true);
      // 如果已经是最后一句台词了，才显示选项
      if (dialogueIdx === dialogues.length - 1) {
        if (!scene.isFreeTalk) setTimeout(() => setShowChoices(true), 300);
      }
    }
  );

  const [tiangongReply, setTiangongReply] = useState("");

const { displayed: systemReplyDisplayed, done: systemReplyDone } = useTypewriter(
  tiangongReply,
  35,
  () => setTimeout(() => setFreeTalkDone(true), 400)
);

  // 监听切场景：只要换了幕，强制把所有状态重置（视频变回没播完，对话重置到第0句）
  useEffect(() => {
  setDialogueIdx(0);
  setMediaFinished(false);
  setTypingDone(false);
  setShowChoices(false);
  setFreeTalkPhase("input");
  setMasterReply("");
  setTiangongReply("");
  setFreeTalkDone(false);
}, [sceneId]);

  // 🌟 新增：处理玩家点击对话框进入下一句
  const handleNextDialogLine = () => {
    // 如果字还没打完，或者已经到了最后一句，点击无效
    if (!typingDone || dialogueIdx >= scene.dialogues.length - 1) return;
    
    setDialogueIdx(prev => prev + 1);
    setTypingDone(false);
  };

  const handleChoice = useCallback((choice) => {
      if (choice.nextId === "JUMP_TO_CHAP2") {
        sessionStorage.removeItem("savedSceneIdx"); 
        if (onComplete) onComplete(); 
        return;
      }

      setHistoryStack((prev) => [...prev, { id: sceneId, stab: stability }]);

      if (SCENES[choice.nextId]?.stabilityBonus) {
        setStability((s) => Math.min(100, s + SCENES[choice.nextId].stabilityBonus));
      }
      
      setSceneId(choice.nextId);
    },
    [sceneId, stability, onComplete] 
  );

  const handleBack = () => {
    if (historyStack.length === 0) return; 
    const newStack = [...historyStack];
    const lastState = newStack.pop(); 
    
    setHistoryStack(newStack); 
    setSceneId(lastState.id);  
    setStability(lastState.stab); 
  };

  const handleFreeTalkSubmit = async (userMsg) => {
    setFreeTalkPhase("loading");
    try {
      const reply = await callDeepSeek(userMsg);
      setMasterReply(reply);
      
      // 根据玩家问题生成天工的接话
      if (userMsg.includes("钢筋") || userMsg.includes("水泥")) {
        setTiangongReply("我记录了您说的'气'。我会尝试在力学模型里找到对应的参数。");
      } else {
        setTiangongReply("已收录非结构性数据。正在通过知识图谱将其参数化。");
      }
      
      setFreeTalkPhase("master_reply");
    } catch (e) {
      setMasterReply("天机混沌，老朽听不真切。");
      setTiangongReply("检测到量子噪点，对话数据丢失。");
      setFreeTalkPhase("master_reply");
    }
  };
  const isFreeTalk = scene.isFreeTalk;
  const isLastDialogLine = dialogueIdx >= dialogues.length - 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
        * { box-sizing: border-box; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 2px; }
        input::placeholder { color: rgba(251,191,36,0.3); }
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #00F0FF; cursor: pointer; box-shadow: 0 0 10px #00F0FF; margin-top: -5px;}
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 2px; cursor: pointer; background: rgba(56,189,248,0.3); border-radius: 1px; }
      `}</style>
<div style={{ 
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        display: "flex", justifyContent: "center", alignItems: "center", 
        background: "#020617", 
        backgroundImage: "linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        zIndex: 9999 
      }}>
        {/* ── 左侧全息装饰背景 ── */}
        <div className="hidden md:flex" style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: "100px", pointerEvents: "none", zIndex: 1, flexDirection: "column", justifyContent: "space-between", padding: "80px 0" }}>
          <div style={{ writingMode: "vertical-rl", color: "rgba(56,189,248,0.25)", fontFamily: "monospace", fontSize: 10, letterSpacing: "6px", transform: "rotate(180deg)" }}>
            QUANTUM_TENSOR_FIELD // ACTIVE_NODE_01
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, borderRight: "1px solid rgba(56,189,248,0.15)", paddingRight: 8, opacity: 0.6 }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ width: i % 3 === 0 ? 12 : 6, height: 1, background: "rgba(56,189,248,0.5)", alignSelf: "flex-end" }} />
            ))}
          </div>
        </div>

        {/* ── 右侧全息装饰背景 ── */}
        <div className="hidden md:flex" style={{ position: "absolute", right: 20, top: 0, bottom: 0, width: "100px", pointerEvents: "none", zIndex: 1, flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", padding: "80px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, opacity: 0.8 }}>
            <div style={{ color: "rgba(56,189,248,0.4)", fontSize: 10, fontFamily: "monospace" }}>SYS.MEM</div>
            <div style={{ width: 40, height: 2, background: "rgba(56,189,248,0.1)" }}><div style={{ width: "70%", height: "100%", background: "#38bdf8", boxShadow: "0 0 5px #38bdf8" }}/></div>
            <div style={{ color: "rgba(56,189,248,0.4)", fontSize: 10, fontFamily: "monospace", marginTop: 10 }}>SYS.NET</div>
            <div style={{ width: 40, height: 2, background: "rgba(56,189,248,0.1)" }}><div style={{ width: "90%", height: "100%", background: "#38bdf8", boxShadow: "0 0 5px #38bdf8" }}/></div>
          </div>
          <div style={{ writingMode: "vertical-rl", color: "rgba(56,189,248,0.25)", fontFamily: "monospace", fontSize: 10, letterSpacing: "6px" }}>
            SYNCHRONIZING_TIMELINE...
          </div>
        </div>

        {/* 👇 居中的主画面盒子 👇 */}
        <div style={{ position: "relative", width: "100%", maxWidth: "1280px", height: "100%", maxHeight: "800px", display: "flex", flexDirection: "column", background: "#020617", overflow: "hidden", fontFamily: "monospace", boxShadow: "0 0 40px rgba(0,0,0,0.8), 0 0 15px rgba(56,189,248,0.1)", borderLeft: "1px solid rgba(56,189,248,0.15)", borderRight: "1px solid rgba(56,189,248,0.15)", zIndex: 2 }}>
          
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.15), transparent)", animation: "scanline 8s linear infinite", pointerEvents: "none", zIndex: 100 }} />

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setShowSettings(!showSettings)}
            style={{ position: "absolute", right: 20, top: 64, zIndex: 51, background: showSettings ? "rgba(56, 189, 248, 0.2)" : "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 0 10px rgba(56,189,248,0.2)", color: "#38bdf8", transition: "background 0.3s" }}
          >
            <Settings size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAiPanel(true)}
            style={{ position: "absolute", right: 66, top: 64, zIndex: 51, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "50%", width: 36, height: 36, display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", boxShadow: "0 0 10px rgba(56,189,248,0.2)", color: "#38bdf8" }}
          >
            <BookOpen size={16} />
          </motion.button>

          <AnimatePresence>
            {showAiPanel && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{ position: "absolute", right: 20, top: 110, bottom: 20, width: "320px", zIndex: 100, display: "flex", flexDirection: "column", background: "rgba(2, 6, 23, 0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(56, 189, 248, 0.4)", borderRadius: "8px", boxShadow: "-4px 0 20px rgba(0,0,0,0.5), 0 0 15px rgba(56,189,248,0.15)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(56,189,248,0.2)", background: "rgba(56,189,248,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Cpu size={14} color="#38bdf8" />
                    <span style={{ color: "#38bdf8", fontSize: 12, letterSpacing: "0.1em", fontWeight: "bold" }}>天工·古建检索终端</span>
                  </div>
                  <X size={16} color="rgba(56,189,248,0.5)" style={{ cursor: "pointer" }} onClick={() => setShowAiPanel(false)} />
                </div>
                <div ref={chatScrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {aiChatHistory.map((msg, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <span style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", marginBottom: 4 }}>{msg.role === "user" ? "操作员" : "天工系统"}</span>
                      <div style={{ background: msg.role === "user" ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.05)", border: msg.role === "user" ? "1px solid rgba(56,189,248,0.3)" : "1px solid rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px", maxWidth: "90%", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(56,189,248,0.7)", fontSize: 12 }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Loader2 size={14} /></motion.div>
                      检索数据库中...
                    </div>
                  )}
                </div>
                <div style={{ padding: "12px", borderTop: "1px solid rgba(56,189,248,0.2)" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()} placeholder="输入建筑名词..." disabled={isAiLoading}
                      style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 4, padding: "8px 12px", color: "#e2e8f0", fontSize: 12, outline: "none" }}
                    />
                    <button onClick={handleAiSubmit} disabled={isAiLoading || !aiInput.trim()} style={{ background: "rgba(56,189,248,0.2)", border: "1px solid rgba(56,189,248,0.5)", color: "#38bdf8", borderRadius: 4, padding: "0 12px", cursor: isAiLoading || !aiInput.trim() ? "not-allowed" : "pointer" }}>
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ position: "absolute", right: 20, top: 110, zIndex: 50, display: "flex", flexDirection: "column", gap: 16, padding: "16px", background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(56,189,248,0.1)", transformOrigin: "top right" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Sun size={16} color="#38bdf8" />
                  <input type="range" min="30" max="150" value={brightness} onChange={(e) => setBrightness(e.target.value)} style={{ width: "80px" }} />
                  <span style={{ color: "#38bdf8", fontSize: "10px", width: "30px", textAlign: "right" }}>{brightness}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Volume2 size={16} color="#38bdf8" />
                  <input type="range" min="0" max="100" value={globalVolume} onChange={(e) => setGlobalVolume(e.target.value)} style={{ width: "80px" }} />
                  <span style={{ color: "#38bdf8", fontSize: "10px", width: "30px", textAlign: "right" }}>{globalVolume}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ flexShrink: 0, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid rgba(56,189,248,0.12)", background: "rgba(2,6,23,0.9)", backdropFilter: "blur(8px)", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AnimatePresence>
                {historyStack.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, width: 0, padding: 0, marginRight: 0 }}
                    animate={{ opacity: 1, width: "auto", padding: "4px", marginRight: 8 }}
                    exit={{ opacity: 0, width: 0, padding: 0, marginRight: 0 }}
                    onClick={handleBack}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 4, cursor: "pointer", color: "#38bdf8", overflow: "hidden" }}
                    whileHover={{ scale: 1.05, background: "rgba(56,189,248,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    title="返回上一幕"
                  >
                    <Undo2 size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 10px #38bdf8", position: "relative" }}><div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1px solid rgba(56,189,248,0.4)", animation: "pulse-ring 2s ease-out infinite" }} /></motion.div>
              <span style={{ color: "#38bdf8", fontSize: 12, letterSpacing: "0.25em", fontWeight: 400 }}>天工·量子演算系统 <span style={{ color: "rgba(56,189,248,0.4)" }}>v2.7.1</span></span>
              <div style={{ display: "flex", gap: 5, marginLeft: 8 }}>{[Cpu, Radio, Wifi].map((Icon, i) => (<motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}><Icon size={10} style={{ color: "#38bdf8" }} /></motion.div>))}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ color: "rgba(148,163,184,0.4)", fontSize: 10, letterSpacing: "0.15em" }}>{sceneId.toUpperCase()}</span><StabilityBar value={stability} /></div>
          </div>

          {/* 🌟 媒体层：增加了模糊滤镜和缓动动画，实现黑屏水墨渐变感 */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000" }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={sceneId + "_media"} 
                initial={{ opacity: 0, filter: "blur(20px) grayscale(100%)" }} 
                animate={{ opacity: 1, filter: "blur(0px) grayscale(0%)" }} 
                exit={{ opacity: 0, filter: "blur(20px) grayscale(100%)" }} 
                transition={{ duration: 1.5, ease: "easeInOut" }} 
                style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              >
                <MediaArea scene={scene} brightness={brightness} globalVolume={globalVolume} onMediaEnd={() => setMediaFinished(true)} />
              </motion.div>
            </AnimatePresence>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.95))", pointerEvents: "none", zIndex: 3 }} />   
          </div>

          {/* 底部对话区 */}
          <AnimatePresence mode="wait">
            {mediaFinished && (
              <motion.div 
                key={sceneId + "_dialog"} 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                style={{ flexShrink: 0, minHeight: "220px", maxHeight: "45vh", overflowY: "auto", background: "rgba(2,6,23,0.95)", borderTop: "1px solid rgba(56,189,248,0.2)", padding: "24px 20px", zIndex: 10 }}
              >
                <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
                  
                  <div onClick={handleNextDialogLine} style={{ cursor: (!typingDone || isLastDialogLine) ? "default" : "pointer", position: "relative" }}>
                    <DialogBubble speaker={currentDialogData.speaker} speakerType={currentDialogData.speakerType} text={sceneTextDisplayed} isTyping={!typingDone} />
                    {typingDone && !isLastDialogLine && (
                      <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: "absolute", right: 20, bottom: -10, color: "#38bdf8" }}>
                        <ChevronDown size={20} />
                      </motion.div>
                    )}
                  </div>
                  
                  {isFreeTalk && typingDone && isLastDialogLine && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      
                      {freeTalkPhase === "input" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <input id="freetalk-input" placeholder="向叶师傅发问……" style={{ flex: 1, background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 3, padding: "10px 14px", color: "#fef3c7", outline: "none" }} />
                          <button onClick={() => handleFreeTalkSubmit(document.getElementById("freetalk-input").value)} 
                          style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 3, padding: "0 16px", color: "#fbbf24", cursor: "pointer" }}>发送</button>
                        </div>
                      )}
                      
                      {freeTalkPhase === "loading" && (<div style={{ color: "#fbbf24", fontSize: 13 }}>叶师傅抽了一口旱烟，正在思索……</div>)}
                      
                      {/* 叶师傅回复 */}
                      {(freeTalkPhase === "master_reply" || freeTalkPhase === "system_reply") && (
                        <DialogBubble speaker="叶师傅" speakerType="master" text={replyDisplayed} isTyping={!replyDone} />
                      )}

                      {/* 🌟 增加过渡按钮，叶师傅说完后，点击继续听天工接话 */}
                      {freeTalkPhase === "master_reply" && replyDone && (
                        <button onClick={() => setFreeTalkPhase("system_reply")} style={{ alignSelf: "flex-end", background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", fontSize: 13 }}>
                          继续听天工分析 &gt;&gt;
                        </button>
                      )}

                      {/* 天工动态接话 */}
                      {freeTalkPhase === "system_reply" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           <DialogBubble speaker="天工" speakerType="system" text={systemReplyDisplayed} isTyping={!systemReplyDone} />
                        </motion.div>
                      )}

                    </div>
                  )}
                  
                  <AnimatePresence>
                    {(showChoices || (isFreeTalk && freeTalkDone)) && isLastDialogLine && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {isFreeTalk && freeTalkDone && (<ChoiceButton choice={{ label: "继续勘察四周", nextId: "3_scan_wood" }} onClick={() => handleChoice({ label: "继续勘察四周", nextId: "3_scan_wood" })} index={0} />)}
                        {!isFreeTalk && showChoices && scene.choices.map((choice, i) => (<ChoiceButton key={choice.nextId} choice={choice} onClick={() => handleChoice(choice)} index={i} />))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
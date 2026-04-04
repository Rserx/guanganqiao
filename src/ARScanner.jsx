// src/components/ARScanner.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function ARScanner({ onComplete, onSkip }) {
  const videoRef = useRef(null);
  const [scanState, setScanState] = useState('initializing'); // initializing, scanning, analyzing, success
  const [scanResult, setScanResult] = useState(null);

  // 预设的知识图谱假数据
  const knowledgeGraph = [
    { type: '直榫', location: '泰顺廊桥·中间节点', match: '63%' },
    { type: '燕尾榫', location: '应县木塔·二层平座', match: '78%' },
    { type: '馒头榫', location: '故宫太和殿·柱础', match: '82%' }
  ];

  useEffect(() => {
    // 调用后置摄像头
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" } // 优先使用后置摄像头
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setScanState('scanning');
      } catch (err) {
        console.error("摄像头调用失败", err);
        // 如果没有摄像头权限，直接跳过
        onSkip();
      }
    };
    startCamera();

    // 组件卸载时关闭摄像头
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartScan = () => {
    setScanState('analyzing');
    
    // 模拟AI分析过程 (2.5秒)
    setTimeout(() => {
      // 随机抽取一个结果
      const randomResult = knowledgeGraph[Math.floor(Math.random() * knowledgeGraph.length)];
      setScanResult(randomResult);
      setScanState('success');
      
      // 保存到本地存储供叶师傅读取
      localStorage.setItem('ar_scan_data', JSON.stringify(randomResult));
      
      // 3秒后进入主线
      setTimeout(() => {
        onComplete();
      }, 4000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* 摄像头视频流 */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* 扫描框 UI (Tailwind) */}
      <div className="relative w-72 h-72 border-2 border-cyan-500/50 flex items-center justify-center">
        {/* 四个角的装饰 */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400"></div>

        {/* 扫描线动画 */}
        {scanState === 'analyzing' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-[scan_1.5s_ease-in-out_infinite]"></div>
        )}
      </div>

      {/* 状态提示文字 */}
      <div className="z-10 mt-8 text-center text-cyan-300 font-mono">
        {scanState === 'scanning' && (
          <div>
            <p className="mb-4">请将镜头对准木质结构</p>
            <button onClick={handleStartScan} className="px-6 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/20">
              提取结构特征
            </button>
            <button onClick={onSkip} className="block mt-4 text-sm text-gray-400 underline mx-auto">
              跳过
            </button>
          </div>
        )}
        
        {scanState === 'analyzing' && <p className="animate-pulse">AI 轮廓提取中，正在连接古建知识图谱...</p>}
        
        {scanState === 'success' && scanResult && (
          <div className="bg-black/70 p-4 border border-cyan-500 text-left max-w-sm">
            <p className="text-green-400">✅ 匹配完成</p>
            <p className="text-sm mt-2 text-white">检测到 <span className="text-cyan-400 font-bold">[{scanResult.type}]</span> 结构特征。</p>
            <p className="text-sm text-gray-300">最近似案例：{scanResult.location}，相似度 {scanResult.match}。</p>
            <p className="text-xs text-gray-500 mt-2">该数据已匿名上传至公共古建知识库，感谢您的贡献。</p>
          </div>
        )}
      </div>
    </div>
  );
}
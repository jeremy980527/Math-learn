// 確保畫面載入完成後才執行
document.addEventListener("DOMContentLoaded", () => {
    
    const courseData = [
        {
            teachTitle: "什麼是矩陣？",
            teachContent: "別被『矩陣』這個高深莫測的詞嚇到了！它其實就像是一個<b>『有格子的便當盒』</b>。<br><br>數學家因為懶得寫一堆文字，所以發明了這個盒子，把數字整齊地排成好幾橫排（我們叫它『列 Row』）跟直排（我們叫它『行 Column』）。",
            teachMath: "$$ \\text{便當盒} = \\begin{bmatrix} 滷蛋 & 排骨 \\\\ 高麗菜 & 香腸 \\end{bmatrix} $$",
            quizQuestion: "請問『矩陣』的概念最接近日常生活中的什麼東西？",
            options: ["隨便亂丟玩具的抽屜", "有固定格子的收納盒或便當盒", "一顆圓形的籃球"],
            correctAnswer: 1
        },
        {
            teachTitle: "矩陣的加法",
            teachContent: "矩陣相加超級直覺！就像是把兩個長得一模一樣的便當盒疊在一起。<br><br><b>『左上角』加『左上角』，『右下角』加『右下角』。</b><br><br>⚠️ 注意：如果兩個便當盒的『形狀大小』不一樣，硬疊在一起會掉出來，所以是<b>不能相加</b>的喔！",
            teachMath: "$$ \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 10 & 10 \\\\ 10 & 10 \\end{bmatrix} = \\begin{bmatrix} 11 & 12 \\\\ 13 & 14 \\end{bmatrix} $$",
            quizQuestion: "計算以下兩個『便當盒』相加的結果：",
            quizMath: "$$ \\begin{bmatrix} 2 & 5 \\\\ 1 & 0 \\end{bmatrix} + \\begin{bmatrix} 3 & 1 \\\\ 4 & 2 \\end{bmatrix} = ? $$",
            options: [
                "$$ \\begin{bmatrix} 5 & 6 \\\\ 5 & 2 \\end{bmatrix} $$",
                "$$ \\begin{bmatrix} 6 & 5 \\\\ 4 & 0 \\end{bmatrix} $$"
            ],
            correctAnswer: 0
        },
        {
            teachTitle: "純量乘法 (係數積)",
            teachContent: "如果有人說：『我要買 3 份一樣的便當！』<br><br>那很簡單，你只要把便當盒裡的<b>『每一個菜色』都乘上 3 倍</b>就好了。外面的數字會公平地發送給矩陣裡面的每一個元素。",
            teachMath: "$$ 3 \\times \\begin{bmatrix} 2 & 1 \\\\ 0 & 4 \\end{bmatrix} = \\begin{bmatrix} 6 & 3 \\\\ 0 & 12 \\end{bmatrix} $$",
            quizQuestion: "如果將矩陣乘上 2 倍，結果會是？",
            quizMath: "$$ 2 \\times \\begin{bmatrix} 3 & -1 \\\\ 5 & 2 \\end{bmatrix} = ? $$",
            options: [
                "$$ \\begin{bmatrix} 6 & -1 \\\\ 5 & 2 \\end{bmatrix} $$",
                "$$ \\begin{bmatrix} 6 & -2 \\\\ 10 & 4 \\end{bmatrix} $$"
            ],
            correctAnswer: 1
        }
    ];

    let currentNodeIndex = 0; 
    let playingNodeIndex = 0; 
    let currentPhase = 'teach'; 
    let selectedOption = null;

    const viewMap = document.getElementById('view-map');
    const viewLesson = document.getElementById('view-lesson');
    const mapContainer = document.getElementById('map-path-container');
    const teachCard = document.getElementById('teaching-card');
    const quizCard = document.getElementById('quiz-card');
    const actionBtn = document.getElementById('action-btn');
    const feedbackMsg = document.getElementById('feedback-msg');
    const closeBtn = document.getElementById('close-lesson-btn');

    // 1. 生成 S 型路線地圖
    function renderMap() {
        mapContainer.innerHTML = '';
        const totalNodes = 8; // 產生8個圈圈
        
        // 為了讓路線由下往上，陣列反向輸出
        for (let i = totalNodes - 1; i >= 0; i--) {
            const row = document.createElement('div');
            row.className = 'node-row';
            
            // 使用 Math.sin 創造完美的 S 型左右偏移，使用 vw (視窗寬度) 確保手機與電腦比例皆正確
            const offset = Math.sin(i * 1.2) * 25; 
            row.style.transform = `translateX(${offset}vw)`;

            const node = document.createElement('div');
            node.className = 'node';
            
            if (i < currentNodeIndex) {
                node.classList.add('unlocked');
                node.innerHTML = '✔️';
            } else if (i === currentNodeIndex) {
                node.classList.add('current');
                node.innerHTML = '📝';
            } else {
                node.innerHTML = '🔒';
            }

            node.onclick = () => {
                if (i <= currentNodeIndex && i < courseData.length) {
                    startLesson(i);
                }
            };

            row.appendChild(node);
            mapContainer.appendChild(row);
        }
    }

    // 2. 開始課程
    function startLesson(index) {
        playingNodeIndex = index;
        currentPhase = 'teach';
        selectedOption = null;
        
        viewMap.style.display = 'none';
        viewLesson.style.display = 'flex';
        window.scrollTo(0, 0); // 確保回到最上方
        
        document.getElementById('lesson-progress-fill').style.width = '33%';
        feedbackMsg.style.display = 'none';
        
        actionBtn.style.backgroundColor = 'var(--primary)';
        actionBtn.style.boxShadow = '0 6px 0 var(--primary-shadow)';
        actionBtn.textContent = '懂了，來挑戰吧！';
        actionBtn.disabled = false;

        const data = courseData[index];
        document.getElementById('teach-title').innerHTML = data.teachTitle;
        document.getElementById('teach-content').innerHTML = data.teachContent;
        document.getElementById('teach-math').innerHTML = data.teachMath || '';

        teachCard.classList.add('active');
        quizCard.classList.remove('active');

        renderMathSafe();
    }

    // 3. 顯示測驗
    function showQuiz() {
        currentPhase = 'quiz';
        document.getElementById('lesson-progress-fill').style.width = '66%';
        
        teachCard.classList.remove('active');
        quizCard.classList.add('active');
        
        actionBtn.textContent = '檢查答案';
        actionBtn.disabled = true;

        const data = courseData[playingNodeIndex];
        document.getElementById('quiz-question').innerHTML = data.quizQuestion;
        document.getElementById('quiz-math').innerHTML = data.quizMath || '';
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        data.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'opt-btn';
            btn.innerHTML = opt;
            btn.onclick = () => {
                if (currentPhase !== 'quiz') return; 
                document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOption = idx;
                actionBtn.disabled = false;
            };
            optionsContainer.appendChild(btn);
        });

        renderMathSafe();
    }

    // 4. 點擊按鈕邏輯
    actionBtn.onclick = () => {
        if (currentPhase === 'teach') showQuiz();
        else if (currentPhase === 'quiz') checkAnswer();
        else if (currentPhase === 'feedback') finishLesson();
    };

    // 5. 檢查答案
    function checkAnswer() {
        const data = courseData[playingNodeIndex];
        currentPhase = 'feedback';
        feedbackMsg.style.display = 'block';

        if (selectedOption === data.correctAnswer) {
            document.getElementById('lesson-progress-fill').style.width = '100%';
            feedbackMsg.innerHTML = '🎉 完全正確！你掌握了訣竅。';
            feedbackMsg.style.color = '#58cc02';
            
            actionBtn.textContent = '繼續';
            actionBtn.style.backgroundColor = '#1cb0f6'; // Duolingo 過關藍
            actionBtn.style.boxShadow = '0 6px 0 #1899d6';
            
            if (playingNodeIndex === currentNodeIndex) {
                currentNodeIndex++;
            }
        } else {
            feedbackMsg.innerHTML = '❌ 哎呀，再想一下便當盒的比喻！';
            feedbackMsg.style.color = 'var(--wrong-bg)';
            quizCard.classList.remove('shake');
            void quizCard.offsetWidth;
            quizCard.classList.add('shake');
            
            actionBtn.textContent = '再試一次';
            actionBtn.style.backgroundColor = 'var(--wrong-bg)';
            actionBtn.style.boxShadow = '0 6px 0 #cc0000';
            currentPhase = 'quiz';
        }
    }

    // 6. 結束/關閉課程
    function finishLesson() {
        viewLesson.style.display = 'none';
        viewMap.style.display = 'block';
        renderMap();
    }

    closeBtn.onclick = finishLesson;

    // 7. 防呆 KaTeX 渲染
    function renderMathSafe() {
        try {
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        } catch (e) {
            console.error("數學公式渲染失敗:", e);
        }
    }

    // 初始啟動
    renderMap();
});

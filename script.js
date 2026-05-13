// 講人話的教學與測驗題庫
const courseData = [
    {
        id: 0,
        type: "node",
        teachTitle: "什麼是矩陣？",
        teachContent: "別被『矩陣』這個高深莫測的詞嚇到了！它其實就像是一個<b>『有格子的便當盒』</b>。<br><br>數學家因為懶得寫一堆文字，所以發明了這個盒子，把數字整齊地排成好幾橫排（我們叫它『列 Row』）跟直排（我們叫它『行 Column』）。",
        teachMath: "$$ \\text{便當盒} = \\begin{bmatrix} 滷蛋 & 排骨 \\\\ 高麗菜 & 香腸 \\end{bmatrix} $$",
        quizQuestion: "請問『矩陣』的概念最接近日常生活中的什麼東西？",
        options: ["隨便亂丟玩具的抽屜", "有固定格子的收納盒/便當盒", "一顆圓形的籃球"],
        correctAnswer: 1
    },
    {
        id: 1,
        type: "node",
        teachTitle: "矩陣的加法",
        teachContent: "矩陣相加超級直覺！就像是把兩個長得一模一樣的便當盒疊在一起。<br><br><b>『左上角』加『左上角』，『右下角』加『右下角』。</b><br><br>⚠️ 注意：如果兩個便當盒的『形狀大小（維度）』不一樣，硬疊在一起會掉出來，所以是<b>不能相加</b>的喔！",
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
        id: 2,
        type: "node",
        teachTitle: "純量乘法 (係數積)",
        teachContent: "如果有人說：『我要買 3 份一樣的便當！』<br><br>那很簡單，你只要把便當盒裡的<b>『每一個菜色』都乘上 3 倍</b>就好了。這在數學上叫做『純量乘法』，外面的數字會公平地發送給矩陣裡面的每一個元素。",
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

// 狀態變數
let currentNodeIndex = 0; // 用戶目前解鎖到第幾關
let playingNodeIndex = 0; // 用戶現在點擊正在玩的關卡
let currentPhase = 'teach'; // 'teach' -> 'quiz' -> 'feedback'
let selectedOption = null;

// DOM 元素
const viewMap = document.getElementById('view-map');
const viewLesson = document.getElementById('view-lesson');
const mapContainer = document.getElementById('map-path-container');
const teachCard = document.getElementById('teaching-card');
const quizCard = document.getElementById('quiz-card');
const actionBtn = document.getElementById('action-btn');
const feedbackMsg = document.getElementById('feedback-msg');
const bottomNav = document.getElementById('bottom-nav');
const streakText = document.getElementById('streak-text');

// 1. 產生 S 型地圖 (利用 Math.sin 產生波浪位移)
function renderMap() {
    mapContainer.innerHTML = '';
    // 為了讓路線是從下往上，我們反轉陣列的視覺渲染
    const totalNodes = 10; // 總共顯示10個圈圈，即使後面是空的預留關卡
    
    for (let i = totalNodes - 1; i >= 0; i--) {
        const wrapper = document.createElement('div');
        wrapper.className = 'node-wrapper';
        
        // 使用 Sine 波浪產生左右偏移，製造 S 型路線
        const offset = Math.sin(i * 0.8) * 80; 
        wrapper.style.transform = `translateX(${offset}px)`;

        const node = document.createElement('div');
        node.className = 'node';
        
        // 判斷節點狀態
        if (i < currentNodeIndex) {
            node.classList.add('unlocked');
            node.innerHTML = '✔️';
        } else if (i === currentNodeIndex) {
            node.classList.add('current');
            node.innerHTML = '🌟';
        } else {
            node.innerHTML = '🔒';
        }

        // 綁定點擊事件 (只能點擊已解鎖或當前關卡，且要有對應的資料)
        node.onclick = () => {
            if (i <= currentNodeIndex && i < courseData.length) {
                startLesson(i);
            }
        };

        wrapper.appendChild(node);
        mapContainer.appendChild(wrapper);
    }
}

// 2. 開始課程 (切換至教學畫面)
function startLesson(index) {
    playingNodeIndex = index;
    currentPhase = 'teach';
    selectedOption = null;
    
    // 切換 UI 視圖
    viewMap.classList.remove('active');
    bottomNav.style.display = 'none';
    viewLesson.classList.add('active');
    
    // 重設按鈕與進度條
    document.getElementById('lesson-progress-fill').style.width = '50%';
    feedbackMsg.style.display = 'none';
    actionBtn.style.backgroundColor = 'var(--primary)';
    actionBtn.style.boxShadow = '0 5px 0 var(--primary-shadow)';
    actionBtn.textContent = '懂了，來挑戰吧！';
    actionBtn.disabled = false;

    // 載入教學內容
    const data = courseData[index];
    document.getElementById('teach-title').innerHTML = data.teachTitle;
    document.getElementById('teach-content').innerHTML = data.teachContent;
    document.getElementById('teach-math').innerHTML = data.teachMath || '';

    teachCard.classList.add('active');
    quizCard.classList.remove('active');

    renderMath();
}

// 3. 進入測驗畫面
function showQuiz() {
    currentPhase = 'quiz';
    document.getElementById('lesson-progress-fill').style.width = '80%';
    
    teachCard.classList.remove('active');
    quizCard.classList.add('active');
    
    actionBtn.textContent = '檢查';
    actionBtn.disabled = true; // 需選擇選項才能檢查

    const data = courseData[playingNodeIndex];
    document.getElementById('quiz-question').innerHTML = data.quizQuestion;
    document.getElementById('quiz-math').innerHTML = data.quizMath || '';
    
    const optionsGrid = document.getElementById('options-container');
    optionsGrid.innerHTML = '';
    data.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerHTML = opt;
        btn.onclick = () => {
            if (currentPhase !== 'quiz') return; // 已經送出答案就不給點
            document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedOption = idx;
            actionBtn.disabled = false;
        };
        optionsGrid.appendChild(btn);
    });

    renderMath();
}

// 4. 底部按鈕邏輯控制器
actionBtn.onclick = () => {
    if (currentPhase === 'teach') {
        showQuiz();
    } 
    else if (currentPhase === 'quiz') {
        checkAnswer();
    } 
    else if (currentPhase === 'feedback') {
        finishLesson();
    }
};

// 5. 檢查答案
function checkAnswer() {
    const data = courseData[playingNodeIndex];
    currentPhase = 'feedback';
    feedbackMsg.style.display = 'block';

    if (selectedOption === data.correctAnswer) {
        // 答對
        document.getElementById('lesson-progress-fill').style.width = '100%';
        feedbackMsg.innerHTML = '🎉 太棒了！你完全聽懂了。';
        feedbackMsg.style.color = '#58cc02';
        
        actionBtn.textContent = '繼續';
        actionBtn.style.backgroundColor = '#58cc02';
        actionBtn.style.boxShadow = '0 5px 0 #46a302';
        
        // 若是新關卡則解鎖下一關
        if (playingNodeIndex === currentNodeIndex) {
            currentNodeIndex++;
            streakText.textContent = parseInt(streakText.textContent) + 1;
        }
    } else {
        // 答錯
        feedbackMsg.innerHTML = '❌ 哎呀，再仔細想想剛剛的便當盒比喻。';
        feedbackMsg.style.color = 'var(--wrong-bg)';
        quizCard.classList.remove('shake');
        void quizCard.offsetWidth;
        quizCard.classList.add('shake');
        
        actionBtn.textContent = '再試一次';
        actionBtn.style.backgroundColor = 'var(--wrong-bg)';
        actionBtn.style.boxShadow = '0 5px 0 #cc0000';
        currentPhase = 'quiz'; // 讓按鈕再次觸發檢查
    }
}

// 6. 結束課程回到地圖
function finishLesson() {
    viewLesson.classList.remove('active');
    viewMap.classList.add('active');
    bottomNav.style.display = 'flex';
    renderMap(); // 重新渲染地圖更新進度
}

// 觸發 KaTeX 渲染
function renderMath() {
    renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
}

// 初始化
window.onload = () => {
    renderMap();
};

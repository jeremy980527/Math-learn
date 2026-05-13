// 題庫資料結構
const courseData = [
    {
        unit: 1,
        title: "矩陣基礎運算",
        questions: [
            {
                text: "計算以下矩陣相加的結果：",
                math: "$$ \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & -1 \\\\ 0 & 2 \\end{bmatrix} $$",
                options: [
                    "$$ \\begin{bmatrix} 6 & 1 \\\\ 3 & 6 \\end{bmatrix} $$",
                    "$$ \\begin{bmatrix} 5 & -2 \\\\ 0 & 8 \\end{bmatrix} $$",
                    "$$ \\begin{bmatrix} 6 & 3 \\\\ 3 & 6 \\end{bmatrix} $$"
                ],
                correctAnswer: 0
            },
            {
                text: "純量乘法：計算係數積",
                math: "$$ 3 \\times \\begin{bmatrix} 2 & -1 \\\\ 4 & 0 \\end{bmatrix} $$",
                options: [
                    "$$ \\begin{bmatrix} 6 & -1 \\\\ 12 & 0 \\end{bmatrix} $$",
                    "$$ \\begin{bmatrix} 6 & -3 \\\\ 12 & 0 \\end{bmatrix} $$",
                    "$$ \\begin{bmatrix} 5 & 2 \\\\ 7 & 3 \\end{bmatrix} $$"
                ],
                correctAnswer: 1
            }
        ]
    },
    {
        unit: 2,
        title: "矩陣乘法",
        questions: [
            {
                text: "判斷以下矩陣相乘後的維度：",
                math: "一個 $2 \\times 3$ 的矩陣乘上一個 $3 \\times 4$ 的矩陣，結果的維度為何？",
                options: [
                    "$2 \\times 4$",
                    "$3 \\times 3$",
                    "無法相乘"
                ],
                correctAnswer: 0
            },
            {
                text: "計算矩陣內積：",
                math: "$$ \\begin{bmatrix} 1 & 2 \\end{bmatrix} \\begin{bmatrix} 3 \\\\ 4 \\end{bmatrix} $$",
                options: [
                    "$$ \\begin{bmatrix} 11 \\end{bmatrix} $$",
                    "$$ \\begin{bmatrix} 3 & 8 \\end{bmatrix} $$",
                    "$$ \\begin{bmatrix} 4 & 6 \\end{bmatrix} $$"
                ],
                correctAnswer: 0
            }
        ]
    }
];

// 狀態變數
let currentUnitIndex = 0;
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let isAnswerChecked = false;

// DOM 元素
const themeToggle = document.getElementById('theme-toggle');
const streakCountElem = document.getElementById('streak-count');
const streakContainer = document.getElementById('streak-container');
const unitPathElem = document.getElementById('unit-path');
const unitBadgeElem = document.getElementById('current-unit-badge');
const questionTextElem = document.getElementById('question-text');
const mathEquationElem = document.getElementById('math-equation');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const feedbackElem = document.getElementById('feedback-message');
const questionCard = document.getElementById('question-card');

// 1. 黑白模式切換
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// 2. 連續學習火焰 (Streak)
function initStreak() {
    let streak = parseInt(localStorage.getItem('streak')) || 0;
    let lastDate = localStorage.getItem('lastStudyDate');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        // 若不是今天，檢查是否是昨天（延續邏輯可更嚴謹，這裡簡化）
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate !== yesterday.toDateString() && lastDate != null) {
            streak = 0; // 斷掉連擊
        }
    }
    streakCountElem.textContent = streak;
}

function updateStreak() {
    const today = new Date().toDateString();
    let lastDate = localStorage.getItem('lastStudyDate');
    if (lastDate !== today) {
        let streak = parseInt(localStorage.getItem('streak')) || 0;
        streak++;
        localStorage.setItem('streak', streak);
        localStorage.setItem('lastStudyDate', today);
        streakCountElem.textContent = streak;
        streakContainer.classList.add('fire-anim');
        setTimeout(() => streakContainer.classList.remove('fire-anim'), 500);
    }
}

// 3. 渲染左側學習路徑
function renderPath() {
    unitPathElem.innerHTML = '';
    courseData.forEach((unit, index) => {
        const node = document.createElement('div');
        node.className = `unit-node ${index === currentUnitIndex ? 'active' : ''}`;
        node.textContent = `單元 ${unit.unit}: ${unit.title}`;
        node.onclick = () => {
            currentUnitIndex = index;
            currentQuestionIndex = 0;
            renderPath();
            loadQuestion();
        };
        unitPathElem.appendChild(node);
    });
}

// 4. 載入題目
function loadQuestion() {
    isAnswerChecked = false;
    selectedOptionIndex = null;
    submitBtn.textContent = "檢查答案";
    submitBtn.disabled = true;
    submitBtn.className = "btn primary-btn";
    feedbackElem.textContent = "";
    feedbackElem.className = "feedback";
    questionCard.classList.remove('shake');

    const unit = courseData[currentUnitIndex];
    const q = unit.questions[currentQuestionIndex];

    unitBadgeElem.textContent = `單元 ${unit.unit} - 第 ${currentQuestionIndex + 1} 關`;
    questionTextElem.textContent = q.text;
    mathEquationElem.innerHTML = q.math;

    optionsContainer.innerHTML = '';
    q.options.forEach((optStr, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = optStr;
        btn.onclick = () => selectOption(index, btn);
        optionsContainer.appendChild(btn);
    });

    // 呼叫 KaTeX 進行數學渲染
    renderMathInElement(document.getElementById('question-card'), {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
}

// 5. 選擇選項
function selectOption(index, btnElement) {
    if (isAnswerChecked) return;
    selectedOptionIndex = index;
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
    submitBtn.disabled = false;
}

// 6. 檢查答案與推進邏輯
submitBtn.addEventListener('click', () => {
    const q = courseData[currentUnitIndex].questions[currentQuestionIndex];
    
    if (!isAnswerChecked) {
        // 檢查答案階段
        if (selectedOptionIndex === q.correctAnswer) {
            feedbackElem.textContent = "🎉 太棒了！完全正確。";
            feedbackElem.className = "feedback correct";
            submitBtn.textContent = "下一關";
            submitBtn.style.backgroundColor = "var(--correct-border)";
            submitBtn.style.boxShadow = "0 5px 0 var(--correct)";
            updateStreak();
        } else {
            feedbackElem.textContent = "❌ 哎呀，再想想看矩陣的運算規則！";
            feedbackElem.className = "feedback wrong";
            questionCard.classList.remove('shake');
            void questionCard.offsetWidth; // 觸發 reflow 讓動畫重置
            questionCard.classList.add('shake');
            return; // 答錯不允許進入下一關，讓用戶重選
        }
        isAnswerChecked = true;
    } else {
        // 進入下一關階段
        submitBtn.style.backgroundColor = "";
        submitBtn.style.boxShadow = "";
        currentQuestionIndex++;
        if (currentQuestionIndex >= courseData[currentUnitIndex].questions.length) {
            currentQuestionIndex = 0;
            currentUnitIndex++;
            if (currentUnitIndex >= courseData.length) {
                alert("🎉 恭喜你完成所有單元！");
                currentUnitIndex = 0;
            }
            renderPath();
        }
        loadQuestion();
    }
});

// 初始化執行
window.onload = () => {
    initTheme();
    initStreak();
    renderPath();
    loadQuestion();
};

let currentQuestion = {};
let currentQuiz = '';
let questionNumber = 0;
let correctAnswers = 0;

function startQuiz(quizType) {
    currentQuiz = quizType;
    showNextQuestion();
    document.getElementById('quiz').style.display = 'block';
}

function showNextQuestion() {
    questionNumber++;
    if (currentQuiz in quizzes) {
        quizzes[currentQuiz](); // 問題を生成
        let operatorText = '';
        switch (currentQuiz) {
            case 'addition_10':
            case 'addition_20_carry':
            case 'addition_over_20':
            case 'addition_2digit_1digit':
            case 'addition_3digit_2digit':
                operatorText = '+';
                break;
            case 'subtraction_10':
            case 'subtraction_20_borrow':
                operatorText = '-';
                break;
            default:
                operatorText = '+';
                break;
        }
        document.getElementById('question').textContent = `${currentQuestion.num1} ${operatorText} ${currentQuestion.num2} = ?`;
        document.getElementById('user_answer').value = '';
        document.getElementById('result').textContent = ''; // 1問目の正解表示を削除
    } else {
        console.error(`無効な問題タイプ: ${currentQuiz}`);
    }
}

const userAnswerInput = document.getElementById('user_answer');
if (userAnswerInput) {
    userAnswerInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
} else {
    console.error('user_answer 要素が見つかりませんでした。');
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('user_answer').value);
    if (userAnswer === currentQuestion.answer) {
        document.getElementById('result').textContent = '正解!';
        correctAnswers++;
        document.getElementById('score').textContent = `正解数: ${correctAnswers}`;
    } else {
        document.getElementById('result').textContent = '不正解...';
    }

    if (questionNumber === 3) {
        // 3問終了したら終了処理
        endQuiz();
    } else {
        setTimeout(showNextQuestion, 1000);
    }
}


function endQuiz() {
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';

    const restartButton = document.getElementById('restart-quiz');
    restartButton.addEventListener('click', () => {
        questionNumber = 0;
        correctAnswers = 0;
        document.getElementById('score').textContent = '正解数: 0';
        document.getElementById('question-container').style.display = 'block';
        document.getElementById('quiz-result').style.display = 'none';
        document.querySelector('.congrats-message').textContent = '';
    });

    // 「がんばったね!」の表示
    const congratsMessage = document.querySelector('.congrats-message');
    congratsMessage.textContent = 'がんばったね!';
}

const quizzes = {
    // かけ算九九
    multiplication_table() {
        let num1 = Math.floor(Math.random() * 9) + 1;
        let num2 = Math.floor(Math.random() * 9) + 1;
        let answer = num1 * num2;
        currentQuestion = { num1, num2, answer };
    },
// 2桁×1桁のかけ算
    multiplication_2digit_1digit() {
        let num1 = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
        let num2 = Math.floor(Math.random() * 9) + 1; // 1 ~ 9
        let answer = num1 * num2;
        currentQuestion = { num1, num2, answer };
    },

    // 3桁×2桁のかけ算
    multiplication_3digit_2digit() {
        let num1 = Math.floor(Math.random() * 900) + 100; // 100 ~ 999
        let num2 = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
        let answer = num1 * num2;
        currentQuestion = { num1, num2, answer };
    },


// 割り算九九
division_table() {
    let num1, num2, answer;

    // 割られる数を九九の答えから生成
    let multiplicationTable = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        2, 4, 6, 8, 10, 12, 14, 16, 18,
        3, 6, 9, 12, 15, 18, 21, 24, 27,
        4, 8, 12, 16, 20, 24, 28, 32, 36,
        5, 10, 15, 20, 25, 30, 35, 40, 45,
        6, 12, 18, 24, 30, 36, 42, 48, 54,
        7, 14, 21, 28, 35, 42, 49, 56, 63,
        8, 16, 24, 32, 40, 48, 56, 64, 72,
        9, 18, 27, 36, 45, 54, 63, 72, 81
    ];
    num1 = multiplicationTable[Math.floor(Math.random() * multiplicationTable.length)];

    // 割る数を num1 が割り切れる1桁の数字から生成
    let divisors = [];
    for (let i = 1; i <= 9; i++) {
        if (num1 % i === 0 && Math.floor(num1 / i) < 10) {
            divisors.push(i);
        }
    }
    num2 = divisors[Math.floor(Math.random() * divisors.length)];

    // 答えを計算
    answer = Math.floor(num1 / num2);

    currentQuestion = { num1, num2, answer };
},
    const quizData = {
    // 2桁÷1桁の割り算 (割り切れる)
    division_2digit_1digit() {
        let num1, num2, answer;
        do {
            num1 = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
            num2 = Math.floor(Math.random() * 9) + 1; // 1 ~ 9
            answer = num1 / num2;
        } while (!Number.isInteger(answer));
        currentQuestion = { num1, num2, answer };
    },

    // 3桁÷1桁の割り算 (割り切れる)
    division_3digit_1digit() {
        let num1, num2, answer;
        do {
            num1 = Math.floor(Math.random() * 900) + 100; // 100 ~ 999
            num2 = Math.floor(Math.random() * 9) + 1; // 1 ~ 9
            answer = num1 / num2;
        } while (!Number.isInteger(answer));
        currentQuestion = { num1, num2, answer };
    },
};

// HTML 側のボタンクリックイベントハンドラ
document.getElementById('multiplication_table').addEventListener('click', () => {
    startQuiz('multiplication_table');
});

document.getElementById('multiplication_2digit_1digit').addEventListener('click', () => {
    startQuiz('multiplication_2digit_1digit');
});

document.getElementById('multiplication_3digit_2digit').addEventListener('click', () => {
    startQuiz('multiplication_3digit_2digit');
});

document.getElementById('division_table').addEventListener('click', () => {
    startQuiz('division_table');
});

document.getElementById('division_2digit_1digit').addEventListener('click', () => {
    startQuiz('division_2digit_1digit');
});

document.getElementById('division_3digit_1digit').addEventListener('click', () => {
    startQuiz('division_3digit_1digit');
});

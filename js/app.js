
const app = {
    state: {
        currentStage: 'settings',
        score: 0,
        active: false,
        problemNo: 0,
        currentTime: '2.00',
        problemTimer: 30,
        gameTimer: 120,
        currentMathProblem: '3x5',
        answer: '',
        factor: 3
    },
    elements: {
        tableBtns: document.querySelectorAll('.tables button'),
        gameOver: document.querySelector('#game-over'),
        keyboard: document.querySelectorAll('.keyboard > .num'),
        problem: document.querySelector('.problem'),
        results: document.querySelector('.results'),
        answer: document.querySelector('.answer'),
        stage: document.querySelector('.center-stage'),
        score: document.querySelector('.score'),
        reset: document.querySelectorAll('.reset'),
        time: document.querySelector('.time'),
        body: document.querySelector('body')
    },
    confetti: null,
    setup() {
        this.confetti = new JSConfetti();
        
        // desktop key events
        window.addEventListener('keyup', (e) => {
            if(!isNaN(+e.key)){
                if(!this.state.active){
                    this.state.answer += +e.key
                    this.render()
                    this.evalAnswer()
                }
            }
            if(e.key === 'Backspace'){
                this.state.answer = this.state.answer.slice(0, -1);
                this.render()
            }
        })

        // Settings
        this.elements.tableBtns.forEach(btn => btn.addEventListener('click', (e) => {
            this.state.factor = +e.target.innerText;
            this.state.currentStage = 'game';
            this.getMathProblem();
            this.render();
            app.startGameTimer();
            app.startProblemTimer();
        }))
        
        // Game
        this.elements.keyboard.forEach(key => {
            key.addEventListener('click', (e) => {
                if (e.target.innerText === 'C') {
                    this.state.answer = '',
                    this.render();
                }
                else if(this.state.answer.length && e.target.innerText === '<') {
                    this.state.answer
                    this.render();
                } 
                else if (this.state.answer.length <= 3) {
                    if(!this.state.active){
                        this.state.answer += e.target.innerText;
                        this.render();
                        this.evalAnswer();
                    }
                }
            })
        })

        // Game over
        this.elements.gameOver.classList.add('hugo-a');
        this.elements.gameOver.classList.remove('hugo-b');
        
        // reset
        this.elements.reset.forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.score = 0;
                this.state.currentStage = 'settings';
                this.stopGameTimer();
                this.resetGameTimer();
                this.state.problemNo = 0;
                this.render();
            })
        })

        // Viewport
        const viewport = window.visualViewport;

        viewport.addEventListener('resize', () => {
            this.elements.body.style.height = viewport.height;
        })
    },
    render() {
        // show container
        document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
        document.querySelector(`section#${this.state.currentStage}`).style.display = 'flex';

        this.elements.score.innerHTML = `${this.state.score}p`;
        this.elements.time.innerHTML = `<p>${this.state.currentTime}s</p>`;

        this.elements.problem.innerHTML = `<span>${this.state.currentMathProblem}</span>`;
        this.elements.answer.innerText = this.state.answer;

        this.elements.results.innerHTML = `Du fick <strong>${this.state.score}p</strong>, bra jobbat!`

    },
    getMathProblem() {
        const rand = Math.round(Math.random() * 10);
        this.state.currentMathProblem = `${this.state.factor}x${rand}`;
    },
    gameTimer: null,
    problemTimer: null,
    evalAnswer() {

        console.info('Evaluating answer...');

        const converted = this.state.currentMathProblem.replace('x', '*');
        const correctAnswer = eval(converted);

        if (+this.state.answer === correctAnswer) {
            console.info('Corrent answer!');
            this.state.problemNo++
            this.state.active = true; // prevent double clicks 
            this.confetti.addConfetti();
            this.state.score += this.state.problemTimer;
            this.elements.body.classList.add('correct');
            this.resetProblemTimer()
            setTimeout(() => {
                this.state.answer = '';
                this.state.active = false;
                this.render()
            }, 300)

            setTimeout(() => {
                this.elements.body.classList.remove('correct');
                this.getMathProblem();
                this.render();
            }, 600)

        } else {
            // no win
            console.info('Wrong answer.');
        }
    },
    startGameTimer() {
        this.gameTimer = setInterval(() => {
            if (this.state.gameTimer > 0) {
                this.state.gameTimer--
                const minutes = Math.floor(this.state.gameTimer / 60);
                const seconds = this.state.gameTimer - minutes * 60;
                this.state.currentTime = `${minutes}.${seconds}`;
                this.render();
            } else {
                this.stopGameTimer();

                const avgHighScore = this.state.problemNo * (30 / 2);

                if(this.state.score > avgHighScore){
                    this.elements.gameOver.classList.remove('hugo-a');
                    this.elements.gameOver.classList.add('hugo-b');
                }

                this.state.currentStage = 'game-over';
                this.render();
            }
        }, 1000)
    },
    start() {
        this.problemTimer = setInterval(() => {
            if (this.state.problemTimer > 0) {
                this.state.problemTimer--
                console.log(this.state.problemTimer)
            } else {
                this.state.problemTimer = 0;
            }
        }, 1000)
    },
    stopGameTimer() {
        clearInterval(this.gameTimer)
    },
    resetProblemTimer() {
        this.state.problemTimer = 30;
    },
    resetGameTimer() {
        this.state.currentTime = '2.00'
        this.state.gameTimer = 180;
    }
}

app.setup();
app.render();
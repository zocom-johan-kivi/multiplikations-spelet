
const app = {
    state: {
        currentStage: 'settings',
        score: 0,
        currentTime: '3.00',
        problemTimer: 30,
        gameTimer: 180,
        currentMathProblem: '3x5',
        answer: '',
        factor: 3
    },
    elements: {
        keyboard: document.querySelectorAll('.keyboard > .num'),
        problem: document.querySelector('.problem'),
        answer: document.querySelector('.answer'),
        stage: document.querySelector('.center-stage'),
        score: document.querySelector('.score'),
        time: document.querySelector('.time'),
        body : document.querySelector('body'),
        tableBtns: document.querySelectorAll('.tables button')
    },
    confetti: null,
    setup() {
        this.confetti = new JSConfetti();
        // desktop
        window.addEventListener('keyup', (e) => {
            if(!isNaN(+e.key)){
                this.state.answer += +e.key
                this.render()
                this.evalAnswer()
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
                    this.state.answer += e.target.innerText;
                    this.render();
                    this.evalAnswer();
                }
            })
        })
        
        const viewport = window.visualViewport;
        const footerHeight = document.querySelector('section > footer').offsetHeight;

        viewport.addEventListener('resize', () => {
            this.elements.stage.style.height = viewport.height - footerHeight;
        })
    },
    render() {
        // show container
        document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
        document.querySelector(`section#${this.state.currentStage}`).style.display = 'flex';

        this.elements.score.innerHTML = `${this.state.score}p`;
        this.elements.time.innerHTML = `<p>${this.state.currentTime}s</p>`;

        this.elements.problem.innerText = this.state.currentMathProblem;
        this.elements.answer.innerText = this.state.answer;

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
            this.confetti.addConfetti();
            this.state.score += this.state.problemTimer;
            this.elements.body.classList.add('correct');
            this.resetProblemTimer()
            setTimeout(() => {
                this.state.answer = '';
                this.render()
            }, 500)

            setTimeout(() => {
                this.elements.body.classList.remove('correct');
                this.getMathProblem();
                this.render();
            }, 1000)

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
                this.state.currentStage = 'game-over';
                this.render();
            }
        }, 1000)
    },
    startProblemTimer() {
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
        this.state.currentTime = '3.00'
        this.state.gameTimer = 180;
    }
}

app.setup();
app.render();
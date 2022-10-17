
const app = {
    state: {
        currentStage: 'game',
        score: 0,
        currentTime: '3.00',
        countdownTime: 30,
        currentMathProblem: '3x5',
        factor: 3
    },
    confetti: null,
    setup(){
        this.confetti = new JSConfetti();
        const input = document.querySelector('input[type="tel"');
        input.focus();
        input.addEventListener('keyup', (e) => this.evalAnswer(e))
        const viewport = window.visualViewport;
        const footerHeight = document.querySelector('section > footer').offsetHeight;



        viewport.addEventListener('resize', () => {
            document.querySelector('.center-stage').style.height = viewport.height - footerHeight;
        })
    },
    render(){
        // show container
        document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
        document.querySelector(`section#${this.state.currentStage}`).style.display = 'flex';

        // update Clock
        document.querySelector('.score').innerText = `${this.state.score}p`;
        document.querySelector('.time').innerHTML = `<p>${this.state.currentTime}s</p>`;
    
        document.querySelector('.center-stage').innerText = this.state.currentMathProblem;

    },
    getMathProblem(){
        const rand = Math.round(Math.random()*10);
        this.state.currentMathProblem = `${this.factor}x${rand}`;
    },
    timer: null,
    evalAnswer(e){
        if(e.code === 'Enter'){
            const userAnswer = +document.querySelector('input[type="tel"]').value;
            const converted = this.state.currentMathProblem.replace('x', '*');
            const correctAnswer = eval(converted);

            if(userAnswer === correctAnswer){
                this.confetti.addConfetti()
                this.state.score =+ this.state.countdownTime;
                this.stopTimer()
                this.render()
            } else {
                // no win
            }
        }
    },
    startTimer(){
        this.timer = setInterval(() => {
            if(this.state.countdownTime > 0){
            this.state.countdownTime--
            const minutes = Math.floor(this.state.countdownTime / 60);
            const seconds = this.state.countdownTime - minutes * 60;
            this.state.currentTime = (this.state.countdownTime < 60) ? `${minutes}.${seconds}` : seconds;
            this.render();
        } else {
            this.stopTimer();
            this.state.currentStage = 'game-over';
            this.render();
        }
        }, 1000)
        
    },
    stopTimer(){
        clearInterval(this.timer)
    },
    resetTimer(){
        this.state.currentTime = '3.00'
        this.state.countdownTime = 180;
    }
}

app.setup();
app.render();
app.startTimer()
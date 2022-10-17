
const app = {
    state: {
        currentStage: 'settings',
        score: 0,
        secLeft: 180
    },
    render(){
        document.querySelectorAll('main > section').forEach(el => el.style.display = 'none');
        document.querySelector(`section#${this.state.currentStage}`).style.display = 'flex';
        
        document.querySelector('.score').innerText = this.state.score;
    
    }
}

const jsConfetti = new JSConfetti()

jsConfetti.addConfetti()

app.render();
import React, { Component } from 'react';
import {Button} from './components/Button';
import { faChevronRight, faChevronLeft, faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Question } from './components/Question';
import { getQuestions } from './Questions';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      questions: getQuestions(),
      questionIndex: 0
    }
  }

  nextQuestion = () => {
    if (this.state.questionIndex === this.state.questions.length-1) return;
    this.setState({...this.state, questionIndex: this.state.questionIndex+1});
  }
  
  prevQuestion = () => {
    if (this.state.questionIndex === 0) return;
    this.setState({...this.state, questionIndex: this.state.questionIndex-1});
  }
  
  randomQuestion = () => {
    this.setState({...this.state, questionIndex: Math.floor(Math.random() * this.state.questions.length) });
  }

  componentDidMount() {
      document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    if (e.key === "ArrowRight") {
        this.nextQuestion();
    }
    else if (e.key === "ArrowLeft") {
        this.prevQuestion();
    }      
    else if (e.key === " ") {
        this.randomQuestion();
    }      
  };

  render() {
    return (
      <div className="container">
        <Button onClick={() => this.nextQuestion()} className="container-right">
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
        <Button onClick={() => this.prevQuestion()} className="container-left">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        
        <Question {...this.state.questions[this.state.questionIndex]} />
        
        <div className="container-random-position">
          <Button hintPosition="top" hintText="Random Question" onClick={() => this.randomQuestion()} className="container-random">
            <FontAwesomeIcon icon={faRandom} />
          </Button>
        </div>
      </div>
    );
  }
}
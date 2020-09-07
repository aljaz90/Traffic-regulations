import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export const Question = props => {
    return (
        <div className="question">
            <div className="question--header">
                <div className="question--header--text">
                #{props.id} {props.question}
                </div>
                <div className="question--header--points">
                    {props.points[0]} pt.
                </div>
                {   props.image &&
                        <div style={{backgroundImage: `url(/images/${props.image.split("/")[props.image.split("/").length-1]})`}} className="question--header--image" />
                }
            </div>
            <div className="question--answers">
                {
                    props.options.map(opt => 
                        <div className={`option ${opt.isCorrect ? "option-correct" : null}`}>
                            <FontAwesomeIcon className="option--icon" icon={opt.isCorrect ? faCheckCircle : faTimesCircle} />
                            <div className="option--divider"></div>
                            <div className={`option--text ${opt.isCorrect ? "option--text-correct" : null}`}>
                                {opt.option}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

import React, { Component } from 'react';

export default class EzAnime extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            state: props.disabled ? "" : "enter",
            buffer: {
                old: null
            }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.children !== this.props.children && this.state.state === "") {
            this.setState({
                state: "leave",
                buffer: {
                    old: prevProps.children
                }
            });
        }
    }

    handleAnimationEnd = e => {
        if (this.state.state === "enter") {
            this.setState({...this.setState, state: ""})
        }
        else if (this.state.state === "leave") {
            this.setState({...this.setState, buffer: { ...this.state.buffer, old: null }, state: "enter"})
        }
    }

    
    render() {
        let disabled = this.props.disabled === null ? false : this.props.disabled;
        return (
            <div className={`${this.props.className} ${this.props.transitionName}-${!disabled ? this.state.state : ""}`} onAnimationEnd={this.handleAnimationEnd}>
                {(this.state.state === "leave" && !disabled) ? this.state.buffer.old : this.props.children}
            </div>
        )
    }
}

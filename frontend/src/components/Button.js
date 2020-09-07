import React from 'react';

export const Button = props => {
    return (
        <div style={{position: props.hintText ? "relative" : null}} onClick={props.onClick} className={`btn btn-${props.type} ${props.className}`}>
            {props.children}
            {
                props.hintText &&
                    <div className={`dropdown--hint dropdown--hint-${props.hintPosition ? props.hintPosition : "bottom"}`}>
                        {props.hintText}
                    </div>
            }
        </div>
    )
}

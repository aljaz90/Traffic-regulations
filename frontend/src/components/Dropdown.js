import React, { useState } from 'react';
import OutsideClick from './OutsideClick';
import { faChevronUp, faChevronDown, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EzAnime from './EzAnime';

const defaultIcons = {
    left: {open: faChevronRight, closed: faChevronLeft},
    right: {open: faChevronLeft, closed: faChevronRight},
    top: {open: faChevronDown, closed: faChevronUp},
    bottom: {open: faChevronUp, closed: faChevronDown},
};

export const Dropdown = props => {

    const [query, setQuery] = useState("");
    const [isAnimationDisabled, setIsAnimationDisabled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const position = props.position ? props.position : "bottom";

    let options = props.options;
    if (props.searchEnabled && options.length > 5 && query === "") {
        options = options;
    }
    else if (props.searchEnabled && query !== "") {
        options = options.filter(el => (el.text ? el.text.toLowerCase() : el.toLowerCase()).includes(query.toLowerCase()));
    }


    return (
        <OutsideClick className={props.parentClass} onOutsideClick={() => {setQuery(""); setIsAnimationDisabled(false); setIsDropdownOpen(false);}}>
            <div className={`dropdown dropdown-${props.type}`}>
                <div onClick={() => {setIsAnimationDisabled(false); setQuery(""); setIsDropdownOpen(!isDropdownOpen);}} className={`dropdown--button dropdown--button-${props.type} ${props.className}`}>
                    {(!props.staticButton && selectedOption) ? selectedOption : props.children} <FontAwesomeIcon className="dropdown--button--icon" icon={isDropdownOpen ? props.openIcon ? props.openIcon : defaultIcons[position].open : props.closedIcon ? props.closedIcon : defaultIcons[position].closed} />
                </div>
                {
                    props.hintText &&
                        <div className={`dropdown--hint dropdown--hint-${position}`}>
                            {props.hintText}
                        </div>
                }
                <EzAnime disabled={isAnimationDisabled} className={`dropdown--options dropdown--options-${position}`} transitionName={`animation--dropdown--${position}`}>
                {
                    isDropdownOpen &&
                    <React.Fragment>
                        {
                            props.searchEnabled &&
                                <input onChange={e => {setIsAnimationDisabled(true); setQuery(e.target.value);}} autoFocus={true} placeholder="Seach" className={`dropdown--options--search dropdown--options--search-${props.type}`} />
                        }
                        {
                            options.map(option => 
                                (<div onClick={() => {setIsAnimationDisabled(false); setIsDropdownOpen(false); setSelectedOption(option.key ? option.key : option); props.onSelect(option.key ? option.key : option);}} className={`dropdown--options--item dropdown--options--item-${props.type}`}>
                                    {option.text ? option.text : option}
                                </div>)
                            )
                        }
                    </React.Fragment>
                }
                </EzAnime>
            </div>
        </OutsideClick>
    )
}

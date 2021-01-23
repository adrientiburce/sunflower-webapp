import React, { useRef } from "react";
import { useRipple } from "../hooks";
import { Link } from "react-router-dom";

export default function Button({className, onClick, children}) {
    const element = useRef(null)
    const ripple = useRipple(element)

    return <button ref={element} onClick={onClick} onMouseDown={ripple} className={className + " button"}>
        {children}
    </button>
}

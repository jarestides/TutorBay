import React from "react";

export const TextField = React.forwardRef((props, ref) => {
    const {
        label,
        error = false,
        errorMessage = "error",
        errorClassName,
        name,
        type = "text",
        hint = "",
        value,
        onChange
    } = props;

    return (
    <div className="text-field">
        <label>
            {label}
            <input
                name={name}
                type={type}
                placeholder={hint}
                value={value}  
                onChange={onChange}
                ref={ref} />
        </label>
        {error && <p className={errorClassName}>{errorMessage}</p>}
    </div>
    );
}, )
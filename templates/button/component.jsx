import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * A customizable button component with multiple variants and sizes + click animation
 */
const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    disabled = false,
                    loading = false,
                    className = '',
                    onClick,
                    type = 'button',
                    ...rest
                }) => {
    const [isActive, setIsActive] = useState(false);

    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '6px',
        fontFamily: 'inherit',
        fontWeight: '500',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease-in-out',
        opacity: disabled || loading ? 0.6 : 1,
        transform: isActive ? 'scale(0.95)' : 'scale(1)', // 👈 shrink effect
    };

    const variantStyles = {
        primary: { backgroundColor: '#3b82f6', color: 'white' },
        secondary: { backgroundColor: '#f8fafc', color: '#374151', border: '1px solid #d1d5db' },
        destructive: { backgroundColor: '#dc2626', color: 'white' },
        outline: { backgroundColor: 'transparent', border: '1px solid #d1d5db', color: '#374151' },
        ghost: { backgroundColor: 'transparent', color: '#374151' },
    };

    const sizeStyles = {
        sm: { height: '32px', padding: '0 12px', fontSize: '14px' },
        md: { height: '40px', padding: '0 16px', fontSize: '14px' },
        lg: { height: '44px', padding: '0 24px', fontSize: '16px' },
        xl: { height: '52px', padding: '0 32px', fontSize: '16px' },
    };

    const buttonStyles = {
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
    };

    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        setIsActive(true);
        setTimeout(() => setIsActive(false), 150); // reset after animation
        if (onClick) onClick(e);
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={handleClick}
            className={className}
            style={buttonStyles}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            {...rest}
        >
            {loading ? 'Loading...' : children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['primary', 'secondary', 'destructive', 'outline', 'ghost']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;

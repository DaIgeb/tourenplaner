import './Button.less';
import * as React from 'react';

class Button extends React.Component<IButtonProps, IButtonState> {
    constructor(props:IButtonProps) {
        super(props);
    }

    public render() {
        // ES7 var {className, children, ...props} = this.props;
        // ...this.props
        var className = 'Button ' + this.props.className;
        var children = this.props.children;

        return (
            <button type="button" className={className} {...this.props.attributes}>
                {children}
            </button>
        );
    }
}

interface IButtonState {
}

interface IButtonProps extends React.Props<Button> {
    className: string;
    attributes: string; // needed until ES7 support
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
}

export default Button;

declare namespace __React {
    interface SyntheticInputEvent extends React.SyntheticEvent {
        target: InputEventTarget
    }

    interface InputEventTarget extends EventTarget {
        value:string;
    }
}
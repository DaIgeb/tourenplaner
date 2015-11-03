export class AbstractActions implements AltJS.ActionsClass {
    constructor(alt:AltJS.Alt){}
    dispatch: ( ...payload:Array<any>) => void;
}
export default AbstractActions;
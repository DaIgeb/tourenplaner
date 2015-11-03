import * as React from 'react';
import {IRestaurant} from "models/Restaurant";
import Button from "Button/Button";
import {actions as RestaurantActions} from "actions/RestaurantActions";

export class Restaurant extends React.Component<IRestaurantProps, IRestaurantState> {
    constructor(props:IRestaurantProps) {
        super(props);
    }

    componentWillMount() {
        this.setState({readOnly: true});
    }

    public render() {
        var buttonIcon:string;
        var buttonClass: string;
        if (this.state.readOnly) {
            buttonIcon = "glyphicon glyphicon-pencil";
            buttonClass= "btn btn-primary btn-sm";
        }
        else {
            buttonClass= "btn btn-success btn-sm";
            buttonIcon = "glyphicon glyphicon-ok";
        }

        var buttonAttributes = {"aria-label": "Left Align"};
        var modeButton = (
            <Button className={buttonClass} attributes={buttonAttributes} onClick={this.setMode}>
                <span className={buttonIcon} aria-hidden="true"></span>
            </Button>);
        return (
            <tr>
                <form onSubmit={this.submit}>
                <td>
                    <input type="text" className="form-control" value={this.props.restaurant.location}
                           readOnly={this.state.readOnly}/>
                </td>
                <td>
                    <input type="text" className="form-control" value={this.props.restaurant.name}
                           readOnly={this.state.readOnly}/>
                </td>
                <td>
                    <input type="text" className="form-control" value={this.props.restaurant.phone}
                           readOnly={this.state.readOnly}/>
                </td>
                <td>
                    <input type="textarea" className="form-control" value={this.props.restaurant.notes}
                           readOnly={this.state.readOnly}/>
                </td>
                <td>
                    {modeButton}
                    <button type="abort" className="btn btn-danger btn-sm" aria-label="Left Align"
                            onClick={this.removeRestaurant}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                </td>
                </form>
            </tr>
        );
    }

    setMode = (evt:any)=> {
        if (!this.state.readOnly) {
            RestaurantActions.saveRestaurant(this.props.restaurant)
        }

        this.setState({readOnly: !this.state.readOnly});
    };

    removeRestaurant = (evt:any)=> {
        this.props.onRemove(this.props.restaurant);
    };

    submit = (evt:any)=> {
        this.props.onRemove(this.props.restaurant);
    };
}

interface IRestaurantState {
    readOnly: boolean;
}
interface IRestaurantProps extends React.Props<Restaurant> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    onRemove: (restaurant:IRestaurant) => void;
    restaurant: IRestaurant;
    key: number;
}

export default Restaurant;

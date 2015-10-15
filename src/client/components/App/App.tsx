class App extends React.Component<IAppProps, any> {
    constructor(props : IAppProps) {
        super(props);

    }

    public render() {
        /*return (
            <div>
                <Header />
                {this.props.children}
                <Feedback />
                <Footer />
            </div>
        );*/
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

interface IAppProps extends React.Props<any>{

}

import React from 'react';
import Container from '../../index';

/*
Instantiate the container
 */
const ioc = new Container();

/*
First define some services we want to use.
Services are only instantiated once.
 */
ioc.service('fetchAction', function(container){
	return function(){
		// Fetch here, and dispatch to stores on success
        alert('Fetch started!');
	};
});
ioc.service('counter', function(container){
    let count = 0;
    return {
        getCount: function(){
            return count++;
        }
    }
});

/*
Define some components
 */
class App extends React.Component{
    constructor(UserInfoComponent, CounterComponent){
        super();
        this.elements = {UserInfoComponent, CounterComponent};
    }
    render(){
        let {UserInfoComponent, CounterComponent} = this.elements;

        return (
            <div>
                <h4>User info</h4>
                <UserInfoComponent name="Jar jar binx" />
                <h4>First counter</h4>
                <CounterComponent />
                <br />
                <h4>Second counter</h4>
                <CounterComponent />
                <br />
                <h4>Third counter</h4>
                <CounterComponent />
            </div>
        );
    }
}
class UserInfo extends React.Component{
    static defaultProps = {
        age: 22
    };
    static propTypes = {
        age: React.PropTypes.number
    };

    constructor(fetchAction){
        super();
        this.fetchAction = fetchAction;
        this.onClick = this.onClick.bind(this);
    }
    onClick(){
        this.fetchAction();
    }
    render(){
        return (
            <div>
                Username: {this.props.name} Age: {this.props.age}
                <br />
                <button onClick={this.onClick}>Fetch some stuff</button>
            </div>
        );
    }
}
class Counter extends React.Component{
    constructor(counter){
        super();
        this.counter = counter;
    }
    render(){
        let count = this.counter.getCount();
        return (
            <div>
                Counter component has been rendered {count} times before this
            </div>
        );
    }
}

/*
Register the components on the container.
Factories instantiate every time they are called.

Notice how easily we can switch out the returned components
with other components?
 */
ioc.factory('App', function(container){
    return container.bindElement(App, container.UserInfo, container.Counter);
});
ioc.factory('UserInfo', function(container){
    return container.bindElement(UserInfo, container.fetchAction);
});
ioc.factory('Counter', function(container){
    return container.bindElement(Counter, container.counter);
});

/*
 Render app from container:
  */
React.render(<ioc.App />, document.getElementById('app'));
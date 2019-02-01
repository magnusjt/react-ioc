# react-ioc

An inversion of control container for React components and other services

See: https://medium.com/@magnusjt/inversion-of-control-and-di-in-reactjs-and-redux-35161fcef847

### Advantages

* No passing down a large amount of service-related props through the component hierarchy
  (NB: Data-props still need to be passed like normal, since they determine what the render looks like)
* No global services needed (such as action creators)
* If you want to replace a component with a dummy component, you can do that from a central location.
  You can even use different elements depending on the platform you're on, just use a different instance
  of the container.
* If you need to replace an action creator, this is also extremely easy since you can simply swap
  out a service provider (for example with a dummy).
* You don't need to import any components or actions into the component file. All that is done from a central location.

Disadvantages?

* Over-use of the container is a problem as it ties the application to the container.

### API

#### Accessing the container
Access as you would any property on an object:

```jsx
let service = container.myService;
let MyElement = container.MyElement;

// JSX:
<container.MyElement myProp={propVal} />

// Or more elegantly:
let MyElement = container.MyElement;
<MyElement myProp={propVal} />
```

#### Declaring a service

`service(name, cb)`

### An example, please?
So let's see an example to understand how this works. It's a good idea to check out the examples folder as well.

```jsx
import React from 'react';
import Container from 'react-ioc';

/*
Define some components
 */
const makeApp = (UserInfoComponent, CounterComponent) =>  
class App extends React.Component{
    render(){
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

const makeUserInfo = (fetchAction) => 
class UserInfo extends React.Component{
    static defaultProps = {
        age: 22
    };
    static propTypes = {
        age: React.PropTypes.number
    };

    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(){
        fetchAction();
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

const makeCounter = counter =>
class Counter extends React.Component{
    render(){
        let count = counter.getCount();
        return (
            <div>
                Counter component has been rendered {count} times before this
            </div>
        );
    }
}

const ioc = new Container();

/*
First define some services we want to use.
Services are only instantiated once
(i.e. the same instance is always returned)
 */
ioc.service('fetchAction', container => {
    return function(){
        // Fetch here, and dispatch to stores on success
        alert('Fetch started!');
    };
});
ioc.service('counter', container => {
    let count = 0;
    return {
        getCount: function(){
            return count++;
        }
    }
});

/*
Register the components on the container.
Factories instantiate every time they are called.

Notice how easily we can switch out the returned components
with other components?
 */
ioc.service('App', c => makeApp(c.UserInfo, c.Counter));
ioc.service('UserInfo', c => makeUserInfo(c.fetchAction));
ioc.service('Counter', c => makeCounter(c.counter));

/*
 Render app from container:
  */
React.render(<ioc.App />, document.getElementById('app'));
```

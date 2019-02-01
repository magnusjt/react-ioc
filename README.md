# react-ioc

An inversion of control container for React components and other services (experimental)

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

#### Factories
Factories instantiate a property every time they are accessed.

`factory(name, cb)`
* name - The name you want to access the property by
* cb - This callback is fired every time the property is accessed. You should return your component here.

#### Services
Services are exactly the same as factories, except that they return the same instance every time you access it.

`service(name, cb)`

#### Element binding
Binding an element constructor is necessary so that the correct arguments are passed to it.
We need this because React is responsible for instantiating our elements.

`bindElement(element, ...args)`
* element - This is your React component class name
* ...args - Any number of args you wish to bind to the element constructor

### An example, please?
So let's see an example to understand how this works. It's a good idea to check out the examples folder as well.

```jsx
import React from 'react';
import Container from 'react-ioc';

const ioc = new Container();

/*
First define some services we want to use.
Services are only instantiated once
(i.e. the same instance is always returned)
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
```

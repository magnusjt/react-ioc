class Container{
    constructor(){
        this.services = {};
    }

    destroy(){
        delete this.services;
        this.services = {};
    }

    /**
     * Defines a service on the container. The service is accessed
     * directly as a property, but is not actually instantiated
     * before it is called.
     *
     * The service is only instantiated once.
     */
    service(name, cb){
        Object.defineProperty(this, name, {
            get: () => {
                if(!this.services.hasOwnProperty(name)){
                    this.services[name] = cb(this);
                }

                return this.services[name];
            }
        });

        return this;
    }

    /**
     * Define a factory function on the container.
     * The factory is accessed directly as a property,
     * and is instantiated every time the property is used.
     */
    factory(name, cb){
        Object.defineProperty(this, name, {
            get: () => {
                return cb(this);
            }
        });

        return this;
    }

    /**
     * A service provider is a class that uses
     * a register function to register all its related dependencies.
     * The container is passed to this function when the provider
     * registers itself here.
     */
    register(provider){
        provider.register(this);
    }

    /**
     * Helper function for binding constructor arguments.
     *
     * We also need it in order to set static properties to the bound constructor,
     * since React expects to get those directly from the element type.
     *
     * And lastly, we don't need to pass props and context to the Component,
     * since those are also set after React has constructed the component.
     * Admittedly, this should be done, but is not strictly necessary.
     */
    bindElement(elem, ...args){
        let f = elem.bind(null, ...args);

        /*
         Need to change the display name so we get something
         better than "bound something something"
        */
        f.displayName = elem.name;

        /*
        Also need to set various other static properties
         */
        f.defaultProps = elem.defaultProps;
        f.propTypes = elem.propTypes;
        f.contextTypes = elem.contextTypes;
        f.childContextTypes = elem.childContextTypes;

        return f;
    }
}

module.exports = Container;
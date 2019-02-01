class Container{
    constructor(){
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
            },
            configurable: true,
            enumerable: true
        });

        return this;
    }
}

module.exports = Container;

// 'this' refers to the object where the function is being called.
// The object depends on the immediate context.

const person1 = {
    name: "Spongebob",
    favFood: "hamburgers",

    sayHello: function () {
        console.log(`Hi! I am ${this.name}`);
    },
};

const person2 = {
    name: "Patrick",
    favFood: "pizza",

    sayHello: function () {
        console.log(`Hi! I am ${this.name}`);
    },
};

person1.sayHello();
person2.sayHello();


const shetty = {
    name : "Ram",
    age : 23,

    hello: function () { 

        console.log(`Hello, my name is ${this.name}`);

    },
};

shetty.hello();
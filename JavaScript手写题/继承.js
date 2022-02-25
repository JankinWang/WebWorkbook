/**
 *
 * 1.0 原型链继承
 *
 */

// 构造函数
function Animal() {
  this.colors = ['black', 'white']
}

// 直接向构造函数的 prototype 属性添加属性或方法
Animal.prototype.getColor = function () {
  return this.colors
}

// 创建 Dog 并继承 Animal
function Dog() {}
/**
 * 通过将 Dog.prototype 设置为 Animal 的实例对象，
 * 以此来继承它的属性和方法
 */
Dog.prototype = new Animal()
Dog.prototype.constructor = Dog

let dog1 = new Dog()
dog1.colors.push('brown')

let dog2 = new Dog()
console.log(dog2.colors)
// ['black', 'white', 'brown']

/**
 * 原型链继承存在的问题：
 * 问题1：原型中包含的引用类型属性将被所有实例共享；
 * 问题2：子类在实例化的时候不能给父类构造函数传参；
 *
 * 正常对象是不能修改原型上的属性的，
 * 如果是引用类型的属性，虽然不能修改属性的指针，但可以修改其元素。
 * 这个原理与 const 定义的常量有些类似
 *
 *
 *
 * dog1原型链：
 * dog1.__proto__->new Animal()->object
 */

//-------------------------------------------------------------

/**
 *
 * 2.0 借用构造函数实现继承
 * dog1原型链：
 * dog1->object->
 */

{
  function Animal(name) {
    this.name = name
    this.getName = function () {
      return this.name
    }
  }
  function Dog(name) {
    // 调用父类构造函数并传参，其实相当于将父类的属性和方法拷贝到子类
    Animal.call(this, name)
  }

  // Dog.prototype = new Animal()
  let dog1 = new Dog('阿黄')

  console.log(dog1.getName())
}

/**
 * 借用构造函数实现继承解决了原型链继承的 2 个问题：
 * 引用类型共享问题以及传参问题。
 *
 * 但是由于方法必须定义在构造函数中，
 * 所以会导致每次创建子类实例都会创建一遍方法。
 */

// --------------------------------------------------------------------

/**
 *
 * 3.0 组合继承
 *
 */

{
  function Animal(name) {
    this.name = name
    this.colors = ['black', 'white']
  }

  // 把方法定义在原型上以实现重用
  Animal.prototype.getName = function () {
    return this.name
  }

  function Dog(name, age) {
    Animal.call(this, name)
    this.age = age
  }

  Dog.prototype = new Animal()
  Dog.prototype.constructor = Dog

  let dog1 = new Dog('奶昔', 2)
  dog1.colors.push('brown')
  let dog2 = new Dog('哈赤', 1)
  console.log(dog2)
  // { name: "哈赤", colors: ["black", "white"], age: 1 }
}

/**
 * 组合继承结合了原型链和调用构造函数，将两者的优点集中了起来。
 * 基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。
 * 这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。
 *
 * 个人理解：
 *  - 需要共享的属性和方法用-原型链继承
 *  - 每个实例自己私有的属性用-构造函数实现继承
 *
 * 存在的问题：
 * 它的问题就是调用了 2 次父类构造函数，
 * 第一次是在 new Animal()，第二次是在 Animal.call() 这里。
 */

// ----------------------------------------------------------------

/**
 *
 * 4.0 寄生式组合继承
 *
 */

{
  function Animal() {
    this.name = name
    this.colors = ['black', 'white']
  }

  Animal.prototype.getName = function () {
    return this.name
  }

  function Dog(name, age) {
    Animal.call(this, name)
    this.age = age
  }

  // 以上与组合式继承一样，

  // 区别在于 Dog.prototype 不再指向 Animal 的实例，
  // 而是指向空构造函数 F() 的实例，F.prototype 又
  // 指向 Animal.prototype

  // 至此，既有利用构造函数继承的属性和方法，
  // 又有通过 F() 继承了 Animal.prototype 上的方法

  inheritPrototype(Dog, Animal)

  let dog1 = new Dog()
  dog1.colors.push('brown')

  let dog2 = new Dog()
  console.log(dog2.colors)
  // ['black', 'white', 'brown']

  // 实现寄生继承的关键
  function object(o) {
    function F() {}
    F.prototype = o
    return new F()
  }

  function inheritPrototype(child, parent) {
    let prototype = object(parent.prototype)
    prototype.constructor = child
    child.prototype = prototype
  }
}

/**
 * 总结：
 * 寄生式组合继承写法上和组合继承基本类似，区别是：
 * 不直接调用父类构造函数给子类原型赋值，
 * 而是通过创建空函数 F 获取父类原型的副本。
 */

// 可以基于组合继承的代码改成最简单的寄生式组合继承：
// 将 inheritPrototype(Dog, Animal) 替换为
Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.constructor = Dog

// --------------------------------------------------------------

/**
 *
 * class 实现继承
 *
 */

{
  class Animal {
    constructor(name) {
      this.name = name
    }
    getName() {
      return this.name
    }
  }
  class Dog extends Animal {
    constructor(name, age) {
      super(name)
      this.age = age
    }
  }
}

// ================================================================

// 练习

// 原型链继承
{
  function Parent(name) {
    this.name = name
  }

  Parent.prototype.sayName = function () {
    return this.name
  }

  function Child() {
    this.age = 10
  }

  Child.prototype = new Parent()

  let child = new Child()
  child.name = 'Tom'
  let child2 = new Child()
  console.log(child2.__proto__)
}

// 构造函数继承
{
  function Parent(name) {
    this.name = name
    this.sayName = () => {
      return this.name
    }
  }

  function Child(name) {
    Parent.call(this, name)
  }

  let child = new Child('Tim')

  console.log(child.sayName())
}

// 组合继承
{
  function Parent(name) {
    this.name = name
    this.eye = ['left', 'right']
  }

  Parent.prototype.sayName = function () {
    return this.name
  }

  function Child(name, age) {
    Parent.call(this, name)
    this.age = age
  }

  Child.prototype = new Parent()
  Child.prototype.constructor = Child
}

// 寄生式组合继承
;(function () {
  function Parent(name) {
    this.name = name
  }

  Parent.prototype.getName = function () {
    return this.name
  }

  function Child(name, age) {
    Parent.call(this, name)
    this.age = age
  }

  function F() {}
  F.prototype = Parent.prototype
  F.prototype.constructor = Child
  Child.prototype = new F()

  console.log(new Child('Tom', 16))
})()

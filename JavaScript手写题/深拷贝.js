const { result } = require("lodash")

/**
 * 深拷贝
 *
 * @link https://github.com/zxuqian/code-examples/blob/master/javascript/01-deep-clone/index.js#L36
 * @param {*} object
 * @param {*} [cache=new WeakMap]
 * @return {*} 
 * 
 * todo 尝试是否可以拷贝函数
 */
function deepClone(object, cache = new WeakMap){
  if (!isRef(object)) {
    return object
  }

  if (Array.isArray(object)){
    const result = []

    let hasCache = getCache(cache, object, result)
    if (hasCache !== null){
      return hasCache
    }

    object.forEach((value)=>{
      if (isRef(value)){
        result.push(deepClone(value, cache))
      } else {
        result.push(value)
      }
    }) 

    return result
  } else if('set' === typeOf(object)){
    const result = new Set()
    
    let hasCache = getCache(cache, object, result)
    if (hasCache !== null){
      return hasCache
    }

    object.forEach(value=>{
      if (isRef(value)){
        result.add(deepClone(value, cache))
      } else {
        result.add(value)
      }
    })

    return result
  } else if ('map' === typeOf(object)) {
    const result = new Map()

    let hasCache = getCache(cache, object, result)
    if (hasCache !== null){
      return hasCache
    }

    object.forEach((value, key)=>{
      if (isRef(value)){
        result.set(key, deepClone(value, cache))
      } else {
        result.set(key, value)
      }
    })

    return result
  } else if ('date' === typeOf(object)){
    const timestamp = object.getTime()
    return new Date(timestamp)
  } else if ('regexp' === typeOf(object)){
    const result = new RegExp(object);
    return result;

  }else if ('object' === typeOf(object)) {
    const result = Object(null)

    let hasCache = getCache(cache, object, result)
    if (hasCache !== null){
      return hasCache
    }

    Object.keys(object).forEach(key=>{
      let value = object[key]
      if (isRef(value)){
        result[key] = deepClone(value, cache)
      } else {
        result[key] = value
      }
    })

    return result
  }
}

function getCache(cache, key, value){
  if (cache.has(key)){
    return cache.get(key)
  } else {
    cache.set(key, value)
    return null
  }
}

function typeOf(obj) {
  const type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  return type
}

// 判断是否为引用类型
function isRef(object){
  if (object === null || object === undefined || typeof object !== 'object'){
    return false
  } else {
    return true
  }
}


const obj = {
  array: [1, 2, 3],
  object: {
    a: 1,
  },
  func() {
    return 5;
  },
  arrayOfObjs: [{ a: 10 }, { b: 20 }, { c: 30 }],
  date: new Date(),
  set: new Set([1, 2, 3, { a: 10 }]),
  map: new Map([
    ["a", 1],
    ["b", { c: 3 }],
  ]),
  regExp: /[a-z]/,
};

const obj2 = {
  circular: obj,
};

obj.circular = obj2;

const cloned = deepClone(obj);
console.log(cloned);


Object.keys(obj).forEach(key=>{
  console.log(`${key}: `, cloned[key] === obj[key]);
})
console.log('arrayOfObjs[0]',cloned.arrayOfObjs[0] === obj.arrayOfObjs[0]);

// Set
const it = cloned.set.values();
it.next();
it.next();
it.next();
const cSet = it.next();
console.log(cSet);

const it2 = obj.set.values();
it2.next();
it2.next();
it2.next();
const oSet = it2.next();
console.log(oSet);

console.log(cSet.value === oSet.value);
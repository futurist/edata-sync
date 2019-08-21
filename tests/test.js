const assert = require('assert')
const edata = require('edata').default
const plugin = require('../dist').default

const checkValues = [
    { source: [ 'd1' ], path: [ 'xx' ], type: 'set', data: 123 },
    { data: 123, path: [ 'xx' ], source: [ 'd1', 'd2' ], type: 'set' }
]

var d1 = edata({}, { plugins: [plugin({
    name: 'd1',
    postMessage: function (e) {
        d2.onMessage(e)
    },
    onMessage: e=>{
        assert.deepEqual(e, checkValues.shift())
    }
})] })
var d2 = edata({}, {plugins: [plugin({
    name: 'd2',
    postMessage: function (e) {
        d1.onMessage(e)
    },
    onMessage: e=>{
        // console.log(e)
        assert.deepEqual(e, checkValues.shift())
    }
})]})

d1.set('xx', 123)

assert.deepEqual(d2.unwrap(), {xx: 123})
assert.deepEqual(checkValues.length, 0)

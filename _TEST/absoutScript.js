/*
- type="module" 로 script 타입을 잡으면 로컬에서 실행 안됨.
- export 구문으로 작성하면 로컬에서 실행 안됨.
- import 구문을 쓰려면 script type="module"  로 설정되어야 함.
- 외부에서 사용된 변수 활용 가능


*/


const t = "외부변수"

// let A = (function( exports ) {
//     console.log('즉시실행')

//     let _name ="김아무개"
//     function init(){
//         console.log('init')
//     }
//     function func(){
//         console.log(_name + "입니다", t)
//     }
//     function setName(value){
//         _name = value;
//     }
    
//     exports = { 
//         _name,
//         init, 
//         func, 
//         setName
//     }
//     // exports.init = init;
//     return exports;
// })({});



console.log( A._name )
A.func()
A._name = '유정선';         // 변수를 exports 시켜도 외부에서 직접 접근해서 변경이 안됨!!
console.log( A._name )      // 변경된 값으로 호출되지만 A 안에 있는 함수들이 쓰는 변수는 변경되지 않았음.
A.func()                    // 변경된 값으로 호출되지만 A 안에 있는 함수들이 쓰는 변수는 변경되지 않았음.

A.setName('유정선');        // 변수를 변경하는 함수를 만들어서 변경시켜줘야 함.
A.func()




// let B = {
//     _name: '김아무개',
//     init : (function(){
//         /* _name 접근이 안된다 */
//         console.log('즉시실행' )
//     })(),

//     get name() {
//         return this._name;
//     },

//     set name(value) {
//         // if (value.length < 4) {
//         //     console.log('더 길게...')
//         //     return;
//         // }
//         this._name = value;
//     },

//     func: function(){
//         console.log(this._name + "입니다")
//         //return this._name;
//     }
// }

// B.func()
// B.name = "유정선"
// B.func()


// const c = function(){
//     console.log('c')
// }

// const d = () => console.log('d')
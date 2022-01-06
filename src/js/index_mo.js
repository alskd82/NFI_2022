function print( _print ){
    if(!document.querySelector('.print')){
        document.body.innerHTML += `
        <style>
            .print{
                position:fixed; left:0; right:0; bottom: 0; top: 0; 
                pointer-events:none; 
                z-index: 1000;
                font-size: 3rem;
                color: red;
            }
        </style>
        <div class='print'> </div>
        `
    }
    document.querySelector('.print').innerHTML = _print
}

function getSafeArea() {
    var result, computed, div = document.createElement('div');

    div.style.padding = 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
    document.body.appendChild(div);
    computed = getComputedStyle(div);
    result = {
        top: parseInt(computed.paddingTop) || 0,
        right: parseInt(computed.paddingRight) || 0,
        bottom: parseInt(computed.paddingBottom) || 0,
        left: parseInt(computed.paddingLeft) || 0
    };
    document.body.removeChild(div);
    return result;
}



// console.log( getSafeArea() )
// print( getSafeArea().bottom )
// print( vh )
// document.addEventListener('scroll', (e)=>{
//     // print( getSafeArea().bottom  )
//     print( vh )
    
// })
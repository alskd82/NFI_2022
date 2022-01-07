
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

function modulate (value, rangeA, rangeB, limit) {
    var fromHigh, fromLow, result, toHigh, toLow;
    if (limit == null) limit = false;
    (fromLow = rangeA[0]), (fromHigh = rangeA[1]);
    (toLow = rangeB[0]), (toHigh = rangeB[1]);
    result =
      toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
    if (limit === true) {
        if (toLow < toHigh) {
            if (result < toLow) return toLow;
            if (result > toHigh) return toHigh;
        } else {
            if (result > toLow) return toLow;
            if (result < toHigh) return toHigh;
        }
    }
    return result;
};

const body = document.body;
const billboard = document.querySelector('.billboard');
const naviList = document.querySelector('.m_navi-list');
const btn_ham = document.querySelector('.m_ham');

let isRefresh = false;

document.addEventListener('DOMContentLoaded', e =>{

    billboard_play();
    GNB.addEvent();

    Section_Desc.init()
    Section_Step.init()
    Section_List.init()

    scroll_Fn()
    document.addEventListener('scroll', scroll_Fn, false)
})

window.addEventListener('load', (e)=>{
    Secction_Apply.init(); 
    Secction_LYB.init();
    Section_Next.init();
})


let scrollY = window.pageYOffset;
function bodyBlock(isBlock){
    if(isBlock){
        scrollY = window.pageYOffset;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        // body.style.width = '100%';
    } else {
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        // body.style.removeProperty('width');
        window.scrollTo(0, scrollY);
    }
}

/* ====================================================================================================================*/
/* 빌보드 이미지 로드 시점... 빌보드 애니메이션 시작 */
function billboard_play(){
    let billboardImageLoadedNum = 0;
    Section_Billboard.imgUrl.forEach((src,i) => {
        let img = new Image();
        img.src = src;
        img.onload = () =>{
            billboardImageLoadedNum++
            if(billboardImageLoadedNum === Section_Billboard.imgUrl.length) Section_Billboard.play()
        }
    })
}
/* ====================================================================================================================*/
/* 섹션 : 빌보드 */
const Section_Billboard = (function(exports){
    const imgUrl = [
        "https://static.msscdn.net/webflow/static/partners/img/bil_01.jpg",
        "https://static.msscdn.net/webflow/static/partners/img/bil_02.jpg",
        "https://static.msscdn.net/webflow/static/partners/img/bil_03.jpg"
    ];
    const wrap = document.querySelectorAll('.billboard-img-wrap');
    const img = document.querySelectorAll('.billboard-img');

    const opaTime = 0.5;
    const scaleTime = 3.5;
    const scaleInit = 1.08
    let index = 0;

    imgUrl.forEach((item, i)=>{
        img[i].style.backgroundImage = `url(${item})`;
    })
    function set(){
        wrap.forEach((item,i)=>{
            gsap.set(item, {opacity: 0, zIndex: 1 });
            gsap.set(img, { scale: 1.1 });
        })
    }
    set();

    function play(){
        let prev = (index - 1 < 0) ? imgUrl.length-1 : index - 1;

        gsap.set(wrap[prev], {zIndex: 1 })
        gsap.set(wrap[index], {zIndex: 3, opacity: 0 })
        gsap.set(img[index], { scale: scaleInit })

        gsap.to(wrap[index], opaTime, {opacity: 1, ease: 'none', 
            onComplete:()=> {
                gsap.set(wrap[prev], { opacity: 0 });
                index = (index+1) % imgUrl.length
            }
        })
        gsap.to(img[index], scaleTime, {scale: 1, ease: 'none'})        
        gsap.delayedCall( scaleTime - opaTime , play)
    }

    function stop(){
        wrap.forEach((item, i)=>{
            gsap.killTweensOf(item);
            gsap.killTweensOf(img[i]);
        })
    }

    function isTweening(){
        let _is = false
        for(let i=0; i<imgUrl.length; i++){
            if( gsap.isTweening(img[i]) ){
                return true
            }
        }
        return _is
    }

    exports.imgUrl = imgUrl
    exports.isTweening = isTweening
    exports.stop = stop
    exports.play = play;
    return exports;
})({});

/* ====================================================================================================================*/
/* 네비게이션 */
let isGNBShow = false;
const GNB = (function(exports){
    function addEvent(){
        btn_ham.addEventListener('click', e =>{
            if(isGNBShow){
                isGNBShow = false;
                naviList.classList.remove('show');
            } else {
                isGNBShow = true;
                naviList.classList.add('show');
            }
            bodyBlock(isGNBShow);
            svgChange();
        })
    }

    function svgChange(){
        if(isGNBShow){
            gnbPath.setDirection(1)
            gnbPath.play();
            gsap.to(btn_ham.querySelectorAll('.path path'), .4, {fill: "#fff"})
        } else {
            gnbPath.setDirection(-1)
            gnbPath.play()
            gsap.to(btn_ham.querySelectorAll('.path path'), .4, {fill: "rgb(189,255,0)"})
        }
    } 

    exports = {
        addEvent,
    }
    return exports;
})({});

/* ====================================================================================================================*/
/* scroll */
function scroll_Fn(e){
    
    const _s = Math.floor(100*vh) *.25
    const _e = Math.floor(100*vh) *.75
    const _opa = modulate(Math.floor(window.pageYOffset), [_s,_e], [1,0], true).toFixed(2)
    gsap.set(billboard, {autoAlpha: _opa})

    if(Math.floor(window.pageYOffset) > _e){
        if(!document.querySelector('.m_gnb-wrap').classList.contains('bg-black')) document.querySelector('.m_gnb-wrap').classList.add('bg-black')
    } else {
        if(document.querySelector('.m_gnb-wrap').classList.contains('bg-black')) document.querySelector('.m_gnb-wrap').classList.remove('bg-black')
    }
}


/* ====================================================================================================================*/
/* ClipMaskImg */
class ClipMaskImg {
    constructor( opts ){
        const defaults = {
            maskTime: 1,
            maskEase: BezierEasing(0.7,0,0.1,1), 
            imgTime: 1.4,
            imgDelayTime: 0,
            imgEase: BezierEasing(0,0,0,1),
        }

        this.opts = {...defaults, ...opts};
        this.maskTime = this.opts.maskTime;
        this.maskEase = this.opts.maskEase;
        this.imgTime = this.opts.imgTime;
        this.imgDelayTime = this.opts.imgDelayTime;
        this.imgEase = this.opts.imgEase;

        this.wordElem = this.opts.wordElem;        

        // this._set()
    }

    _set(){
        let _path;
        if(this.opts.clipPosition === 'left'){
            _path = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
        } else if(this.opts.clipPosition === 'center'){
            _path = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' 
        }
        gsap.set(this.opts.maskElem, {clipPath: _path} )
        gsap.set(this.opts.imgElem, {scale: 2} )

        if(this.wordElem === undefined) return;
        const charGap = this.opts.charGap;
        this.split = new SplitText( this.wordElem , { 
            type: "words, chars", 
            position: 'absolute' 
        });
        
        const centerIndex = Math.ceil(this.split.chars.length/2);
        this.split.chars.forEach((txt, i )=>{
            if( this.split.chars.length % 2 != 0){
                gsap.set(txt, {x: (i-(centerIndex-1))*charGap })
            } else {
                let n = (i<centerIndex) ? i-centerIndex : i-(centerIndex-1)
                gsap.set(txt, {x: n * charGap })
            }
        })
        gsap.set(this.split.words, {scale: 2 })
    }

    play(){
        // webkitClipPath
        gsap.to( this.opts.maskElem, this.maskTime, { ease: this.maskEase, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'} )
        gsap.to( this.opts.imgElem, this.imgTime, {delay:this.imgDelayTime, ease: this.imgEase, scale: 1} )
        
        if(this.wordElem === undefined) return;
        gsap.to( this.split.words, this.imgTime, {delay:this.imgDelayTime, scale: 1, ease: this.imgEase })
        gsap.to( this.split.chars, this.imgTime, {delay:this.imgDelayTime, x: 0, ease: this.imgEase })
    }
}

/* ====================================================================================================================*/
/* LetterSpacing */
class LetterSpacing {
    constructor( opts ){
        if(opts.wordElem === undefined) return;
        const defaults = {
            easing: BezierEasing(0.6,0,0.1,1),
            time: 1.3,
            delayTime:0,
            charGap: 450,
            charScale: 1,
            wordScale: 2
        }
        this.opts = {...defaults, ...opts};
        this.wordElem = this.opts.wordElem;
        // this._set()
    }
    
    _set(){
        this.split = new SplitText( this.wordElem , { 
            type: "words, chars", 
            position: 'absolute' 
        });

        // console.log(this.split.chars )
        // console.log(this.split.words )
        
        this.split.chars.forEach((txt, i)=>{
            if(i < 4){ // NEXT
                gsap.set( txt, {x: this.opts.charGap*(i-2), scale: this.opts.charScale, opacity:0 }) //2: NEXT 센터 인덱스
            } else {  // FASHION
                gsap.set( txt, {x: this.opts.charGap*(i-2-4), scale: this.opts.charScale, opacity:0 })//2-4: FASHION 센터 인덱스
            }
        })
        // gsap.set( this.split.words, { scale: this.opts.wordScale })
        gsap.set( '.m_next-fashtion-txt', { scale: this.opts.wordScale  })
    }

    play(){
        // gsap.to( this.split.words, this.opts.time, {delay:this.opts.delayTime, scale: 1, ease: this.opts.easing })
        gsap.to( '.m_next-fashtion-txt', this.opts.time, {scale: 1 , ease: this.opts.easing })
        gsap.to( this.split.chars, this.opts.time, {delay:this.opts.delayTime, scale: 1, x: 0, ease: this.opts.easing });
        gsap.to( this.split.chars, this.opts.time * .5, {delay:this.opts.delayTime, opacity: 1 })
    }
    
}
/* ====================================================================================================================*/
/* 섹션 : 개요 */
const Section_Desc = (function(exports){
    let img;
    let textMasking;
    function init(){
        img = new ClipMaskImg({
            maskElem: '.m_desc_img-mask',
            imgElem: '.m_desc_img',
            clipPosition: 'left',
            imgDelayTime: .3,
        })
        img._set()
        ST()

        document.querySelector('.m_section-desc .desc_info-txt_strong').style.color = "#fff";
        //--------------------------------------------------------------------------------------
        /* lottie play */
        document.querySelector('.m_desc_info-txt').innerHTML += `<div id="textMasking"></div>`;
        textMasking = lottie.loadAnimation({
            container: document.querySelector('#textMasking'),
            path: 'https://static.msscdn.net/webflow/static/partners/path/text_masking.json',
            // animationData: path_textMastking,
            autoplay: false, loop: false
        });
        //------------------------------------------------------------------------------------------
    }

    function ST(){
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.m_desc_img-wrap',
            start: "top bottom",
            onEnter:()=>{
                img.play()
                setTimeout(()=>{
                    document.querySelector('.m_desc_txt-wrap').classList.add('show')
                }, 300)
            }
        });

        ScrollTrigger.create({
            // markers: true, 
            trigger: '.m_desc_info-wrap',
            start: "top 95%",
            onEnter:()=>{
                document.querySelector('.m_desc_info-wrap').classList.add('show')
                setTimeout(()=>{textAnimation()}, 500)
            }
        });
    }

    function textAnimation(){
        textMasking.play();
        setTimeout(()=>{
            document.querySelector('.m_section-desc .desc_info-txt_strong').style.color = "#BDFF00"; 
        },500)
    }
    
    exports = {
        init
    }
    return exports;
})({})

/* ====================================================================================================================*/
/* 섹션 : APPLY */
const Secction_Apply = (function(exports){
    let img
    function init(){
        img = new ClipMaskImg({
            maskElem: '.m_apply-mask',
            imgElem: '.apply-img',
            clipPosition: 'center',
            maskTime: 1, maskEase: BezierEasing(0.5,0,0,1),
            imgTime: 1.7, imgEase: BezierEasing(0.6,0,0.1,1),
            wordElem: '.m_section-apply .m_apply-txt',
            charGap: 450,
        });
        img._set();
        ST();
        gsap.set('.m_apply',{ y: 120 })
    };

    function ST(){
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.m_section-apply',
            start: `top 90%`, 
            onEnter:()=>{
                img.play();                
                gsap.to('.m_apply', 1.5, { y: 0, ease: BezierEasing(0.4,0,0.2,1)})
            },
            onLeaveBack:()=>{
                if(isRefresh) reset()
            }
        });
    };

    function reset(){
        img._set();
        gsap.set('.m_apply',{ y: 120 })
    }

    exports ={
        init
    }
    return exports;
})({})

/* ====================================================================================================================*/
/* 섹션 : 런치 유어 브랜드  */
const Secction_LYB = (function(exports){
    let launchImg
    let yourImg
    let brandImg

    function init(){
        launchImg = new ClipMaskImg({
            maskElem: ".m_lyb.is-1",
            imgElem: ".m_lyb.is-1 .m_ybd_launch-img",
            clipPosition: 'left',
            maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
            imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
            wordElem: '.m_lyb.is-1 .m_apply-txt',
            charGap: 300,
        })
        yourImg = new ClipMaskImg({
            maskElem: ".m_lyb.is-2",
            imgElem: ".m_lyb.is-2 .m_ybd_launch-img",
            clipPosition: 'left',
            maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
            imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
            wordElem: '.m_lyb.is-2 .m_apply-txt',
            charGap: 300,
        })
        brandImg = new ClipMaskImg({
            maskElem: ".m_lyb.is-3",
            imgElem: ".m_lyb.is-3 .m_ybd_launch-img",
            clipPosition: 'left',
            maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
            imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
            wordElem: '.m_lyb.is-3 .m_apply-txt',
            charGap: 300,
        })
        reset()
        ST()
    };

    function ST(){
        let opts = {
            // markers: true, 
            start: `top 95%`, 
            onLeaveBack:()=>{
                if(isRefresh)reset()
            }
        }

        ScrollTrigger.create({
            trigger: '.m_lyb.is-1',
            onEnter:()=> launchImg.play(),
            ...opts
        })
        ScrollTrigger.create({
            trigger: '.m_lyb.is-2',
            onEnter:()=> yourImg.play(),
            ...opts
        })
        ScrollTrigger.create({
            trigger: '.m_lyb.is-3',
            onEnter:()=> brandImg.play(),
            ...opts
        })
    };

    function reset(){
        launchImg._set();
        yourImg._set();
        brandImg._set();
    }

    exports ={
        init
    }
    return exports;
})({});

/* ====================================================================================================================*/
/* 섹션 : 스텝  */
const Section_Step = (function(exports){
    const stepArr = document.querySelectorAll('.m_step_block_color');

    function init(){

        reset();
        ST()
    }

    function ST(){
        stepArr.forEach((item, i)=>{
            ScrollTrigger.create({
                trigger: stepArr[i],
                start: `top 75%`, 
                onEnter:()=>{
                    gsap.to( stepArr[i], 0.5, {clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.4,0,0.1,1)})
                },
                onLeaveBack: ()=> {if(isRefresh) reset();}
            })
        });
    }

    function reset(){
        stepArr.forEach((item, i)=>{
            gsap.set( item, {clipPath: `circle(0% at 50% 50%)`})
        })
    }
    exports.init = init;
    return exports
})({})

/* ====================================================================================================================*/
// /* Next Fashion */
const Section_Next = (function(exports){
    let textMotion
    function init(){
        gsap.set(".m_next-fashion", {y: '-40%' })
        const ani = gsap.to(".m_next-fashion", 1, {y: '40%' })
        
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.m_section-next-fashion',
            animation: ani,
            scrub: true
        })

        textMotion = new LetterSpacing({
            wordElem: '.m_next-fashtion-txt', 
            wordScale: 1.5, 
            charScale: 1,
            time: 1,
            easing: BezierEasing(0.6,0,0,1),
        })   
        reset()

        ScrollTrigger.create({
            // markers: true,
            id: 'textMotion', 
            start: "top 80%",
            trigger: '.m_section-next-fashion',
            onEnter:()=> textMotion.play(),
            onLeaveBack:()=>{
                if(isRefresh) textMotion._set()
            }
        }) 

    }
    
    function reset(){ textMotion._set() }

    exports.init = init;
    return exports;
})({})

/* ====================================================================================================================*/
// /* 선발 리스트 */
const Section_List = (function(exports){
    const listMaskArr = document.querySelectorAll('.winner-mask');
    const listLinkArr = document.querySelectorAll('.winner-link');
    
    const rowTotalNum = Math.ceil(document.querySelectorAll('.cms-winner_item').length / 2);

    function init(){
        listLinkArr.forEach((item, i)=>{ gsap.set( item, { autoAlpha: 0 }) })
        ST();
    }

    function ST(){
        for(let i=0; i<rowTotalNum; i++){
            ScrollTrigger.create({
                // markers: true, 
                trigger: listMaskArr[i*rowTotalNum],
                start: `center 95%`,
                onEnter:()=>{
                    tl(i*rowTotalNum)
                    if(listMaskArr[i*rowTotalNum + 1]) setTimeout(()=>{ tl(i*rowTotalNum + 1) }, 100)
                },
                onLeaveBack: self => self.disable(),
                // onRefresh:(self)=>{
                //     // self.start = `top ${window.innerHeight - 60}`,
                //     // console.log(self)
                // }
            })
        }
    }

    function tl(num){
        gsap.set( listLinkArr[num].querySelector('.winner-img'), { scale: 1.5})

        let _tl = gsap.timeline();
        _tl.to( listMaskArr[num], 0.5, {ease: "Quint.easeOut", width: '100%',
            onComplete:()=>{
                gsap.set( listLinkArr[num], { autoAlpha: 1 })
            }
        })
        _tl.to( listMaskArr[num], 0.5, {ease: BezierEasing(0.7,0,0,1), scaleX: 0, transformOrigin:'right'} )
        _tl.to( listLinkArr[num].querySelector('.winner-img'), 0.5, {
            ease: BezierEasing(0.6,0,0.1,1), scale: 1,
            onComplete:()=>{ 
                gsap.set(listMaskArr, {width: '0%', scale: 1})
                // gsap.set( listLinkArr, { autoAlpha: 0 })
            }
        }, '=-0.5')
    }

    exports.init = init
    return exports;

})({})

/* ====================================================================================================================*/
// /* FAQ - Swiper */
const FAQ = new Swiper(".mySwiper", {slidesPerView: "auto",});

/* ====================================================================================================================*/
// /* 지도 */

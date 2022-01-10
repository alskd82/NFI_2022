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
let loader;
let Detail;

document.addEventListener('DOMContentLoaded', e =>{

    Section_Desc.init()
    Section_Step.init()
    Section_List.init()
    Section_Contact.init()

    Floating.init();
    addEvent();

    Loading.init()
    let billboardImageLoadedNum = 0;
    Section_Billboard.imgUrl.forEach((src,i) => {
        let img = new Image();
        img.src = src;
        img.onload = () =>{
            billboardImageLoadedNum++;
            const p = (billboardImageLoadedNum/Section_Billboard.imgUrl.length) * 100
            gsap.to("#LoadWrap .line", 1, {
                width: `${p}%`,
                onComplete:()=>{
                    if(p === 100){
                        Loading.play()
                        setTimeout(()=> {
                            Section_Billboard.play()
                            document.body.classList.add('loaded')
                        } , 1500)
                    }
                }
            }) 
            
        };
        // if(billboardImageLoadedNum === Section_Billboard.imgUrl.length){
        //     Loading.play()
        //     Section_Billboard.play()
        // }
    })
})

window.addEventListener('load', (e)=>{
    Secction_Apply.init(); 
    Secction_LYB.init();
    Section_Next.init();

    Detail = new ShowDetail();
    Detail.init()
    
})

function addEvent(){
    /* 스크롤 */
    scroll_Fn();
    document.addEventListener('scroll', scroll_Fn, false)

    /* GNB */
    GNB.init();

    /* 지원서 다운로드 링크 */
    function download_Fn(e){
        e.preventDefault()
        window.open('about:blank').location.href = document.querySelector('#DonwloadURL').getAttribute('href'); 
    }
    document.querySelector('.m_float-download').addEventListener('click', download_Fn, false);
    document.querySelector('.m_btn_download').addEventListener('click', download_Fn, false);
    
    /* 이메일 바로가기 */
    document.querySelector('.m_txt_email-underline').addEventListener('click', ()=> goToEmail() )
    document.querySelector('.m_map_txt-item_t3').addEventListener('click', ()=> goToEmail() )
    const goToEmail =()=> document.location.href = 'mailto:nextfashion@musinsapartners.com';

    /* 상세 */
    document.querySelectorAll('.winner-link').forEach((link, i)=>{
        link.addEventListener('click', e =>{
            e.preventDefault();
            // const href = item.getAttribute('href');
            const href = './winner'
            Detail.pageShow(href);
            isGNBShow = true;
            bodyBlock(true);
        })
    })

    /* 상세 닫기 */
    document.querySelector('.m_detail-gnb a').addEventListener('click' , e =>{
        Detail.closePage();
    })


    /* 로고 이동 */
    document.querySelector('.m_logo-wrap').addEventListener('click', e =>{
        // window.open('about:blank').location.href = "https://www.musinsapartners.co.kr/";
        // window.location.reload();
        document.querySelector('#LoadWrap').style.display = 'block';
        Loading.overlay_play();
        isRefresh = true;
    })

    /* 스크롤 다운 */
    document.querySelector('.scroll-arrow-wrap').addEventListener('click', e =>{
        gsap.to(window, .7, {scrollTo: {y: ".m_section-banner", offsetY: gsap.getProperty('nav', 'height')}, ease: BezierEasing(0.4,0,0.2,1)})
    })
}


let scrollY = window.pageYOffset;
function bodyBlock(isBlock){
    if(isBlock){
        scrollY = window.pageYOffset;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
    } else {
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('width');
        window.scrollTo(0, scrollY);
    }
}

/* ====================================================================================================================*/
// /* LoadWrap */

const Loading = (function(exports){
    const elem = document.querySelector('#LoadWrap');
    const spanBig = elem.querySelector('.load-text.big div');
    const spanSmall = elem.querySelector('.load-text.small div');
    const overlayPath = elem.querySelector('.overlay_path');

    function init(){
        gsap.set(spanBig, {y: 50} )
        gsap.set(spanBig.querySelectorAll('span'), {y: -100} )
        gsap.set(spanBig.parentElement, {opacity: 1})
        gsap.set(elem, {clipPath: '0% 0%, 100% 0%, 100% 100%, 0% 100%'})
    }
    init()

    function play(){
        const span = spanSmall.querySelectorAll('span');
        span.forEach(elem => {
            elem.classList.remove('load')
            elem.style.animation = 'ani'
        });
        gsap.to(spanSmall, .6, {y: -20, ease: 'Quint.easeOut'})
        gsap.to(span, .6, {y: 40, ease: 'Quint.easeOut'});
        gsap.to(spanBig, .6, {delay: .1, y: 0, ease: 'Quint.easeOut'} )
        gsap.to(spanBig.querySelectorAll('span'), .6, {delay: .1, y: 0, ease: 'Quint.easeOut' } )
        gsap.delayedCall(0.5, overlay_play )
    }

    function overlay_play(){
        gsap.timeline()
            .set(overlayPath, { attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' } })
            .to(overlayPath, 0.6, { ease: 'Quint.easeIn', attr: { d: 'M 0 100 V 50 Q 50 0 100 50 V 100 z' } }, 0)
            .to(overlayPath, 0.3, {  ease: 'Cubic.easeOut', attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
                onComplete: () => {
                    elem.style.backgroundColor = 'rgba(0,0,0,0)';
                    elem.querySelectorAll('div').forEach(elem => elem.remove());
                    if(window.pageYOffset > 0){
                        window.scrollTo(0,0)
                        setTimeout(()=>{ isRefresh = false;}, 100)
                    }
                }
            })
            .set(overlayPath, { attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' } })
            .to(overlayPath, 0.3 ,{ ease: 'Cubic.easeIn',  attr: { d: 'M 0 0 V 50 Q 50 0 100 50 V 0 z' } })
            .to(overlayPath, 0.8, {  ease: 'Quint.easeOut', attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }, 
            onComplete: () => {
                    // elem.remove()
                    elem.style.display = 'none';
                }    
        });
    }

    exports = { init, play, overlay_play  }
    return exports;
})({});




/* ====================================================================================================================*/
/* Floating */
const Floating = (function(exports){
    const floatingDownload = document.querySelector('.m_float-download .ic-download')
    function init(){
        ST()
    }
    
    /* 참가 신청서 색상 바꾸기 */
    function floatingColor_Fn(isChange){ 
        if(!isGNBShow){
            const _b = floatingDownload.classList.contains('mode-fill');
            if(isChange && !_b) floatingDownload.classList.add('mode-fill')
            else if(!isChange && _b) floatingDownload.classList.remove('mode-fill')
        }
    }

    function ST(){
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.m_section-banner',
            start: "bottom bottom",
            onEnter:()=> floatingColor_Fn(true),
            onLeaveBack:()=> floatingColor_Fn(false)
        });
    }

    exports.init = init;
    return exports;
})({})


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
    function init(){
        addEvent()
        // ioGnbBgColor()
    };

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
        });

        document.querySelector('.m_navi-list').addEventListener('click', e =>{
            if(e.target === document.querySelector('.m_navi-list')){
                naviList.classList.remove('show');
                isGNBShow = false
                bodyBlock(isGNBShow);
                svgChange();
            }
        })

        const targetSections = [
            ".m_section-target",
            ".m_section-step",
            ".m_section-benefit",
            ".m_section-winner",
            ".m_section-faq",
            ".m_section-contact",
            ".m_section-supporters"
        ]
        document.querySelectorAll('.m_navi-list a').forEach((navi, i)=>{ 
            navi.addEventListener('click', e => {
                e.preventDefault();
                naviList.classList.remove('show');
                isGNBShow = false
                bodyBlock(isGNBShow);
                console.log(isGNBShow)
                svgChange();

                let _offset = gsap.getProperty('.m_gnb-wrap', 'height');
                if( targetSections[i] === ".m_section-supporters") _offset = 20
                else if( targetSections[i] === ".m_section-benefit") _offset = -20
                else if( targetSections[i] === ".m_section-winner") _offset = 30
                gsap.to(window, 0, { scrollTo:{ y: targetSections[i] , offsetY: _offset} });

                
            })
        })
    }

    function svgChange(){ // 햄버거 버튼 로띠 제어 //
        if(isGNBShow){
            gnbPath.setDirection(1)
            gnbPath.play();
            gsap.to(btn_ham.querySelectorAll('.path path'), .4, {fill: "#fff"})
        } else {
            gnbPath.setDirection(-1)
            gnbPath.play()
            gsap.to(btn_ham.querySelectorAll('.path path'), .4, {fill: "rgb(189,255,0)"})
        }
    };

    /* .m_gnb-wrap 배경 색상 화이트로 전환 : 서포터즈  */
    function ioGnbBgColor(){
        const ioGnbOptions = { rootMargin: '0px 0px -95% 0px' }
        const ioGnb = new IntersectionObserver(( entries, observer )=>{
            entries[0].isIntersecting ? gnbBgWhite_Fn(true) : gnbBgWhite_Fn(false)
        }, ioGnbOptions) 

        function gnbBgWhite_Fn(isWhite){
            if(isWhite) document.querySelector('.m_gnb-wrap').classList.add('bg-white')
            else        document.querySelector('.m_gnb-wrap').classList.remove('bg-white')
        }
        ioGnb.observe( document.querySelector('.m_section-supporters') )
    }
    
    // /* gnb 색상 변화 시점 */
    // const ioGnbOptions = { rootMargin: '0px 0px -95% 0px' }
    // const ioGnb = new IntersectionObserver(( entries, observer )=>{
    //     entries[0].isIntersecting ? gnbChangeColor_Fn(true) : gnbChangeColor_Fn(false)
    // }, ioGnbOptions)
    // // ioGnb.observe( document.querySelector('.section-supporters') )

    exports = {
        init,
    }
    return exports;
})({});

/* ====================================================================================================================*/
/* scroll */
function scroll_Fn(e){
    const _scrollY = Math.floor(window.pageYOffset)
    const _s = Math.floor(100*vh) *.25
    const _e = Math.floor(100*vh) *.75
    const _opa = modulate(_scrollY, [_s,_e], [1,0], true).toFixed(2)
    gsap.set(billboard, {autoAlpha: _opa})

    if(!isGNBShow){
        if(_scrollY > _e){
            if(!document.querySelector('.m_gnb-wrap').classList.contains('bg-black')) document.querySelector('.m_gnb-wrap').classList.add('bg-black')
        } else {
            if(document.querySelector('.m_gnb-wrap').classList.contains('bg-black')) document.querySelector('.m_gnb-wrap').classList.remove('bg-black')
        }

        /* 플로팅 위치 */
        if(_scrollY > 88){
            if(!document.querySelector('.m_float-wrap').classList.contains('pb-change')){
                document.querySelector('.m_float-wrap').classList.add('pb-change')
                document.querySelector('.scroll-arrow-wrap').classList.add('hide')
            }
        } else {
            if(document.querySelector('.m_float-wrap').classList.contains('pb-change')){
                document.querySelector('.m_float-wrap').classList.remove('pb-change')
                document.querySelector('.scroll-arrow-wrap').classList.remove('hide')
            }
        }
    };

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

        this.split = new SplitText( this.wordElem , { 
            type: "words, chars", 
            position: 'absolute' 
        });
    }
    
    _set(){
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
            }, 
            onLeaveBack:()=>{
                if(isRefresh){
                    document.querySelector('.m_desc_txt-wrap').classList.remove('show')
                    img._set();
                    textMasking.goToAndStop(1, false)
                    document.querySelector('.desc_info-txt_strong').style.color = "#FFF"; 
                }
            }
        });

        ScrollTrigger.create({
            // markers: true, 
            trigger: '.m_desc_info-wrap',
            start: "top 95%",
            onEnter:()=>{
                document.querySelector('.m_desc_info-wrap').classList.add('show')
                setTimeout(()=>{textAnimation()}, 500)
            },
            onLeaveBack:()=>{
                if(isRefresh) document.querySelector('.m_desc_info-wrap').classList.remove('show')
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
            imgTime: 1.5, imgEase: BezierEasing(0.6,0,0.1,1),
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
            // onLeaveBack:()=>{
            //     if(isRefresh)reset()
            // }
        }

        ScrollTrigger.create({
            trigger: '.m_lyb.is-1',
            onEnter:()=> launchImg.play(),
            onLeaveBack:()=> launchImg._set(),
            ...opts
        })
        ScrollTrigger.create({
            trigger: '.m_lyb.is-2',
            onEnter:()=> yourImg.play(),
            onLeaveBack:()=> yourImg._set(),
            ...opts
        })
        ScrollTrigger.create({
            trigger: '.m_lyb.is-3',
            onEnter:()=> brandImg.play(),
            onLeaveBack:()=> brandImg._set(),
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
        const ani = gsap.to(".m_next-fashion", 1, {y: '30%' })
        
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
const FAQ = new Swiper(".m_faq-wrap", {slidesPerView: "auto",});

/* ====================================================================================================================*/
// /* 문의하기 */
const Section_Contact = (function(exports){
    let plane;
    function init(){
        plane = lottie.loadAnimation({
            container: document.querySelector('.m_section-contact .m_inner'),
            loop: false, autoplay: false, renderer: 'svg', 
            // path: "https://static.msscdn.net/webflow/static/partners/path/m_plane.json",
            animationData: path_m_plane 
        });
        
        plane.onComplete = function(){
            gsap.to( '.m_inner', .55, { 
                delay: .6, height: 0, y:-460,
                backgroundColor:'#BDFF00',
                ease: BezierEasing(0.5,0,0,1),
                onComplete:()=>{
                    plane.goToAndStop(1, false)
                    gsap.set('.m_inner', { opacity: 0 } )
                } 
            });
        };

        gsap.set(['.msg_success', '.msg_success > *'], {height: 0, fontSize: 0, padding: 0} )
        $('#email-form').submit(function(e){
            fromSubmitPlay()
        });
        // $('.m_contact_submit').click(function(){ // 테스트 용
        //     fromSubmitPlay()
        // })
    };

    function fromSubmitPlay(){
        $('#email-form').css('display', "none");
        $('.m_contact_submit_finish').css("pointer-events" , "auto")

        const tl = gsap.timeline({})
        tl.set('.m_inner', { autoAlpha: 1, height: 50, y:0, backgroundColor:'#BDFF00'} )
        tl.to('.m_inner', 0.5, { 
            backgroundColor:'#333',
            height: 460, 
            ease: BezierEasing(0.6,0,0.1,1),
            onComplete:()=>{
                fromReset()
            }
        })
        plane.play()
    }

    

    function fromReset(){
        $('#email-form').css('display', "block");
        $('.m_contact_submit_finish').css("pointer-events" , "none");

        $('#email-form input[type=email]').val('');
        $('#email-form input[type=text]').val('');
        $('#email-form #Content-2').val('');
    }


    exports.init = init;
    return exports
})({})

/* ====================================================================================================================*/
// /* 상세 */
class ShowDetail {
    constructor( opts ){
        const defaults = {
        }
        this.opts = {...defaults, ...opts};  

        this.title = document.querySelector('.m_detail .m_detail-h1')
        this.brandName = document.querySelector('.m_detail .m_detail-brand-name')
        this.ceo = document.querySelector('.m_detail .m_detail-ceo_name')

        this.brandLink = document.querySelector("#Detail_Url_Brand");
        this.instaLink = document.querySelector("#Detail_Url_Insta");
        this.shopLink = document.querySelector("#Detail_Url_Shop");

        this.mainImg = document.querySelector('#Detail_Img');

        this.intro = document.querySelector('#DetailTxt_Intro');
        this.after = document.querySelector('#Detail_After');

        this.gallery = document.querySelector('.m_detail-gallery_wrap')

        this.contentReset()
    }

    init(){
        loader = document.createElement('div');
        loader.classList.add('loader-wrapper')
        loader.innerHTML = `<div class="loader"></div>`
        document.body.appendChild(loader)
    }

    pageShow(src){
        loader.classList.add('show')
        this.fetchPage(src)
    }

    contentReset(){
        this.loadImgSrc = []
        gsap.to('.m_detail-wrap', 0, { scrollTo: 0  });

        this.title.innerText =  this.brandName.innerText = this.ceo.innerText = ""
        this.intro.innerText = this.after.innerText = ""
        this.brandLink.style.display = this.instaLink.style.display = this.shopLink.style.display = 'block';
        document.querySelectorAll('.m_detail-gallery_img').forEach( (item)=>item.remove() )
        document.querySelector('.m_detail-wrap').style.top = 0;
    }

    fetchPage(src){
        // loader.classList.add('show')
        const response = fetch(src).then((response)=>{
            return response.text()
        }).then((html)=>{
            const parser = new DOMParser();
            const doc = this.doc = parser.parseFromString(html, 'text/html');

            // 상단 이미지 //
            const mainImagUrl = doc.querySelector('.winner_img').style.backgroundImage;
            this.mainImg.style.backgroundImage = mainImagUrl; 

            // 링크 //
            const brandLink = doc.querySelector('#goToBrand') ? doc.querySelector('#goToBrand').getAttribute('href') : undefined;
            const instaLink = doc.querySelector('#goToInsta') ? doc.querySelector('#goToInsta').getAttribute('href') : undefined;
            const shopLink = doc.querySelector('#goToShop') ? doc.querySelector('#goToShop').getAttribute('href') : undefined;

            if(brandLink != undefined)  this.brandLink.setAttribute('href', brandLink)
            else                        this.brandLink.style.display = 'none'
            if(instaLink != undefined)  this.instaLink.setAttribute('href', instaLink)
            else                        this.instaLink.style.display = 'none'
            if(shopLink != undefined)  this.shopLink.setAttribute('href', instaLink)
            else                       this.shopLink.style.display = 'none'
            
            // 브랜드명 //
            const title = doc.querySelector('.winner_content > .winner_h1').innerText;
            const brandName = doc.querySelector('.winner_content > .winner_h3').innerText;
            const ceo = doc.querySelector('.winner_ceo > .winner_h3.is-name').innerText;

            this.title.innerText = title;
            this.brandName.innerText = brandName;
            this.ceo.innerText = ceo;

            // 내용 //
            this.intro.innerText = doc.querySelector('#RichIntro').innerText;
            this.after.innerText = doc.querySelector('#RichAfter').innerText;

            // 갤러리 이미지 //
            let gUrl = []
            doc.querySelectorAll('.winner_g-thumb').forEach((item, i)=>{
                gUrl.push( item.style.backgroundImage );
            })
            this.gallery.style.overflowX = 'scroll'
            gUrl.forEach((imgUrl, i)=>{
                this.gallery.innerHTML += `<div class="m_detail-gallery_img"></div>`;
                document.querySelector(`.m_detail-gallery_img:nth-child(${i+1})`).style.backgroundImage = imgUrl
            });

            this.imageload()
        })
    }

    imageload(){ 
        let imgCount = 0;
        let imgLoad = imagesLoaded("#DetailContent", {background: ".m_detail-gallery_img"} );
        imgLoad.on('progress', (intance, image)=>{
            imgCount++;
            if(imgCount === imgLoad.images.length){
                console.log('billboard images loaded');
                // 등장 //
                gsap.to('.m_detail', .55, {y: '0%', ease: 'Quint.easeOut', onComplete:()=> loader.classList.remove('show') })
            }
        })
    
    }

    closePage(){
        gsap.to('.m_detail', .35, {y: '100%', ease: BezierEasing(0.6,0,1,1), onComplete:()=>{
            this.contentReset();
            isGNBShow = false;
            bodyBlock(false);
        }})
    }

}


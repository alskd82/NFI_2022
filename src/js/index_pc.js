// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { SplitText } from "gsap/SplitText";

// import imagesLoaded from "imagesloaded";

// import lottie from 'lottie-web';
// // import lottiePath from './section-desc_text.json';

// import BezierEasing from './BezierEasing.js'
// // import ShowDetail from "./ShowDetail.js"

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const gnbWrap = document.querySelector('.gnb-wrap');
const floatingDownload = document.querySelector('.float-download');

let billboard;
let detailContent; // 상세 
let loader; // 상세 불러올 때 로딩 띄우기 위해
let isGnbOpenForce = false; // gnb 강제 오픈 //
let prevPageY;
let scrollDirection;

let isRefresh = false;

document.addEventListener('DOMContentLoaded', ()=>{
    addEvent();
    
    GNB.init();
    Floating.init();

    Section_Desc.init();

    Section_TargetHow()
    Section_Step.init();

    Section_List();
    Section_Supporters();

    FormSubmit()

    billboard = new Billboard({
        elem: '.billboard',
        imgElem: '.billboard-img',
        imgWrap: '.billboard-img-wrap',
        imgScale: 1.1,
        overlayTime: 1,
        imgTime: 4,
    });

    /* 랜딩 애니메이션 */
    let imgCount = 0;
    let imgLoad = imagesLoaded('.billboard',{background: '.billboard-img'} );

    imgLoad.on( 'progress', function(instance, image) {
        let result = image.isLoaded ? 'loaded' : 'broken';
        console.log( 'image is ' + result + ' for ' + image.img.src );
        imgCount++
        if(imgCount === imgLoad.images.length){
            console.log('billboard images loaded')
            gsap.delayedCall(1, landing );
        }
    });
    
    function landing(){
        Loading.play()
        setTimeout(() => {
            document.body.classList.add('loaded');
            billboard.play();
        }, 1000);
    }
    // billboard.play()

    // /*  상세 */
    detailContent = new ShowDetail();
    detailContent.init()
});

window.addEventListener('load', ()=>{
    if(window.pageYOffset > 0){
        // gsap.set(window, {  scrollTo:0 });
        setTimeout(()=> {
            window.scrollTo(0,0)
            billboard.dim(0)
        }, 0)
    }

    Section_Apply.init();
    Section_LYB.init();
    Section_Next.init();
})



/* ====================================================================================================================*/
/* Event */

function addEvent(){
    floatingDownload.addEventListener('mouseenter', Floating.floatingDownload_Fn, false);
    floatingDownload.addEventListener('mouseleave', Floating.floatingDownload_Fn, false);
    

    window.addEventListener('resize', ()=>{  ScrollTrigger.refresh(); })
    window.addEventListener('scroll', scroll_Fn, false);

    /* 이메일 바로가기 */
    document.querySelector('.txt_email-underline').addEventListener('click', ()=> goToEmail() )
    document.querySelector('.map_txt-item_t3').addEventListener('click', ()=> goToEmail() )
    const goToEmail =()=> window.open('about:blank').location.href = 'mailto:nextfashion@musinsapartners.com';

    /* 지원서 다운로드 링크 */
    floatingDownload.addEventListener('click', downloadLink, false );
    document.querySelector('.btn_download').addEventListener('click', downloadLink, false )
    function downloadLink(e) {
        e.preventDefault()
        window.open('about:blank').location.href = document.querySelector('#DonwloadURL').getAttribute('href'); 
    }

    /* 섹션 이동  */
    const targetSections = [
        '.section-apply', 
        ".section-lyb", 
        '#SectionBenefit',
        "#SectionWinner",
        "#SectionFAQ",
        "#SectionContact",
        "#SectionSupporters"
    ]
    document.querySelectorAll('.navi_item').forEach((navi, i)=>{
        navi.addEventListener('click', (e)=>{
            e.preventDefault();
            // const target = e.currentTarget.getAttribute('href')
            isGnbOpenForce = true;
            if( gnbWrap.getAttribute('data-state') === "hide") GNB.gnbShowHide_Fn( 'show' )

            let _offset = 100;
            if(i === 3 || i === 6) {
                _offset = 0;
            }
            else if( i === 2) {
                _offset = -80;
            }
            gsap.killTweensOf(window) 
            gsap.to(window, 1.2, { 
                scrollTo:{ y: targetSections[i] , offsetY: _offset}, 
                ease: "Quart.easeInOut",
                onComplete:()=> { gsap.delayedCall(0.2, isGnbOpenForceReset) }
            });

            function isGnbOpenForceReset(){
                if(gsap.isTweening(window)) return;
                isGnbOpenForce = false
            }
        })
    })

    /* 로고 이동 */
    document.querySelector('.logo-wrap').addEventListener('click', e =>{
        // window.open('about:blank').location.href = "https://www.musinsapartners.co.kr/";
        // window.location.reload();
        document.querySelector('#LoadWrap').style.display = 'block';
        Loading.overlay_play();
        isRefresh = true;
    })

    /* 상세 불러오기 */
    document.querySelectorAll('.winner-link').forEach((winner, i)=>{
        winner.addEventListener('click', showDetailPage_Fn, false);
    });
}

/* ====================================================================================================================*/
/* Page Loading */

const Loading = (function(exports){
    const elem = document.querySelector('#LoadWrap');
    const spanBig = elem.querySelector('.load-text.big div');
    const spanSmall = elem.querySelector('.load-text.small div');
    const overlayPath = elem.querySelector('.overlay_path');

    function init(){
        gsap.set(spanBig, {y: 75} )
        gsap.set(spanBig.querySelectorAll('span'), {y: -150} )
        gsap.set(spanBig.parentElement, {opacity: 1})
        // gsap.set(elem, {clipPath: '0% 0%, 100% 0%, 100% 100%, 0% 100%'})
    }
    init()

    function play(){
        const span = spanSmall.querySelectorAll('span');
        span.forEach(elem => {
            elem.classList.remove('load')
            elem.style.animation = 'ani'
        });
        gsap.to(spanSmall, .6, {y: -50, ease: 'Quint.easeOut'})
        gsap.to(span, .6, {y: 100, ease: 'Quint.easeOut'});
        gsap.to(spanBig, .6, {delay: .1, y: 0, ease: 'Quint.easeOut'} )
        gsap.to(spanBig.querySelectorAll('span'), .6, {delay: .1, y: 0, ease: 'Quint.easeOut' } )
        gsap.delayedCall(0.3, overlay_play )
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
/* GNb */
const GNB = (function(exports){
    /* gnb 등장-숨기기 */
    function gnbShowHide_Fn( state ){       
        if( document.querySelector('.winner_page') ) return;
        if( document.body.style.position === 'fixed' ) return
        const _y = (state === 'show') ? 0 : -gsap.getProperty('.gnb-wrap', 'height');
        document.querySelector('.gnb-wrap').setAttribute('data-state', state)
        gsap.to('.gnb-wrap .navi', .6, {ease: "Quint.easeOut", y: _y})
    }

    /* gnb 색상 바꾸기 */
    function gnbChangeColor_Fn(isChange){                   
        const _b = gnbWrap.classList.contains('black') 
        if(isChange && !_b) gnbWrap.classList.add('black')
        else if(!isChange && _b) gnbWrap.classList.remove('black')
    }

    /* gnb 색상 변화 시점 */
    const ioGnbOptions = { rootMargin: '0px 0px -95% 0px' }
    const ioGnb = new IntersectionObserver(( entries, observer )=>{
        entries[0].isIntersecting ? gnbChangeColor_Fn(true) : gnbChangeColor_Fn(false)
    }, ioGnbOptions)
    // ioGnb.observe( document.querySelector('.section-supporters') )

    /* 풋터 등장 시점 - gnb 강제 호출을 위해 */
    const ioFooterOptions = { rootMargin: '0px 0px -160px 0px' }
    const ioFooter = new IntersectionObserver(( entries, observer )=>{
        isGnbOpenForce = entries[0].isIntersecting
    }, ioFooterOptions);
    // ioFooter.observe( document.querySelector('footer') )

    function init(){
        ioGnb.observe( document.querySelector('.section-supporters') )
        ioFooter.observe( document.querySelector('footer') )
    }

    exports = {init, gnbShowHide_Fn, gnbChangeColor_Fn};

    return exports
})({})

/* ====================================================================================================================*/
/* Floating */
const Floating = (function(exports){
    /* 참가 신청서 색상 바꾸기 */
    function floatingColor_Fn(isChange){ 
        const _b = floatingDownload.classList.contains('mode-fill');
        if(isChange && !_b) floatingDownload.classList.add('mode-fill')
        else if(!isChange && _b) floatingDownload.classList.remove('mode-fill')
    }

    /* 다운로드 버튼 색상 변화 시점 */
    const ioFloatingOptions = { rootMargin: '0px 0px -85px 0px' }
    const ioFloating = new IntersectionObserver(( entries, observer )=>{
        if(entries[0].isIntersecting){
            floatingDownload.setAttribute('data-mode', 'fill')
            // floatingDownload.classList.add('mode-fill')
            gsap.set('.float-download .ic-download_arrow, .ic-download_floor' , {stroke: 'black'})
            gsap.set('.float-download span' , {color: 'black'})
            gsap.set('.float-download .ic-download' , {backgroundColor: '#BDFF00'})
        } else {
            floatingDownload.setAttribute('data-mode', 'stroke')
            // floatingDownload.classList.remove('mode-fill')
            gsap.set('.float-download .ic-download_arrow, .float-download .ic-download_floor' , {stroke: '#BDFF00'})
            gsap.set('.float-download span' , {color: '#BDFF00'})
            gsap.set('.float-download .ic-download' , {backgroundColor: 'rgba(0,0,0,0)'})
        }
    }, ioFloatingOptions)
    // ioFloating.observe( document.querySelector('.section-supporters') );

    /* 다운로드 버튼 마우스 반응 */
    function floatingDownload_Fn(e){
        // if(floatingDownload.getAttribute('data-mode') != 'stroke') return;
        const _arrow = document.querySelector('.float-download .ic-download_arrow');
        const _floor = document.querySelector('.float-download .ic-download_floor');
        if(e.type === 'mouseenter'){
            let tl = gsap.timeline()
            tl.to( _arrow, 0.25, {ease: BezierEasing(0.33, 0, 0.67, 1.0), y: 25, onComplete:()=> gsap.set( _arrow,{ y: -25 }) } )
            tl.to( _floor, 0.2, {ease: BezierEasing(0.33, 0, 0.67, 1.0), transformOrigin:"center", scaleX: 0}, "=-0.25")
            tl.to( _floor, 0.25, {ease: "Quint.easeOut", scaleX: 1 }, "=+0.1")
            tl.to( _arrow, 0.3, {ease: "Quint.easeOut", y: 0 }, "=-0.2");

            if(floatingDownload.getAttribute('data-mode') != 'stroke') return;
            gsap.to( [_arrow,_floor] , 0.2, {stroke: 'black'})
            gsap.to('.float-download span' , 0.2, {color: 'black'})
            gsap.to('.float-download .ic-download' , 0.2, {backgroundColor: '#BDFF00'})
        }
        else if(e.type === 'mouseleave'){
            if(floatingDownload.getAttribute('data-mode') != 'stroke') return;
            gsap.to( [_arrow,_floor] , 0.2, {stroke: '#BDFF00'})
            gsap.to('.float-download span' , 0.2, {color: '#BDFF00'})
            gsap.to('.float-download .ic-download' , 0.2, {backgroundColor: 'rgba(0,0,0,0)'})
        }
    }

    function init(){
        ioFloating.observe( document.querySelector('.section-supporters') );
    }

    exports = { init, floatingDownload_Fn, floatingColor_Fn }
    return exports;
})({})

/* ====================================================================================================================*/
/* SCROLL */

function scroll_Fn(e){
    if( window.pageYOffset <= window.innerHeight) billboard.dim(window.pageYOffset)
    else {
        // billboard.stop();
        gsap.to('.billboard', .1, {opacity: 0})
    }

    if(prevPageY > window.pageYOffset )      scrollDirection = 'up'
    else if(prevPageY < window.pageYOffset ) scrollDirection = 'down'
    prevPageY = window.pageYOffset;

    if(!isGnbOpenForce){
        if( window.pageYOffset > 500 &&  scrollDirection == 'down'){
            if( gnbWrap.getAttribute('data-state') === "show") GNB.gnbShowHide_Fn( 'hide' )
        } else {
            if( gnbWrap.getAttribute('data-state') === "hide") GNB.gnbShowHide_Fn( 'show' )
        }
    } else {
        if( gnbWrap.getAttribute('data-state') === "hide") GNB.gnbShowHide_Fn( 'show' )
    }
}


/* ====================================================================================================================*/
/* Billboard */
class Billboard {
    constructor( opts ){
        if(opts.imgElem === undefined) return;
        const defaults = {
            imgScale: 1.1,
            overlayTime: 1,
            imgTime: 4,
        }
        this.opts = {...defaults, ...opts}
        this.imgArr = document.querySelectorAll(opts.imgElem)
        this.imgWrapArr = document.querySelectorAll(opts.imgWrap)

        this.index = 0;
        this._set();
        //this.play();
    }

    _set(){
        gsap.killTweensOf( this.imgArr )
        gsap.killTweensOf( this.imgWrapArr )
        gsap.set(this.imgArr, { scale: this.opts.imgScale })
        gsap.set(this.imgWrapArr, { opacity: 0, zIndex: 1 });

        this.gsapArr = [];
        this.imgArr.forEach((item,i)=>{
            const tl = gsap.timeline({paused: true});
            tl.fromTo(this.imgWrapArr[i], {
                opacity: 0,
            }, {
                opacity: 1,
                duration: this.opts.overlayTime,
                ease: "none",
                onComplete:()=>{
                    gsap.delayedCall( this.opts.imgTime-this.opts.overlayTime*2, this.nextPlay.bind(this) )
                }
            });
            tl.fromTo(item, {
                scale: this.opts.imgScale
            }, {
                duration: this.opts.imgTime, 
                scale: 1, 
                ease: "none",
                onComplete:()=>{
                    this.imgWrapArr[i].style.opacity = 0
                }
            }, 0);
            this.gsapArr.push( tl )
        })
    }

    nextPlay(){
        this.index = (this.index + 1) % this.imgArr.length;
        // console.log(this.index)
        this.imgWrapArr[this.index].style.zIndex = 3
        this.imgWrapArr.forEach((item, i)=>{
            if( this.index != i) this.imgWrapArr[i].style.zIndex = 1
        })
        this.gsapArr[this.index].restart();
    }

    play(){
        this.gsapArr[this.index].play()
    }
    stop(){
        // this.isPlay = false;
    }

    dim(y){
        const vh = window.innerHeight;
        let opa = gsap.utils.mapRange(vh*0.1, vh*0.75, 1, 0, y.toFixed(1)).toFixed(2)
        if(opa > 1) opa = 1
        else if( opa < 0) opa = 0
        gsap.to( this.opts.elem, 0, {opacity: opa})
    }

    isTween(){
        return gsap.isTweening( this.imgArr )
    }
} 

/* ====================================================================================================================*/
/* ClipMaskImg*/
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
/* For Next Fashion */
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
        gsap.set( '.next-fashtion-txt', { scale: this.opts.wordScale  })
    }

    play(){
        // gsap.to( this.split.words, this.opts.time, {delay:this.opts.delayTime, scale: 1, ease: this.opts.easing })
        gsap.to( '.next-fashtion-txt', this.opts.time, {scale: 1 , ease: this.opts.easing })
        gsap.to( this.split.chars, this.opts.time, {delay:this.opts.delayTime, scale: 1, x: 0, ease: this.opts.easing });
        gsap.to( this.split.chars, this.opts.time * .7, {delay:this.opts.delayTime, opacity: 1 })
    }
    
}

/* ====================================================================================================================*/
/* Section_Desc - ScrollTrigger */

const Section_Desc = (function(exports){
    //--------------------------------------------------------------------------------------
    /* lottie play */
    document.querySelector('.desc_info-txt').innerHTML += `<div id="textMasking"></div>`;
    const textMasking = lottie.loadAnimation({
        container: document.querySelector('#textMasking'),
        // path: 'https://static.msscdn.net/webflow/static/partners/section-desc_text.json',
        animationData: path_textMastking,
        autoplay: false, loop: false
    })
    //------------------------------------------------------------------------------------------

    const showTxt_tl = gsap.timeline({paused: true})
    let descClipMaskImg
    function init(){
        descClipMaskImg = new ClipMaskImg({
            maskElem: '.desc_img-mask',
            imgElem: '.desc_img',
            clipPosition: 'left',
            imgDelayTime: .3,
        });
        
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.desc_img-wrap',
            start: "top 95%",
            onEnter:()=>{
                descClipMaskImg.play()
                gsap.to('.section-desc .desc_txt > div', 1, {delay: .5, y: '0%', stagger: 0.1, ease: "Quint.easeOut"})
            },
            onLeaveBack:()=>{
                if(isRefresh) reset()
            }
        })

        
        showTxt_tl.to('.section-desc .desc_info-txt_p', 1.0, { y: 0, stagger: 0.1, ease: "Quint.easeOut"})
        showTxt_tl.to('.section-desc .desc_info-txt_p', .5, { autoAlpha: 1, stagger: 0.1 , ease: "none"}, 0)

        ScrollTrigger.create({
            // markers: true, 
            // animation: showTxt_tl,
            trigger: '.desc_info-wrap',
            start: "top 95%",
            onEnter:()=>{
                showTxt_tl.play()
                setTimeout(()=>{ 
                    textMasking.play();
                    setTimeout(()=>{
                        document.querySelector('.section-desc .desc_info-txt_strong').style.color = "#BDFF00"; 
                    },500)
                }, 600)
            }
        });
        reset();
    }


    function reset(){
        descClipMaskImg._set();
        gsap.set('.section-desc .desc_txt > div', {y: '90%'})  // 이미지 위 텍스트들 숨기기

        gsap.set( '.section-desc .desc_info-txt_p', {y: 60, autoAlpha: 0 }) // 설명 글 숨기기
        document.querySelector('.section-desc .desc_info-txt_strong').style.color = "white"; // 강조문구 흰색으로 셋팅
        textMasking.goToAndStop(1,false);

        showTxt_tl.pause(0);
    }

    exports.init = init;

    return exports;
})({})


/* ====================================================================================================================*/
// /* APPLAY - ScrollTrigger */
const Section_Apply = (function(exports){
    let applyClipMaskImg;
    function init(){
        applyClipMaskImg = new ClipMaskImg({
            maskElem: '.apply-mask',
            imgElem: '.apply-img',
            clipPosition: 'center',
            maskTime: 1, maskEase: BezierEasing(0.5,0,0,1),
            imgTime: 1.7, imgEase: BezierEasing(0.6,0,0.1,1),
            wordElem: '.section-apply .apply-txt',
            charGap: 450,
        });
        reset()

        ScrollTrigger.create({
            // markers: true, 
            trigger: '.section-apply',
            start: `top 75%`, 
            onEnter:()=>{
                applyClipMaskImg.play();                
                gsap.to('.apply-wrap', 1.5, { y: 0, ease: BezierEasing(0.4,0,0.2,1)})
            },
            onLeaveBack:()=>{
                if(isRefresh) reset()
            }
        });
        
    }

    function reset(){
        gsap.set('.apply-wrap',{ y: 200 }); // 하단 +200 셋팅
        applyClipMaskImg._set();
    }

    exports.init = init
    return exports;
})({})

/* ====================================================================================================================*/
// /* 모집대상 - 지원 방법 - 선발 절차 - 선발 혜택*/
const Section_TargetHow = function(){
    
    gsap.set(
        [ 
        '.section-target .info-txt_wrap',
        '.section-how .info-txt_wrap',
        '.section-benefit .info-txt_wrap',
        '.section-winner .info-txt_wrap',
        ".section-step .info-txt_wrap"
        ], { y: 100, opacity: 0 })

    function scrollTrigger_Fn( elem ){
        const tl = gsap.timeline().to( `${elem} .info-txt_wrap`, 1.5, {y: 0, opacity: 1, ease: "Quart.easeOut" });
        let triggerElem;
        let startPoint;
        if( elem === '.section-benefit' || elem === '.section-winner'){
            triggerElem= `${elem} .container-1380`;
            startPoint = `top bottom`;
        }
        else if( elem === ".section-step"){
            triggerElem= `${elem} .container-1380`;
            startPoint = `top 75%`;
        }
        else {
            triggerElem = elem;
            startPoint = `top 75%`;
        }

        ScrollTrigger.create({
            // markers: true, 
            animation: tl,
            trigger: triggerElem,
            start: startPoint, 
            onLeaveBack:()=>{
                if(isRefresh) tl.pause(0)
            }
        })
    }

    scrollTrigger_Fn('.section-target')
    scrollTrigger_Fn('.section-how')

    scrollTrigger_Fn('.section-step')

    scrollTrigger_Fn('.section-benefit')
    scrollTrigger_Fn('.section-winner')
}

/* ====================================================================================================================*/
// /* 런치 유어 브랜드 */
const Section_LYB = (function(exports){
    let launchClipMaskimg
    let yourClipMaskimg
    let brandClipMaskimg

    function init(){
        launchClipMaskimg = new ClipMaskImg({
            maskElem: ".lyb_launch-mask",
            imgElem: ".ybd_your-img",
            clipPosition: 'left',
            maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
            imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
            wordElem: '.lyb_launch .apply-txt',
            charGap: 450,
        })
        yourClipMaskimg = new ClipMaskImg({
            maskElem: ".lyb_your",
            imgElem: ".ybd_brand-img",
            clipPosition: 'left',
            maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
            imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
            wordElem: '.lyb_your .apply-txt',
            charGap: 450,
        })
        brandClipMaskimg = new ClipMaskImg({
            maskElem: ".lyb_brand",
            imgElem: ".lyb_brand-img",
            clipPosition: 'left',
            maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
            imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
            wordElem: '.lyb_brand .apply-txt',
            charGap: 450,
        })
        reset()

        function play(){
            launchClipMaskimg.play()
            setTimeout(()=>{ yourClipMaskimg.play() }, 200)
            setTimeout(()=>{ brandClipMaskimg.play() }, 300)
        }

        ScrollTrigger.create({
            // markers: true, 
            trigger: '.section-lyb',
            start: `top 85%`, 
            onEnter:()=>{
                play()
            },
            onLeaveBack:()=>{
                if(isRefresh)reset()
            }
        })
    }

    function reset(){
        launchClipMaskimg._set();
        yourClipMaskimg._set();
        brandClipMaskimg._set();
    }

    exports.init = init;

    return exports;
})({})

/* ====================================================================================================================*/
// /* 스텝 */
const Section_Step = (function(exports){
    // const stepArr = document.querySelectorAll('.section-step .step_wrap:nth-of-type(1) .step_block_color');
    const stepArr = document.querySelectorAll('#step .step_block_color');
    const stepTxtArr = document.querySelectorAll('#stepTxt .step_block_color');

    function init(){
        ScrollTrigger.create({
            // markers: true, 
            trigger: '#step',
            start: `top 85%`, 
            onEnter:()=>{
                gsap.to( stepArr, 0.75, {stagger: 0.05, clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.6,0,0.1,1)})
                gsap.to( stepArr, 1, {stagger: 0.05, y: 0, ease: BezierEasing(0.6,0,0.1,1)})
                gsap.to( stepTxtArr, 0.75, {stagger: 0.05, clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.6,0,0.1,1)})
                gsap.to( stepTxtArr, 1, {stagger: 0.05, y: 0, ease: BezierEasing(0.6,0,0.1,1)})
            },
            onLeaveBack:()=>{
                if(isRefresh) reset()
            }
        });

        reset()
    }

    function reset(){
        stepArr.forEach((item, i)=>{
            gsap.set( item, {clipPath: `circle(0% at 50% 50%)`, y: 150})
            gsap.set( stepTxtArr[i], {clipPath: `circle(0% at 50% 50%)`, y: 150})
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
        gsap.set(".next-fashion", {y: '-50%' })
        const ani = gsap.to(".next-fashion", 1, {y: '30%' })
        
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.section-next-fashion',
            animation: ani,
            scrub: true
        })

        textMotion = new LetterSpacing({
            wordElem: '.next-fashtion-txt', 
            wordScale: 1.5, 
            charScale: 1
        })   
        reset()

        ScrollTrigger.create({
            // markers: true,
            id: 'textMotion', 
            start: "top 55%",
            trigger: '.section-next-fashion',
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
const Section_List = function(){
    let listMaskArr = document.querySelectorAll('.winner-mask');
    let listLinkArr = document.querySelectorAll('.winner-link');
    listLinkArr.forEach((item, i)=>{ gsap.set( item, { autoAlpha: 0 }) })

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

    let rowTotalNum = Math.ceil(document.querySelectorAll('.cms-winner_item').length / 3);

    for(let i=0; i<rowTotalNum; i++){
        ScrollTrigger.create({
            // markers: true, 
            trigger: listMaskArr[i*rowTotalNum],
            start: `center 95%`,
            onEnter:()=>{
                tl(i*rowTotalNum)
                if(listMaskArr[i*rowTotalNum + 1]) setTimeout(()=>{ tl(i*rowTotalNum + 1) }, 100)
                if(listMaskArr[i*rowTotalNum + 2]) setTimeout(()=>{ tl(i*rowTotalNum + 2) }, 200)
            },
            onLeaveBack: self => self.disable(),
            // onRefresh:(self)=>{
            //     // self.start = `top ${window.innerHeight - 60}`,
            //     // console.log(self)
            // }
        })
    }

    // // reset Trigger //
    // ScrollTrigger.create({
    //     trigger: '.section-winner',
    //     onLeaveBack:()=>{
    //         if(!isRefresh){
    //             gsap.set(listMaskArr, {width: '0%', scale: 1})
    //             gsap.set( listLinkArr, { autoAlpha: 0 })
    //         }
            
    //     }
    // })
}

/* ====================================================================================================================*/
// /* 서포터 */
const Section_Supporters = function(){

    // gsap.set(".supporters-inner", {y: 250 })
    // let ani = gsap.to(".supporters-inner", 1, {y: 0 })
    // ScrollTrigger.create({
    //     markers: true,
    //     trigger: '.section-supporters',
    //     end:'top 100',
    //     scrub: true,
    //     animation: ani,
    // })

    ScrollTrigger.create({
        // markers: true,
        id: 'sticky',
        trigger: '.support-txt_wrap',
        start:'top 100',
        end: ()=> `+=${gsap.getProperty('.support-list', 'height')-80-gsap.getProperty('.support-txt_wrap', 'height')} 100 `,
        scrub: true,
        pin: true
    })

}

/* ====================================================================================================================*/
// /* 상세 페이지 */
function showDetailPage_Fn(e){
    e.preventDefault();
    const URL = e.currentTarget.getAttribute('href');
    // const URL = 'winner/'
    detailContent.bodyBlock(true, window.pageYOffset);
    detailContent.fetchPage( URL );
}

class ShowDetail {
    constructor( opts ){
        const defaults = {
        }
        this.opts = {...defaults, ...opts};  
        this.bodyScrollY

        this.pageElem;
        this.dimElem;
        this.contenteElem;
        this.galleryFocusIndex;
    }

    init(){
        loader = document.createElement('div');
        loader.classList.add('loader-wrapper')
        loader.innerHTML = `<div class="loader"></div>`
        document.body.appendChild(loader)
    }

    fetchPage(src){
        loader.classList.add('show')
        const response = fetch(src).then((response)=>{
            return response.text()
        }).then((html)=>{
            const parser = new DOMParser();
            const doc = this.doc = parser.parseFromString(html, 'text/html');

            // console.log(doc)
            this.pageElem = doc.querySelector('.winner_page');
            
            this.dimElem = doc.querySelector('.winner_page .winner_page-dim');
            this.closeElem = doc.querySelector('.winner_page .ic_close');

            this.panElem = doc.querySelectorAll('.winner_page .winner_pan');

            this.galleryFocusIndex = 0

            gsap.set( [this.dimElem,this.closeElem], {opacity: 0} );
            gsap.set( this.panElem, { clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)' })
            // gsap.set( this.panElem, { clipPath: `polygon(0% 50%, 100% 50%, 100% 50.5%, 0% 50.5%)`});

            document.body.appendChild( this.pageElem )
            this.loadingPlay()
            this.addEvent();            
        })
    }

    addEvent(){
        this.closeElem.addEventListener('click', this.close.bind(this), false);
        this.dimElem.addEventListener('click', this.close.bind(this), false);
        
        if(this.pageElem.querySelector('.btn_g-l')){
            this.arrL = this.pageElem.querySelector('.btn_g-l');
            this.arrR = this.pageElem.querySelector('.btn_g-r');
            this.imgTotalNum = this.pageElem.querySelectorAll('.winner_g-item').length
            if( this.imgTotalNum > 4){
                this.arrL.addEventListener('click', this.arr_Fn.bind(this), false);
                this.arrR.addEventListener('click', this.arr_Fn.bind(this), false);
                gsap.set( this.arrL, {autoAlpha: 0})
            } else {
                this.pageElem.querySelector('.winner_g-arr').remove()
            }
        }
    }
    removeEvent(){
        this.dimElem.removeEventListener('click', this.close.bind(this), false)
        this.closeElem.removeEventListener('click', this.close.bind(this), false)
    }

    loadingPlay(){
        gsap.to( this.dimElem, .2, {opacity: 1, ease: 'quint.easeOut'} );
        this.pageElem.querySelector('.winner_container').style.pointerEvents = 'none';

        const imgLoad = imagesLoaded( this.pageElem, { background: '.winner_g-thumb' });
        let percent = 0;
        imgLoad.on('always', ()=>{
            imgLoad.images.forEach((img, i)=>{
                let image = imgLoad.images[i];
                let result = image.isLoaded ? 'loaded' : 'broken';
                console.log( 'image is ' + result + ' for ' + image.img.src );
                percent = i / (imgLoad.images.length-1) * 100;

                
                gsap.set( this.panElem, { 
                    clipPath: `polygon(${50-(percent/2)}% 50%, ${50+(percent/2)}% 50%, ${50+(percent/2)}% 50.05%, ${50-(percent/2)}% 50.05%)`,
                });
                //  gsap.set( this.panElem, { clipPath: `polygon(0% 50%, 100% 50%, 100% 50.5%, 0% 50.5%)`});
                if(percent === 100) this.open()
            })
        })
    }

    bodyBlock( isBlock, scrollY ){
        if(isBlock){
            this.bodyScrollY = scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
        } else {
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('position');
            document.body.style.removeProperty('top');
            window.scrollTo(0, this.bodyScrollY);
        }
    }

    open(){
        loader.classList.remove('show')
        this.pageElem.querySelector('.winner_container').style.pointerEvents = 'auto'
        gsap.to( this.closeElem, .2, {opacity: 1, ease: 'quint.easeOut'} );
        gsap.to( this.panElem, .6, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: BezierEasing(0.8,0,0,1)})
    }

    close(e){
        loader.classList.remove('show')
        this.bodyBlock(false);
        gsap.to( this.pageElem, .2, {autoAlpha: 0, ease: 'quint.easeOut', 
            onComplete:()=> {
                document.body.removeChild( this.pageElem )
                this.removeEvent()
            }
        });
    }

    arr_Fn(e){
        (e.currentTarget === this.arrR) ? this.galleryFocusIndex++ : this.galleryFocusIndex--
        if( this.galleryFocusIndex < 0 ) this.galleryFocusIndex = 0
        if( this.galleryFocusIndex > this.imgTotalNum - 4 ) this.galleryFocusIndex = this.imgTotalNum - 4
        
        const r = (this.galleryFocusIndex == this.imgTotalNum - 4) ? 0 : 1
        const l = (this.galleryFocusIndex == 0 ) ? 0 : 1
        gsap.set(this.arrR, {autoAlpha: r})
        gsap.set(this.arrL, {autoAlpha: l})

        gsap.to( '.winner_g-list', .5, {x: -this.galleryFocusIndex * (260+3), ease: 'Quint.easeOut'})
    }
}


/* ====================================================================================================================*/
// /* 문의하기 - 전송 */

const FormSubmit = function(){
    let formSize, submitSize, isPlay = false;
    let intervalId;
    gsap.set('.contact_submit_finish .inner', {opacity: 0} )
    gsap.set(['.msg_success', '.msg_success > *'], {height: 0, fontSize: 0, padding: 0} )

    const plane = lottie.loadAnimation({
        container: document.querySelector('.contact_submit_finish .inner'),
        renderer: 'svg', loop: false, autoplay: false,
        // path: 'https://static.msscdn.net/webflow/static/partners/plane.json'
        animationData: path_plane
    });    

    function submitFinishResize(){
        let _y;
        let _height;
        if(isPlay ){
            _y = 0;
            _height = formSize.h;
        } else {
            _y = formSize.h-submitSize.h;
            _height = submitSize.h;
        }

        gsap.set('.contact_submit_finish', {width: formSize.w, height: formSize.h } )
        gsap.set('.contact_submit_finish .inner', {width: submitSize.w, height:_height, y: _y} )
        
    }
    function formResize(){
        formSize = {
            w: gsap.getProperty('#formContact', 'width'),
            h: gsap.getProperty('#formContact', 'height'),
        }
        submitSize = {
            w: gsap.getProperty('#formContact .contact_submit', 'width'),
            h: gsap.getProperty('#formContact .contact_submit', 'height'),
        }
        submitFinishResize()
    }
    formResize();
    window.addEventListener('resize', ()=> formResize() );

    function fromReset(){
        console.log('formReset')
        $('#email-form').css('display', "block");
        clearInterval(intervalId)
        intervalId = null;
        emailFormDisplay('block')

        $('.contact_submit_finish').css({
            position: 'absolute',
            marginLeft: '10px',
            marginBottom: '15px'
        })

        $('#email-form input[type=email]').val('');
        $('#email-form input[type=text]').val('');
        $('#email-form #Content').val('');
    }

    function emailFormDisplay( display ){
        intervalId = setInterval(()=>{
            if( $('#email-form').css('display') != display) {
                $('#email-form').css('display', display);
            }
            console.log("intevalId")
        },60/1000)
    }
    
    function fromSubmitPlay(){
        submitFinishResize()
        $('#email-form').css('display', "none");
        clearInterval(intervalId)
        intervalId = null;
        emailFormDisplay('none');
        $('.contact_submit_finish').css({ position: 'relative', margin: '0' })

        isPlay = true;
    
        const tl = gsap.timeline({})
        tl.set('.contact_submit_finish .inner', { opacity: 1, backgroundColor:'#BDFF00'} )
        tl.to('.contact_submit_finish .inner', 0.5, { 
            backgroundColor:'#333',
            height: formSize.h , 
            y:0, 
            ease: BezierEasing(0.6,0,0.1,1),
            onComplete:()=>{
                fromReset()
            }
        })
        // tl.to( '.contact_submit_finish .inner', .55, { 
        //     delay: 1, 
        //     height: 0, 
        //     backgroundColor:'#BDFF00',
        //     ease: BezierEasing(0.5,0,0,1)
        // })

        setTimeout(()=>{
            plane.play();
        }, 100)
    };
    plane.onComplete = function(){
        // console.log( plane.currentFrame )
        // if(plane.currentFrame > 140 && isPlay){
            isPlay = false;
            gsap.to( '.contact_submit_finish .inner', .55, { 
                delay: .6,
                height: 0,
                backgroundColor:'#BDFF00',
                ease: BezierEasing(0.5,0,0,1),
                onComplete:()=>{
                    plane.goToAndStop(1, false)
                    gsap.set('.contact_submit_finish .inner', { opacity: 0 } )
                    clearInterval(intervalId)
                    intervalId = null;
                } 
            });
        // }
        
    };
    
    $('#email-form').submit(function(e){
        fromSubmitPlay()
    });
//     $("input[type=submit]").on('click', ()=>{
//         fromSubmitPlay()        
//     });
}

/* ====================================================================================================================*/
// /* 로티 소스 */

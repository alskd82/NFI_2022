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

document.addEventListener('DOMContentLoaded', ()=>{
    addEvent();

    // GNB();
    // Floating();

    Section_Desc();
    // Section_Apply();
    Section_TargetHow();
    // Section_LYB();
    Section_Step();
    // Section_Next();
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
    Section_Apply();
    Section_LYB();
    Section_Next();
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
    const goToEmail =()=> document.location.href = 'mailto:nextfashion@musinsapartners.com';

    /* 지원서 다운로드 링크 */
    floatingDownload.addEventListener('click', downloadLink, false );
    document.querySelector('.btn_download').addEventListener('click', downloadLink, false )
    function downloadLink(e) {
        e.preventDefault()
        window.open('about:blank').location.href = document.querySelector('#DonwloadURL').getAttribute('href'); 
    }

    /* 섹션 이동  */
    const targetSections = [
        '#SectionTarget', 
        '#SectionHow', 
        "#SectionStep", 
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

            let _offset = 80;
            if(i === 3 || i === 5 || i === 7) _offset = 0;
            gsap.killTweensOf(window) 
            gsap.to(window, 1.3, { 
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
    document.querySelector('.logo-wrap').addEventListener('click', e => window.open('about:blank').location.href = "https://www.musinsapartners.co.kr/" )

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

    gsap.set(spanBig, {y: 75} )
    gsap.set(spanBig.querySelectorAll('span'), {y: -150} )
    gsap.set(spanBig.parentElement, {opacity: 1})
    // gsap.set(elem, {clipPath: '0% 0%, 100% 0%, 100% 100%, 0% 100%'})

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
                }
            })
            .set(overlayPath, { attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' } })
            .to(overlayPath, 0.3 ,{ ease: 'Cubic.easeIn',  attr: { d: 'M 0 0 V 50 Q 50 0 100 50 V 0 z' } })
            .to(overlayPath, 0.8, {  ease: 'Quint.easeOut', attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }, 
            onComplete: () => {
                    elem.remove()
                }    
        });
    }

    exports.play = play;
    return exports;
})({})

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
    ioGnb.observe( document.querySelector('.section-supporters') )

    /* 풋터 등장 시점 - gnb 강제 호출을 위해 */
    const ioFooterOptions = { rootMargin: '0px 0px -160px 0px' }
    const ioFooter = new IntersectionObserver(( entries, observer )=>{
        isGnbOpenForce = entries[0].isIntersecting
    }, ioFooterOptions);
    ioFooter.observe( document.querySelector('footer') )

    exports.gnbShowHide_Fn = gnbShowHide_Fn;
    exports.gnbChangeColor_Fn = gnbChangeColor_Fn;

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
    ioFloating.observe( document.querySelector('.section-supporters') );

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

    exports.floatingDownload_Fn = floatingDownload_Fn;
    exports.floatingColor_Fn = floatingColor_Fn;
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

        this._set()
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
            time: 1.5,
            delayTime:0,
            charGap: 450,
            charScale: 1,
            wordScale: 2
        }

        this.opts = {...defaults, ...opts};
        this.wordElem = this.opts.wordElem;
        this._set()
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
                gsap.set( txt, {x: this.opts.charGap*(i-2), scale: this.opts.charScale }) //2: NEXT 센터 인덱스
            } else {  // FASHION
                gsap.set( txt, {x: this.opts.charGap*(i-2-4), scale: this.opts.charScale })//2-4: FASHION 센터 인덱스
            }
        })
        gsap.set( this.split.words, { scale: this.opts.wordScale })
    }

    play(){
        gsap.to( this.split.words, this.opts.time, {delay:this.opts.delayTime, scale: 1, ease: this.opts.easing })
        gsap.to( this.split.chars, this.opts.time, {delay:this.opts.delayTime, scale: 1, x: 0, ease: this.opts.easing })
    }
    
}

/* ====================================================================================================================*/
/* Section_Desc - ScrollTrigger */
const Section_Desc = function(){
    const descClipMaskImg = new ClipMaskImg({
        maskElem: '.desc_img-mask',
        imgElem: '.desc_img',
        clipPosition: 'left',
        imgDelayTime: .3,
    });

    gsap.set('.section-desc .desc_txt > div', {y: '90%'})  // 이미지 위 텍스트들 숨기기
    
    
    ScrollTrigger.create({
        // markers: true, 
        trigger: '.desc_img-wrap',
        start: "top 95%",
        onEnter:()=>{
            descClipMaskImg.play()
            gsap.to('.section-desc .desc_txt > div', 1, {delay: .5, y: '0%', stagger: 0.1, ease: "Quint.easeOut"})
        }
    })

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

    gsap.set( '.section-desc .desc_info-txt_p', {y: 60, autoAlpha: 0 }) // 설명 글 숨기기
    document.querySelector('.section-desc .desc_info-txt_strong').style.color = "white"; // 강조문구 흰색으로 셋팅

    const showTxt_tl = gsap.timeline()
    showTxt_tl.to('.section-desc .desc_info-txt_p', 1.0, { y: 0, stagger: 0.1, ease: "Quint.easeOut"})
    showTxt_tl.to('.section-desc .desc_info-txt_p', .5, { autoAlpha: 1, stagger: 0.1 , ease: "none"}, 0)

    ScrollTrigger.create({
        // markers: true, 
        animation: showTxt_tl,
        trigger: '.desc_info-wrap',
        start: "top 95%",
        onEnter:()=>{
            setTimeout(()=>{ 
                textMasking.play();
                setTimeout(()=>{
                    document.querySelector('.section-desc .desc_info-txt_strong').style.color = "#BDFF00"; 
                },500)
            }, 600)
        }
    })
}

/* ====================================================================================================================*/
// /* APPLAY - ScrollTrigger */
const Section_Apply = function(){
    const applyClipMaskImg = new ClipMaskImg({
        maskElem: '.apply-mask',
        imgElem: '.apply-img',
        clipPosition: 'center',
        maskTime: 1, maskEase: BezierEasing(0.5,0,0,1),
        imgTime: 1.7, imgEase: BezierEasing(0.6,0,0.1,1),
        wordElem: '.section-apply .apply-txt',
        charGap: 450,
    })

    gsap.set('.apply-wrap',{ y: 200 }) // 하단 +200 셋팅

    ScrollTrigger.create({
        // markers: true, 
        trigger: '.section-apply',
        start: `top 75%`, 
        onEnter:()=>{
            applyClipMaskImg.play();
            gsap.to('.apply-wrap', 1.5, { y: 0, ease: BezierEasing(0.4,0,0.2,1)})
        }
    })
}

/* ====================================================================================================================*/
// /* 모집대상 - 지원 방법 - 선발 절차 - 선발 혜택*/
const Section_TargetHow = function(){
    gsap.set(
        [ 
            '.section-target .info-txt_wrap',
            '.section-how .info-txt_wrap',
            '.section-benefit .info-txt_wrap',
            '.section-winner .info-txt_wrap'
        ],
        { y: 100, opacity: 0 })

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
        })
    }

    scrollTrigger_Fn('.section-target')
    scrollTrigger_Fn('.section-how')

    scrollTrigger_Fn('.section-step')

    scrollTrigger_Fn('.section-benefit')
    scrollTrigger_Fn('.section-winner')
};

/* ====================================================================================================================*/
// /* 런치 유어 브랜드 */
const Section_LYB = function(){
    const launchClipMaskimg = new ClipMaskImg({
        maskElem: ".lyb_launch-mask",
        imgElem: ".ybd_your-img",
        clipPosition: 'left',
        maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
        imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
        wordElem: '.lyb_launch .apply-txt',
        charGap: 450,
    })
    const yourClipMaskimg = new ClipMaskImg({
        maskElem: ".lyb_your",
        imgElem: ".ybd_brand-img",
        clipPosition: 'left',
        maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
        imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
        wordElem: '.lyb_your .apply-txt',
        charGap: 450,
    })
    const brandClipMaskimg = new ClipMaskImg({
        maskElem: ".lyb_brand",
        imgElem: ".lyb_brand-img",
        clipPosition: 'left',
        maskTime: 1, maskEase: BezierEasing(0.6,0,0.1,1),
        imgTime: 1.5, imgEase: BezierEasing(0.5,0,0,1),
        wordElem: '.lyb_brand .apply-txt',
        charGap: 450,
    })

    ScrollTrigger.create({
        // markers: true, 
        trigger: '.section-lyb',
        start: `top 85%`, 
        onEnter:()=>{
            launchClipMaskimg.play()
            setTimeout(()=>{ yourClipMaskimg.play() }, 200)
            setTimeout(()=>{ brandClipMaskimg.play() }, 300)
        },
        // onLeaveBack:()=>{
        //     launchClipMaskimg._set()
        //     yourClipMaskimg._set()
        //     brandClipMaskimg._set()
        // }
    })
}

/* ====================================================================================================================*/
// /* 스텝 */
const Section_Step = function(){
    // const stepArr = document.querySelectorAll('.section-step .step_wrap:nth-of-type(1) .step_block_color');
    const stepArr = document.querySelectorAll('#step .step_block_color');
    const stepTxtArr = document.querySelectorAll('#stepTxt .step_block_color');

    stepArr.forEach((item, i)=>{
        gsap.set( item, {clipPath: `circle(0% at 50% 50%)`, y: 150})
        gsap.set( stepTxtArr[i], {clipPath: `circle(0% at 50% 50%)`, y: 150})
    })

    ScrollTrigger.create({
        // markers: true, 
        trigger: '#step',
        start: `top 85%`, 
        onEnter:()=>{
            gsap.to( stepArr, 0.75, {stagger: 0.05, clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.6,0,0.1,1)})
            gsap.to( stepArr, 1, {stagger: 0.05, y: 0, ease: BezierEasing(0.6,0,0.1,1)})
            gsap.to( stepTxtArr, 0.75, {stagger: 0.05, clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.6,0,0.1,1)})
            gsap.to( stepTxtArr, 1, {stagger: 0.05, y: 0, ease: BezierEasing(0.6,0,0.1,1)})
        }
    })
}

/* ====================================================================================================================*/
// /* Next Fashion */
const Section_Next = function(){
    gsap.set(".next-fashion", {y: '-50%' })
    const ani = gsap.to(".next-fashion", 1, {y: '30%' })
    ScrollTrigger.create({
        // markers: true, 
        trigger: '.section-next-fashion',
        animation: ani,
        scrub: true
    })

    const textMotion = new LetterSpacing({
        wordElem: '.next-fashtion-txt', 
        wordScale: 1, 
        charScale: 0
    })   
    ScrollTrigger.create({
        // markers: true,
        id: 'textMotion', 
        start: "top 50%",
        trigger: '.section-next-fashion',
        onEnter:()=> textMotion.play()
    }) 
}

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
        _tl.to( listLinkArr[num].querySelector('.winner-img'), 0.5, {ease: BezierEasing(0.6,0,0.1,1), scale: 1}, '=-0.5' )
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
            onRefresh:(self)=>{
                // self.start = `top ${window.innerHeight - 60}`,
                // console.log(self)
            }
        })
    }
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

let path_textMastking = JSON.parse('{"v":"5.7.4","fr":60,"ip":0,"op":61,"w":316,"h":36,"nm":"section2-txt","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"M","td":1,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"s":true,"x":{"a":1,"k":[{"i":{"x":[0.2],"y":[1]},"o":{"x":[0.4],"y":[0]},"t":0,"s":[0]},{"i":{"x":[0.36],"y":[1]},"o":{"x":[0.4],"y":[0]},"t":30,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.8],"y":[0]},"t":31,"s":[0]},{"t":60,"s":[316]}],"ix":3},"y":{"a":0,"k":0,"ix":4}},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":1,"k":[{"i":{"x":[0.2,0.2],"y":[1,1]},"o":{"x":[0.4,0.4],"y":[0,0]},"t":0,"s":[0,36]},{"i":{"x":[0.36,0.36],"y":[1,1]},"o":{"x":[0.4,0.4],"y":[0,0]},"t":30,"s":[316,36]},{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[0.8,0.8],"y":[0,0]},"t":31,"s":[316,36]},{"t":60,"s":[0,36]}],"ix":2},"p":{"a":1,"k":[{"i":{"x":0.2,"y":1},"o":{"x":0.4,"y":0},"t":0,"s":[0,18],"to":[0,0],"ti":[0,0]},{"i":{"x":0.2,"y":0.2},"o":{"x":0.4,"y":0.4},"t":30,"s":[158,18],"to":[0,0],"ti":[0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.8,"y":0},"t":31,"s":[158,18],"to":[0,0],"ti":[0,0]},{"t":60,"s":[0,18]}],"ix":3},"r":{"a":0,"k":0,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"fl","c":{"a":0,"k":[1,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Rectangle 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":5400,"st":0,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"txt","tt":1,"sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[1.5,26,0],"ix":2,"l":2},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[19.868,-5.632],[0.918,-5.632],[0.918,-3.529],[9.185,-3.529],[9.185,2.417],[11.602,2.417],[11.602,-3.529],[19.868,-3.529]],"c":true},"ix":2},"nm":"투","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[6.284,-9.668],[6.284,-11.553],[16.629,-11.553],[16.629,-13.487],[6.284,-13.487],[6.284,-15.372],[16.871,-15.372],[16.871,-17.402],[3.916,-17.402],[3.916,-7.638],[17.112,-7.638],[17.112,-9.668]],"c":true},"ix":2},"nm":"투","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"투","np":5,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[2.755,-1.668],[0,0],[-0.604,1.861],[-2.199,-1.329],[0,0],[0,3.819],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,3.867],[0,0],[2.344,-1.402],[0.604,1.813],[0,0],[-2.755,-1.595],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[22.452,-15.082],[26.585,-15.082],[26.585,-13.028],[21.606,-4.326],[22.936,-2.417],[27.842,-8.29],[32.652,-2.659],[33.981,-4.568],[29.002,-13.028],[29.002,-15.082],[33.135,-15.082],[33.135,-17.161],[22.452,-17.161]],"c":true},"ix":2},"nm":"자","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[41.184,-10.635],[38.042,-10.635],[38.042,-18.248],[35.625,-18.248],[35.625,2.417],[38.042,2.417],[38.042,-8.508],[41.184,-8.508]],"c":true},"ix":2},"nm":"자","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"자","np":5,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[1.74,0],[0,-3.166],[-3.07,0],[-0.991,1.257],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[-3.07,0],[0,3.166],[1.764,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.991,-1.233]],"v":[[48.434,-17.765],[42.971,-12.278],[48.434,-6.792],[52.712,-8.798],[57.111,-8.798],[57.111,-3.65],[59.528,-3.65],[59.528,-18.248],[57.111,-18.248],[57.111,-15.783],[52.688,-15.783]],"c":true},"ix":2},"nm":"연","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[60.011,0.048],[49.763,0.048],[49.763,-5.245],[47.346,-5.245],[47.346,2.175],[60.011,2.175]],"c":true},"ix":2},"nm":"연","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[1.861,0],[0,1.934],[-1.861,0],[0,-1.934]],"o":[[-1.861,0],[0,-1.934],[1.861,0],[0,1.934]],"v":[[48.434,-8.87],[45.34,-12.278],[48.434,-15.686],[51.527,-12.278]],"c":true},"ix":2},"nm":"연","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0.483],[0.097,0.459],[0,0],[0,0],[0,0]],"o":[[0,-0.483],[0,0],[0,0],[0,0],[0.097,-0.435]],"v":[[53.896,-12.278],[53.727,-13.704],[57.111,-13.704],[57.111,-10.876],[53.727,-10.876]],"c":true},"ix":2},"nm":"연","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"연","np":7,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[3.891,-2.054],[0,0],[-1.16,4.206],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0.725],[0,0]],"o":[[0,0],[0,0],[-0.121,4.085],[0,0],[3.239,-1.74],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0.097,-0.677],[0,0],[0,0]],"v":[[63.973,-17.064],[63.973,-14.985],[69.798,-14.985],[63.127,-5.076],[64.336,-3.045],[71.611,-11.964],[73.859,-11.964],[73.859,-8.629],[70.934,-8.629],[70.934,-6.598],[73.859,-6.598],[73.859,1.934],[76.179,1.934],[76.179,-18.007],[73.859,-18.007],[73.859,-13.994],[72.022,-13.994],[72.167,-16.097],[72.167,-17.064]],"c":true},"ix":2},"nm":"계","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[80.409,-18.248],[78.04,-18.248],[78.04,2.417],[80.409,2.417]],"c":true},"ix":2},"nm":"계","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"계","np":5,"cix":2,"bm":0,"ix":4,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,-1.039],[-3.094,0],[0,2.538],[0.628,0.773],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.628,0.773],[0,2.538],[3.094,0],[0,-1.039],[0,0],[0,0]],"v":[[95.755,-16.363],[91.091,-16.363],[91.091,-18.732],[88.674,-18.732],[88.674,-16.363],[83.767,-16.363],[83.767,-14.284],[85.701,-14.284],[84.734,-11.505],[89.882,-6.695],[95.03,-11.505],[94.039,-14.284],[95.755,-14.284]],"c":true},"ix":2},"nm":"형","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[3.094,0],[0,-2.731],[-3.094,0],[0,2.731]],"o":[[-3.094,0],[0,2.731],[3.094,0],[0,-2.731]],"v":[[94.982,-6.139],[89.52,-1.499],[94.982,3.142],[100.444,-1.499]],"c":true},"ix":2},"nm":"형","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[95.876,-12.157],[98.39,-12.157],[98.39,-10.296],[95.876,-10.296],[95.876,-8.169],[98.39,-8.169],[98.39,-6.188],[100.807,-6.188],[100.807,-18.248],[98.39,-18.248],[98.39,-14.284],[95.876,-14.284]],"c":true},"ix":2},"nm":"형","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[1.885,0],[0,1.499],[-1.885,0],[0,-1.499]],"o":[[-1.885,0],[0,-1.499],[1.885,0],[0,1.499]],"v":[[94.982,1.063],[91.888,-1.499],[94.982,-4.061],[98.076,-1.499]],"c":true},"ix":2},"nm":"형","mn":"ADBE Vector Shape - Group","hd":false},{"ind":4,"ty":"sh","ix":5,"ks":{"a":0,"k":{"i":[[1.644,0],[0,1.499],[-1.644,0],[0,-1.499]],"o":[[-1.644,0],[0,-1.499],[1.644,0],[0,1.499]],"v":[[89.882,-8.774],[87.103,-11.505],[89.882,-14.236],[92.662,-11.505]],"c":true},"ix":2},"nm":"형","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"형","np":8,"cix":2,"bm":0,"ix":5,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[120.17,-17.064],[111.13,-17.064],[111.13,-14.985],[112.339,-14.985],[112.339,-5.849],[111.009,-5.849],[111.009,-3.771],[120.532,-3.771],[120.532,-5.849],[118.961,-5.849],[118.961,-14.985],[120.17,-14.985]],"c":true},"ix":2},"nm":"패","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[123.698,-18.007],[121.378,-18.007],[121.378,1.934],[123.698,1.934],[123.698,-8.653],[125.559,-8.653],[125.559,2.417],[127.928,2.417],[127.928,-18.248],[125.559,-18.248],[125.559,-10.731],[123.698,-10.731]],"c":true},"ix":2},"nm":"패","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[114.659,-14.985],[116.641,-14.985],[116.641,-5.849],[114.659,-5.849]],"c":true},"ix":2},"nm":"패","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"패","np":6,"cix":2,"bm":0,"ix":6,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[142.259,-14.212],[145.909,-14.212],[145.909,-12.568],[142.259,-12.568],[142.259,-10.49],[145.909,-10.49],[145.909,-3.65],[148.326,-3.65],[148.326,-18.248],[145.909,-18.248],[145.909,-16.291],[142.259,-16.291]],"c":true},"ix":2},"nm":"션","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-0.628,1.716],[-2.49,-1.039],[0,0],[0,3.311],[0,0],[0,0],[0,0],[2.804,-1.208],[0,0]],"o":[[0.628,1.644],[0,0],[-2.755,-1.16],[0,0],[0,0],[0,0],[0,3.36],[0,0],[2.635,-1.136]],"v":[[137.522,-11.698],[142.839,-6.816],[143.903,-8.798],[138.682,-15.59],[138.682,-17.644],[136.265,-17.644],[136.265,-15.59],[131.045,-8.677],[132.108,-6.695]],"c":true},"ix":2},"nm":"션","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[148.809,0.048],[138.561,0.048],[138.561,-5.245],[136.144,-5.245],[136.144,2.175],[148.809,2.175]],"c":true},"ix":2},"nm":"션","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"션","np":6,"cix":2,"bm":0,"ix":7,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[176.825,-3.094],[157.876,-3.094],[157.876,-0.967],[176.825,-0.967]],"c":true},"ix":2},"nm":"브","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[173.949,-17.281],[171.532,-17.281],[171.532,-14.019],[163.169,-14.019],[163.169,-17.281],[160.752,-17.281],[160.752,-6.671],[173.949,-6.671]],"c":true},"ix":2},"nm":"브","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[163.169,-8.75],[163.169,-11.988],[171.532,-11.988],[171.532,-8.75]],"c":true},"ix":2},"nm":"브","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"브","np":6,"cix":2,"bm":0,"ix":8,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[191.736,-18.007],[189.416,-18.007],[189.416,-3.65],[191.736,-3.65],[191.736,-10.828],[193.718,-10.828],[193.718,-3.166],[196.087,-3.166],[196.087,-18.248],[193.718,-18.248],[193.718,-12.907],[191.736,-12.907]],"c":true},"ix":2},"nm":"랜","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[179.531,-6.695],[188.208,-6.695],[188.208,-8.725],[181.851,-8.725],[181.851,-11.021],[187.482,-11.021],[187.482,-17.306],[179.531,-17.306],[179.531,-15.275],[185.162,-15.275],[185.162,-13.003],[179.531,-13.003]],"c":true},"ix":2},"nm":"랜","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[196.57,0.048],[186.081,0.048],[186.081,-4.761],[183.664,-4.761],[183.664,2.175],[196.57,2.175]],"c":true},"ix":2},"nm":"랜","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"랜","np":6,"cix":2,"bm":0,"ix":9,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[218.104,-3.094],[199.155,-3.094],[199.155,-0.967],[218.104,-0.967]],"c":true},"ix":2},"nm":"드","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[204.448,-8.991],[204.448,-15.082],[215.228,-15.082],[215.228,-17.161],[202.031,-17.161],[202.031,-6.913],[215.349,-6.913],[215.349,-8.991]],"c":true},"ix":2},"nm":"드","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"드","np":5,"cix":2,"bm":0,"ix":10,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[2.755,-1.668],[0,0],[-0.604,1.861],[-2.199,-1.329],[0,0],[0,3.819],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,3.867],[0,0],[2.344,-1.402],[0.604,1.813],[0,0],[-2.755,-1.595],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[227.171,-15.082],[231.304,-15.082],[231.304,-13.028],[226.325,-4.326],[227.654,-2.417],[232.56,-8.29],[237.37,-2.659],[238.7,-4.568],[233.721,-13.028],[233.721,-15.082],[237.854,-15.082],[237.854,-17.161],[227.171,-17.161]],"c":true},"ix":2},"nm":"지","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[243.364,-18.248],[240.947,-18.248],[240.947,2.417],[243.364,2.417]],"c":true},"ix":2},"nm":"지","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"지","np":5,"cix":2,"bm":0,"ix":11,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,1.305],[2.876,0],[0,-3.021],[-0.773,-0.87],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0.749,-0.87],[0,-3.021],[-2.876,0],[0,1.305],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[254.723,-4.931],[254.723,-7.976],[260.499,-7.976],[260.499,-10.055],[257.672,-10.055],[258.88,-13.366],[253.635,-18.611],[248.39,-13.366],[249.599,-10.055],[246.674,-10.055],[246.674,-7.976],[252.306,-7.976],[252.306,-4.931]],"c":true},"ix":2},"nm":"원","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[264.004,-18.248],[261.587,-18.248],[261.587,-6.212],[257.599,-6.212],[257.599,-4.181],[261.587,-4.181],[261.587,-2.683],[264.004,-2.683]],"c":true},"ix":2},"nm":"원","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[264.487,0.097],[254.239,0.097],[254.239,-3.964],[251.822,-3.964],[251.822,2.175],[264.487,2.175]],"c":true},"ix":2},"nm":"원","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[-1.74,0],[0,-1.74],[1.74,0],[0,1.74]],"o":[[1.74,0],[0,1.74],[-1.74,0],[0,-1.74]],"v":[[253.635,-16.581],[256.511,-13.366],[253.635,-10.151],[250.759,-13.366]],"c":true},"ix":2},"nm":"원","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"원","np":7,"cix":2,"bm":0,"ix":12,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[293.18,-10.756],[290.038,-10.756],[290.038,-18.248],[287.621,-18.248],[287.621,2.417],[290.038,2.417],[290.038,-8.629],[293.18,-8.629]],"c":true},"ix":2},"nm":"사","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-0.58,2.054],[-2.344,-1.474],[0,0],[0,4.012],[0,0],[0,0],[0,0],[2.852,-1.789],[0,0]],"o":[[0.628,2.006],[0,0],[-2.852,-1.716],[0,0],[0,0],[0,0],[0,4.061],[0,0],[2.49,-1.547]],"v":[[279.838,-8.943],[284.889,-2.9],[286.219,-4.834],[280.998,-13.656],[280.998,-17.402],[278.581,-17.402],[278.581,-13.656],[273.36,-4.592],[274.69,-2.659]],"c":true},"ix":2},"nm":"사","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"사","np":5,"cix":2,"bm":0,"ix":13,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[2.683,0],[0,-2.949],[-3.07,0],[-0.483,2.393],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[-3.07,0],[0,2.949],[2.683,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.483,-2.369]],"v":[[300.429,-17.765],[294.967,-12.689],[300.429,-7.614],[305.771,-11.626],[309.106,-11.626],[309.106,-7.058],[311.523,-7.058],[311.523,-18.248],[309.106,-18.248],[309.106,-13.753],[305.771,-13.753]],"c":true},"ix":2},"nm":"업","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[301.71,-6.212],[299.342,-6.212],[299.342,2.417],[311.523,2.417],[311.523,-6.212],[309.155,-6.212],[309.155,-4.012],[301.71,-4.012]],"c":true},"ix":2},"nm":"업","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[1.861,0],[0,1.716],[-1.861,0],[0,-1.716]],"o":[[-1.861,0],[0,-1.716],[1.861,0],[0,1.716]],"v":[[300.429,-9.692],[297.335,-12.689],[300.429,-15.686],[303.523,-12.689]],"c":true},"ix":2},"nm":"업","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[309.155,0.338],[301.71,0.338],[301.71,-1.982],[309.155,-1.982]],"c":true},"ix":2},"nm":"업","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0,0,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"업","np":7,"cix":2,"bm":0,"ix":14,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":5400,"st":0,"bm":0},{"ddd":0,"ind":3,"ty":4,"nm":"Shape Layer 7","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"s":true,"x":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.8],"y":[0]},"t":31,"s":[0]},{"t":60,"s":[316]}],"ix":3},"y":{"a":0,"k":0,"ix":4}},"a":{"a":0,"k":[0,0,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ty":"rc","d":1,"s":{"a":1,"k":[{"i":{"x":[0.2,0.2],"y":[1,1]},"o":{"x":[0.4,0.4],"y":[0,0]},"t":0,"s":[0,36]},{"i":{"x":[0.36,0.36],"y":[1,1]},"o":{"x":[0.4,0.4],"y":[0,0]},"t":30,"s":[316,36]},{"i":{"x":[0.667,0.667],"y":[1,1]},"o":{"x":[0.8,0.8],"y":[0,0]},"t":31,"s":[316,36]},{"t":60,"s":[0,36]}],"ix":2},"p":{"a":1,"k":[{"i":{"x":0.2,"y":1},"o":{"x":0.4,"y":0},"t":0,"s":[0,18],"to":[0,0],"ti":[0,0]},{"i":{"x":0.2,"y":0.2},"o":{"x":0.4,"y":0.4},"t":30,"s":[158,18],"to":[0,0],"ti":[0,0]},{"i":{"x":0.667,"y":1},"o":{"x":0.8,"y":0},"t":31,"s":[158,18],"to":[0,0],"ti":[0,0]},{"t":60,"s":[0,18]}],"ix":3},"r":{"a":0,"k":0,"ix":4},"nm":"Rectangle Path 1","mn":"ADBE Vector Shape - Rect","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741176470588,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Rectangle 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":5400,"st":0,"bm":0}],"markers":[]}');

let path_plane = JSON.parse('{"v":"5.7.4","fr":60,"ip":0,"op":181,"w":670,"h":444,"nm":"plane","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"t2","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":126,"s":[0]},{"t":131,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":1,"k":[{"i":{"x":0,"y":1},"o":{"x":0.8,"y":0},"t":96,"s":[335,296.004,0],"to":[0,0,0],"ti":[0,0,0]},{"t":168,"s":[335,223.004,0]}],"ix":2,"l":2},"a":{"a":0,"k":[0.464,-6.496,0],"ix":1,"l":2},"s":{"a":0,"k":[105,105,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-103.775,-16.218],[-115.651,-16.218],[-115.651,-9.217],[-103.775,-9.217]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-101.028,-7.489],[-118.398,-7.489],[-118.398,-5.583],[-110.488,-5.583],[-110.488,-2.083],[-108.273,-2.083],[-108.273,-5.583],[-101.028,-5.583]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-113.435,-11.078],[-113.435,-14.357],[-105.991,-14.357],[-105.991,-11.078]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-103.443,0.089],[-113.435,0.089],[-113.435,-4.077],[-115.651,-4.077],[-115.651,1.994],[-103.443,1.994]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"문","np":7,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-86.694,-3.722],[-99.478,-3.722],[-99.478,-1.772],[-86.694,-1.772]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-83.592,-16.728],[-85.808,-16.728],[-85.808,2.216],[-83.592,2.216]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[2.88,0],[0,-2.814],[-2.88,0],[0,2.814]],"o":[[-2.88,0],[0,2.814],[2.88,0],[0,-2.814]],"v":[[-93.097,-16.174],[-98.193,-11.255],[-93.097,-6.337],[-88.001,-11.255]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[1.772,0],[0,1.64],[-1.772,0],[0,-1.64]],"o":[[-1.772,0],[0,-1.64],[1.772,0],[0,1.64]],"v":[[-93.097,-8.242],[-96.022,-11.255],[-93.097,-14.268],[-90.173,-11.255]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"의","np":7,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-56.848,-9.859],[-59.728,-9.859],[-59.728,-16.728],[-61.943,-16.728],[-61.943,2.216],[-59.728,2.216],[-59.728,-7.91],[-56.848,-7.91]],"c":true},"ix":2},"nm":"사","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-0.532,1.883],[-2.149,-1.352],[0,0],[0,3.678],[0,0],[0,0],[0,0],[2.614,-1.64],[0,0]],"o":[[0.576,1.839],[0,0],[-2.614,-1.573],[0,0],[0,0],[0,0],[0,3.722],[0,0],[2.282,-1.418]],"v":[[-69.078,-8.198],[-64.447,-2.659],[-63.228,-4.431],[-68.014,-12.518],[-68.014,-15.952],[-70.23,-15.952],[-70.23,-12.518],[-75.015,-4.21],[-73.797,-2.437]],"c":true},"ix":2},"nm":"사","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"사","np":5,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,-0.953],[-2.836,0],[0,2.326],[0.576,0.709],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.576,0.709],[0,2.326],[2.836,0],[0,-0.953],[0,0],[0,0]],"v":[[-44.663,-14.999],[-49.161,-14.999],[-49.161,-17.171],[-51.376,-17.171],[-51.376,-14.999],[-55.874,-14.999],[-55.874,-13.094],[-54.101,-13.094],[-54.988,-10.546],[-50.268,-6.137],[-45.549,-10.546],[-46.458,-13.094],[-44.663,-13.094]],"c":true},"ix":2},"nm":"항","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[2.836,0],[0,-2.504],[-2.836,0],[0,2.504]],"o":[[-2.836,0],[0,2.504],[2.836,0],[0,-2.504]],"v":[[-45.926,-5.628],[-50.933,-1.374],[-45.926,2.88],[-40.919,-1.374]],"c":true},"ix":2},"nm":"항","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-40.808,-16.728],[-43.023,-16.728],[-43.023,-5.672],[-40.808,-5.672],[-40.808,-10.613],[-37.928,-10.613],[-37.928,-12.562],[-40.808,-12.562]],"c":true},"ix":2},"nm":"항","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[1.728,0],[0,1.374],[-1.728,0],[0,-1.374]],"o":[[-1.728,0],[0,-1.374],[1.728,0],[0,1.374]],"v":[[-45.926,0.975],[-48.762,-1.374],[-45.926,-3.722],[-43.09,-1.374]],"c":true},"ix":2},"nm":"항","mn":"ADBE Vector Shape - Group","hd":false},{"ind":4,"ty":"sh","ix":5,"ks":{"a":0,"k":{"i":[[1.507,0],[0,1.374],[-1.507,0],[0,-1.374]],"o":[[-1.507,0],[0,-1.374],[1.507,0],[0,1.374]],"v":[[-50.268,-8.043],[-52.816,-10.546],[-50.268,-13.05],[-47.72,-10.546]],"c":true},"ix":2},"nm":"항","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"항","np":8,"cix":2,"bm":0,"ix":4,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-21.112,-16.728],[-23.328,-16.728],[-23.328,2.216],[-21.112,2.216]],"c":true},"ix":2},"nm":"이","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[3.124,0],[0,-3.323],[-3.124,0],[0,3.323]],"o":[[-3.124,0],[0,3.323],[3.124,0],[0,-3.323]],"v":[[-31.171,-15.287],[-36.511,-9.305],[-31.171,-3.323],[-25.832,-9.305]],"c":true},"ix":2},"nm":"이","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[2.016,0],[0,2.149],[-2.016,0],[0,-2.149]],"o":[[-2.016,0],[0,-2.149],[2.016,0],[0,2.149]],"v":[[-31.171,-5.229],[-34.339,-9.305],[-31.171,-13.382],[-28.003,-9.305]],"c":true},"ix":2},"nm":"이","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"이","np":6,"cix":2,"bm":0,"ix":5,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-5.468,-5.561],[-7.639,-5.561],[-7.639,2.216],[3.528,2.216],[3.528,-5.561],[1.356,-5.561],[1.356,-3.611],[-5.468,-3.611]],"c":true},"ix":2},"nm":"접","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[2.393,-0.931],[0,0],[-0.665,1.484],[-2.149,-0.798],[0,0],[0.022,2.592],[0,0],[0,0],[0,0]],"o":[[0,0],[-0.022,2.637],[0,0],[2.282,-0.886],[0.665,1.44],[0,0],[-2.371,-0.886],[0,0],[0,0],[0,0],[0,0]],"v":[[-11.317,-14.047],[-7.528,-14.047],[-12.092,-8.486],[-11.162,-6.669],[-6.376,-10.701],[-1.679,-6.89],[-0.748,-8.707],[-5.313,-14.047],[-1.524,-14.047],[-1.524,-15.952],[-11.317,-15.952]],"c":true},"ix":2},"nm":"접","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-2.033,-10.746],[1.312,-10.746],[1.312,-6.337],[3.528,-6.337],[3.528,-16.728],[1.312,-16.728],[1.312,-12.695],[-2.033,-12.695]],"c":true},"ix":2},"nm":"접","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[1.356,0.31],[-5.468,0.31],[-5.468,-1.75],[1.356,-1.75]],"c":true},"ix":2},"nm":"접","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"접","np":7,"cix":2,"bm":0,"ix":6,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[23.932,-5.827],[6.562,-5.827],[6.562,-3.877],[14.139,-3.877],[14.139,2.216],[16.355,2.216],[16.355,-3.877],[23.932,-3.877]],"c":true},"ix":2},"nm":"수","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[2.925,-0.532],[0,0],[-0.775,1.75],[-2.769,-0.443],[0,0],[0,2.481],[0,0]],"o":[[0,0],[0,2.481],[0,0],[2.747,-0.443],[0.775,1.75],[0,0],[-2.925,-0.532],[0,0],[0,0]],"v":[[14.139,-16.174],[14.139,-14.202],[8.268,-9.505],[8.933,-7.577],[15.247,-11.388],[21.561,-7.577],[22.226,-9.505],[16.355,-14.202],[16.355,-16.174]],"c":true},"ix":2},"nm":"수","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"수","np":5,"cix":2,"bm":0,"ix":7,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[38.266,-3.722],[32.971,-3.722],[32.971,-7.001],[36.781,-7.001],[36.781,-8.907],[29.226,-8.907],[29.226,-14.047],[36.671,-14.047],[36.671,-15.952],[27.055,-15.952],[27.055,-7.001],[30.755,-7.001],[30.755,-3.722],[25.482,-3.722],[25.482,-1.772],[38.266,-1.772]],"c":true},"ix":2},"nm":"되","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[41.368,-16.728],[39.152,-16.728],[39.152,2.216],[41.368,2.216]],"c":true},"ix":2},"nm":"되","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"되","np":5,"cix":2,"bm":0,"ix":8,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[2.459,0],[0,-2.725],[-2.814,0],[-0.443,2.216],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[-2.814,0],[0,2.725],[2.459,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.443,-2.193]],"v":[[50.118,-16.284],[45.111,-11.587],[50.118,-6.89],[55.015,-10.613],[58.072,-10.613],[58.072,-6.248],[60.288,-6.248],[60.288,-16.728],[58.072,-16.728],[58.072,-12.562],[55.015,-12.562]],"c":true},"ix":2},"nm":"었","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-1.418,-0.487],[-0.399,1.019],[-1.484,-0.532],[0,0],[0,2.149],[0,0],[0,0],[0,0],[1.285,-0.753],[0,1.817],[0,0],[0,0],[0,0],[1.75,-0.687],[0,0],[-0.421,1.041]],"o":[[1.396,-0.487],[0.421,1.041],[0,0],[-1.75,-0.687],[0,0],[0,0],[0,0],[0,1.817],[-1.285,-0.753],[0,0],[0,0],[0,0],[0,2.149],[0,0],[1.462,-0.532],[0.399,1.019]],"v":[[54.04,2.437],[57.274,-0.598],[60.576,2.326],[61.506,0.554],[58.404,-3.744],[58.404,-5.362],[56.189,-5.362],[56.189,-3.744],[54.04,0.199],[51.891,-3.744],[51.891,-5.362],[49.675,-5.362],[49.675,-3.744],[46.573,0.554],[47.504,2.326],[50.805,-0.598]],"c":true},"ix":2},"nm":"었","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[1.706,0],[0,1.595],[-1.706,0],[0,-1.595]],"o":[[-1.706,0],[0,-1.595],[1.706,0],[0,1.595]],"v":[[50.118,-8.796],[47.282,-11.587],[50.118,-14.379],[52.954,-11.587]],"c":true},"ix":2},"nm":"었","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"었","np":6,"cix":2,"bm":0,"ix":9,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[68.285,-4.786],[66.069,-4.786],[66.069,2.216],[77.945,2.216],[77.945,-4.786],[75.729,-4.786],[75.729,-3.168],[68.285,-3.168]],"c":true},"ix":2},"nm":"습","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[2.969,-0.399],[0,0],[-0.798,1.617],[-2.792,-0.31],[0,0],[0,2.238],[0,0]],"o":[[0,0],[0,2.238],[0,0],[2.769,-0.31],[0.798,1.617],[0,0],[-2.969,-0.399],[0,0],[0,0]],"v":[[70.899,-16.44],[70.899,-15.265],[65.028,-11.366],[65.582,-9.438],[72.007,-12.695],[78.432,-9.438],[78.986,-11.366],[73.115,-15.265],[73.115,-16.44]],"c":true},"ix":2},"nm":"습","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[80.692,-8.131],[63.322,-8.131],[63.322,-6.226],[80.692,-6.226]],"c":true},"ix":2},"nm":"습","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[75.729,0.354],[68.285,0.354],[68.285,-1.352],[75.729,-1.352]],"c":true},"ix":2},"nm":"습","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"습","np":7,"cix":2,"bm":0,"ix":10,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[83.394,-15.731],[83.394,-3.545],[94.25,-3.545],[94.25,-5.45],[85.565,-5.45],[85.565,-15.731]],"c":true},"ix":2},"nm":"니","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[98.128,-16.728],[95.912,-16.728],[95.912,2.216],[98.128,2.216]],"c":true},"ix":2},"nm":"니","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"니","np":5,"cix":2,"bm":0,"ix":11,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[112.949,-5.229],[104.264,-5.229],[104.264,-13.825],[111.154,-13.825],[111.154,-15.731],[102.092,-15.731],[102.092,-3.323],[112.949,-3.323]],"c":true},"ix":2},"nm":"다","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[119.152,-9.859],[116.272,-9.859],[116.272,-16.728],[114.057,-16.728],[114.057,2.216],[116.272,2.216],[116.272,-7.91],[119.152,-7.91]],"c":true},"ix":2},"nm":"다","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"다","np":5,"cix":2,"bm":0,"ix":12,"mn":"ADBE Vector Group","hd":false}],"ip":126,"op":3721,"st":121,"bm":0},{"ddd":0,"ind":2,"ty":4,"nm":"t1","parent":1,"sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":36,"s":[0]},{"t":42,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[0.464,-26.019,0],"ix":2,"l":2},"a":{"a":0,"k":[0.464,-6.496,0],"ix":1,"l":2},"s":{"a":0,"k":[100,100,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-74.251,-16.218],[-86.127,-16.218],[-86.127,-9.217],[-74.251,-9.217]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-71.504,-7.489],[-88.874,-7.489],[-88.874,-5.583],[-80.964,-5.583],[-80.964,-2.083],[-78.749,-2.083],[-78.749,-5.583],[-71.504,-5.583]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-83.911,-11.078],[-83.911,-14.357],[-76.467,-14.357],[-76.467,-11.078]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-73.919,0.089],[-83.911,0.089],[-83.911,-4.077],[-86.127,-4.077],[-86.127,1.994],[-73.919,1.994]],"c":true},"ix":2},"nm":"문","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"문","np":7,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-57.17,-3.722],[-69.954,-3.722],[-69.954,-1.772],[-57.17,-1.772]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-54.068,-16.728],[-56.284,-16.728],[-56.284,2.216],[-54.068,2.216]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[2.88,0],[0,-2.814],[-2.88,0],[0,2.814]],"o":[[-2.88,0],[0,2.814],[2.88,0],[0,-2.814]],"v":[[-63.573,-16.174],[-68.669,-11.255],[-63.573,-6.337],[-58.477,-11.255]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[1.772,0],[0,1.64],[-1.772,0],[0,-1.64]],"o":[[-1.772,0],[0,-1.64],[1.772,0],[0,1.64]],"v":[[-63.573,-8.242],[-66.498,-11.255],[-63.573,-14.268],[-60.648,-11.255]],"c":true},"ix":2},"nm":"의","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"의","np":7,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-39.136,-16.506],[-41.263,-16.506],[-41.263,1.772],[-39.136,1.772],[-39.136,-8.043],[-37.098,-8.043],[-37.098,2.216],[-34.927,2.216],[-34.927,-16.728],[-37.098,-16.728],[-37.098,-9.948],[-39.136,-9.948]],"c":true},"ix":2},"nm":"내","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[-50.103,-15.642],[-50.103,-3.678],[-42.149,-3.678],[-42.149,-5.583],[-47.976,-5.583],[-47.976,-15.642]],"c":true},"ix":2},"nm":"내","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"내","np":5,"cix":2,"bm":0,"ix":3,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0.82],[2.902,0],[0,-2.548],[-0.421,-0.62],[0,0],[0,0],[0,0],[0,0],[0,-1.219],[-2.836,0],[0,2.836],[0.709,0.798],[0,0],[0,0],[0,0],[0,0]],"o":[[0,-2.548],[-2.902,0],[0,0.82],[0,0],[0,0],[0,0],[0,0],[-0.731,0.798],[0,2.836],[2.836,0],[0,-1.219],[0,0],[0,0],[0,0],[0,0],[0.421,-0.62]],"v":[[-18.156,-12.784],[-23.429,-16.971],[-28.702,-12.784],[-28.037,-10.635],[-28.037,-7.001],[-32.114,-7.001],[-32.114,-5.096],[-27.461,-5.096],[-28.613,-2.06],[-23.429,2.792],[-18.244,-2.06],[-19.396,-5.096],[-14.744,-5.096],[-14.744,-7.001],[-18.82,-7.001],[-18.82,-10.635]],"c":true},"ix":2},"nm":"용","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[1.728,0],[0,1.684],[-1.728,0],[0,-1.684]],"o":[[-1.728,0],[0,-1.684],[1.728,0],[0,1.684]],"v":[[-23.429,0.931],[-26.398,-2.06],[-23.429,-5.052],[-20.46,-2.06]],"c":true},"ix":2},"nm":"용","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[-1.861,0],[0,-1.374],[1.861,0],[0,1.374]],"o":[[1.861,0],[0,1.374],[-1.861,0],[0,-1.374]],"v":[[-23.429,-15.11],[-20.371,-12.784],[-23.429,-10.458],[-26.486,-12.784]],"c":true},"ix":2},"nm":"용","mn":"ADBE Vector Shape - Group","hd":false},{"ind":3,"ty":"sh","ix":4,"ks":{"a":0,"k":{"i":[[-0.886,0],[-0.731,0.266],[0,0],[0,0],[0,0]],"o":[[0.864,0],[0,0],[0,0],[0,0],[0.731,0.266]],"v":[[-23.429,-8.596],[-20.992,-9.017],[-20.992,-7.001],[-25.866,-7.001],[-25.866,-9.017]],"c":true},"ix":2},"nm":"용","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"용","np":7,"cix":2,"bm":0,"ix":4,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[7.26,-15.841],[5.044,-15.841],[5.044,-12.961],[-2.622,-12.961],[-2.622,-15.841],[-4.837,-15.841],[-4.837,-6.337],[0.103,-6.337],[0.103,-2.836],[-7.474,-2.836],[-7.474,-0.886],[9.896,-0.886],[9.896,-2.836],[2.319,-2.836],[2.319,-6.337],[7.26,-6.337]],"c":true},"ix":2},"nm":"보","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[-2.622,-8.242],[-2.622,-11.1],[5.044,-11.1],[5.044,-8.242]],"c":true},"ix":2},"nm":"보","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"보","np":5,"cix":2,"bm":0,"ix":5,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[23.344,-16.506],[21.217,-16.506],[21.217,1.772],[23.344,1.772],[23.344,-8.043],[25.382,-8.043],[25.382,2.216],[27.553,2.216],[27.553,-16.728],[25.382,-16.728],[25.382,-9.948],[23.344,-9.948]],"c":true},"ix":2},"nm":"내","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[12.377,-15.642],[12.377,-3.678],[20.331,-3.678],[20.331,-5.583],[14.504,-5.583],[14.504,-15.642]],"c":true},"ix":2},"nm":"내","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"내","np":5,"cix":2,"bm":0,"ix":6,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0]],"v":[[47.736,-7.799],[30.366,-7.799],[30.366,-5.893],[47.736,-5.893]],"c":true},"ix":2},"nm":"는","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[45.321,0.089],[35.329,0.089],[35.329,-4.077],[33.113,-4.077],[33.113,1.994],[45.321,1.994]],"c":true},"ix":2},"nm":"는","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"v":[[33.113,-16.218],[33.113,-9.881],[45.1,-9.881],[45.1,-11.787],[35.329,-11.787],[35.329,-16.218]],"c":true},"ix":2},"nm":"는","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"는","np":6,"cix":2,"bm":0,"ix":7,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,-2.105],[-2.902,0],[0,2.437],[2.371,0.332],[0,0]],"o":[[0,0],[0,0],[0,0],[0,0],[0,0],[-2.371,0.332],[0,2.437],[2.902,0],[0,-2.105],[0,0],[0,0]],"v":[[72.376,-6.536],[72.376,-8.441],[55.006,-8.441],[55.006,-6.536],[62.583,-6.536],[62.583,-4.963],[58.418,-1.041],[63.691,2.969],[68.964,-1.041],[64.799,-4.963],[64.799,-6.536]],"c":true},"ix":2},"nm":"중","mn":"ADBE Vector Shape - Group","hd":false},{"ind":1,"ty":"sh","ix":2,"ks":{"a":0,"k":{"i":[[-0.775,1.44],[-2.637,-0.332],[0,0],[0.377,1.772],[0,0],[0,0],[0,0],[0,0],[0,0],[2.592,-0.354],[0,0]],"o":[[0.775,1.44],[0,0],[-2.614,-0.354],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.377,1.772],[0,0],[2.614,-0.332]],"v":[[63.691,-12.341],[69.895,-9.305],[70.449,-11.211],[64.843,-14.357],[69.629,-14.357],[69.629,-16.218],[57.753,-16.218],[57.753,-14.357],[62.539,-14.357],[56.934,-11.211],[57.488,-9.305]],"c":true},"ix":2},"nm":"중","mn":"ADBE Vector Shape - Group","hd":false},{"ind":2,"ty":"sh","ix":3,"ks":{"a":0,"k":{"i":[[1.861,0],[0,1.263],[-1.861,0],[0,-1.263]],"o":[[-1.861,0],[0,-1.263],[1.861,0],[0,1.263]],"v":[[63.691,1.108],[60.634,-1.041],[63.691,-3.19],[66.749,-1.041]],"c":true},"ix":2},"nm":"중","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"mm","mm":1,"nm":"Merge Paths 1","mn":"ADBE Vector Filter - Merge","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"중","np":6,"cix":2,"bm":0,"ix":8,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.82,0],[0,-0.842],[-0.842,0],[0,0.82]],"o":[[-0.842,0],[0,0.82],[0.82,0],[0,-0.842]],"v":[[75.898,-1.152],[74.414,0.31],[75.898,1.772],[77.338,0.31]],"c":true},"ix":2},"nm":".","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":".","np":3,"cix":2,"bm":0,"ix":9,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.82,0],[0,-0.842],[-0.842,0],[0,0.82]],"o":[[-0.842,0],[0,0.82],[0.82,0],[0,-0.842]],"v":[[81.442,-1.152],[79.958,0.31],[81.442,1.772],[82.882,0.31]],"c":true},"ix":2},"nm":".","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":".","np":3,"cix":2,"bm":0,"ix":10,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0.82,0],[0,-0.842],[-0.842,0],[0,0.82]],"o":[[-0.842,0],[0,0.82],[0.82,0],[0,-0.842]],"v":[[86.986,-1.152],[85.502,0.31],[86.986,1.772],[88.426,0.31]],"c":true},"ix":2},"nm":".","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741149902344,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":".","np":3,"cix":2,"bm":0,"ix":11,"mn":"ADBE Vector Group","hd":false}],"ip":36,"op":126,"st":-4,"bm":0},{"ddd":0,"ind":4,"ty":4,"nm":"plane","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.1],"y":[1]},"o":{"x":[0.6],"y":[0]},"t":0,"s":[23]},{"i":{"x":[0.1],"y":[1]},"o":{"x":[0.167],"y":[0]},"t":51,"s":[0.638]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.7],"y":[0]},"t":99,"s":[0]},{"t":135,"s":[-12]}],"ix":10},"p":{"a":1,"k":[{"i":{"x":0.1,"y":0.914},"o":{"x":0.6,"y":0},"t":0,"s":[22.116,553.029,0],"to":[70.75,-74.417,0],"ti":[-61,94.083,0]},{"i":{"x":0.745,"y":0},"o":{"x":0.354,"y":0.767},"t":51.076,"s":[330.616,207.029,0],"to":[3.369,-5.197,0],"ti":[-3.2,5.719,0]},{"i":{"x":0.984,"y":0.994},"o":{"x":0.898,"y":0.169},"t":99,"s":[340.471,190.632,0],"to":[54.743,-97.818,0],"ti":[0,0,0]},{"t":135,"s":[470.616,-78.471,0]}],"ix":2,"l":2},"a":{"a":0,"k":[112.616,108.529,0],"ix":1,"l":2},"s":{"a":0,"k":[40,40,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0],[-1.92,3.195],[-1.064,0.575],[0,0],[-0.779,-1.442],[0.24,-0.765],[0,0],[3.557,1.116],[0.458,0.275],[0,0],[0,0],[0.83,0.025],[0.048,1.557],[0,0],[0,0]],"o":[[0,0],[0,0],[-3.195,-1.92],[0.622,-1.037],[0,0],[1.442,-0.779],[0.381,0.705],[0,0],[-1.116,3.556],[-0.509,-0.16],[0,0],[0,0],[-0.58,0.595],[-1.577,-0.046],[0,0],[0,0],[0,0]],"v":[[61.221,-46.196],[-53.333,53.412],[-108.382,20.335],[-110.691,11.074],[-108.115,8.612],[107.849,-108.085],[111.87,-106.885],[112.091,-104.586],[46.709,103.801],[38.249,108.22],[36.793,107.565],[-10.925,78.893],[-38.168,106.839],[-40.381,107.733],[-43.259,104.86],[-43.259,104.68],[-41.94,60.257]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"fl","c":{"a":0,"k":[0.741176470588,1,0,1],"ix":4},"o":{"a":0,"k":100,"ix":5},"r":1,"bm":0,"nm":"Fill 1","mn":"ADBE Vector Graphic - Fill","hd":false},{"ty":"tr","p":{"a":0,"k":[112.331,108.5],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":-13,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"Group 1","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":3600,"st":0,"bm":0}],"markers":[]}');
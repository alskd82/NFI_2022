import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

import lottie from 'lottie-web';
import lottiePath from './section-desc_text.json';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

/* ---------------- */

const gnbWrap = document.querySelector('.gnb-wrap');
const floatingDownload = document.querySelector('.float-download');
let billboard 

document.addEventListener('DOMContentLoaded', ()=>{
    addEvent();

    GNB();
    Floating();

    Section_Desc();
    Section_Apply();
    Section_TargetHow();
    Section_LYB();
    Section_Step();
    Section_Next();
    Section_List();
    Section_Supporters();

    billboard = new Billboard({
        elem: '.billboard',
        imgElem: '.billboard-img',
        imgWrap: '.billboard-img-wrap',
        imgSrc: [
            "https://uploads-ssl.webflow.com/616e2bb0893fb3c0e9866cf3/61c556e852103b255a5398af_img_pc_bil01.jpg",
            "https://uploads-ssl.webflow.com/616e2bb0893fb3c0e9866cf3/61c556e8ff1fed575f524916_img_pc_bil02.jpg",
            "https://uploads-ssl.webflow.com/616e2bb0893fb3c0e9866cf3/61c556e99385b1604532697f_img_pc_bil03.jpg"
        ],
        imgScale: 1.1,
        overlayTime: 1,
        imgTime: 4,
    })

    let imgCount = 0;
    billboard.opts.imgSrc.forEach((imgSrc, i)=>{
        console.log(imgSrc)
        const img = new Image();
        img.src = imgSrc;
        img.onload =()=> {
            imgCount++;
            if(imgCount === billboard.opts.imgSrc.length){
                document.body.classList.add('loaded');
                billboard.play()
            }
        }
    })
    // billboard.play()
})

// window.addEventListener('load', ()=>{
//     document.body.classList.add('loaded');
//     billboard.play()
// })

function addEvent(){
    floatingDownload.addEventListener('mouseenter', floatingDownload_Fn, false);
    floatingDownload.addEventListener('mouseleave', floatingDownload_Fn, false);
    

    window.addEventListener('resize', ()=>{
        ScrollTrigger.refresh();
    })
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
            if( gnbWrap.getAttribute('data-state') === "hide") gnbShowHide_Fn( 'show' )

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
}

const firstFocus=(elem)=> gsap.to(window, 0, { scrollTo: elem });
// firstFocus(".section-next-fashion")


/* ====================================================================================================================*/
/* scroll */

let isGnbOpenForce = false;         // gnb 강제 오픈 //
let prevPageY;
let scrollDirection;

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
            if( gnbWrap.getAttribute('data-state') === "show") gnbShowHide_Fn( 'hide' )
        } else {
            if( gnbWrap.getAttribute('data-state') === "hide") gnbShowHide_Fn( 'show' )
        }
    } else {
        if( gnbWrap.getAttribute('data-state') === "hide") gnbShowHide_Fn( 'show' )
    }
}



/* ====================================================================================================================*/
/* GNB */
const GNB = function(){
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

    /* 풋터 등장 시점 - gnb 강제 호출 */
    const ioFooterOptions = { rootMargin: '0px 0px -160px 0px' }
    const ioFooter = new IntersectionObserver(( entries, observer )=>{
        isGnbOpenForce = entries[0].isIntersecting
    }, ioFooterOptions);
    ioFooter.observe( document.querySelector('footer') )
}


function gnbShowHide_Fn( state ){       /* gnb 등장-숨기기 */
    const _y = (state === 'show') ? 0 : -gsap.getProperty('.gnb-wrap', 'height');
    document.querySelector('.gnb-wrap').setAttribute('data-state', state)
    gsap.to('.gnb-wrap .navi', .6, {ease: "Quint.easeOut", y: _y})
}


/* ====================================================================================================================*/
/* Floating */


const Floating = function(){
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
    ioFloating.observe( document.querySelector('.section-supporters') )
}

//gnbChangeColor_Fn(true)
//floatingColor_Fn(true)

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



/* ====================================================================================================================*/
/* 상단 비주얼 모션 section-header */

class Billboard {
    constructor( opts ){
        if(opts.imgSrc === undefined) return;
        const defaults = {
            imgScale: 1.1,
            overlayTime: 1,
            imgTime: 4,
        }
        this.opts = {...defaults, ...opts}
        this.imgArr = document.querySelectorAll(opts.imgElem)
        this.imgWrapArr = document.querySelectorAll(opts.imgWrap)

        this.index = 0;
        // this.isPlay = false;
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
            item.style.backgroundImage = `url(${this.opts.imgSrc[i]})`

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
// /* Section_Desc - ScrollTrigger */

const Section_Desc = function(){
    const descClipMaskImg = new ClipMaskImg({
        maskElem: '.desc_img-mask',
        imgElem: '.desc_img',
        clipPosition: 'left',
        imgDelayTime: .3,
    })

    gsap.set('.section-desc .desc_txt > div', {y: '90%'}) 
    
    
    ScrollTrigger.create({
        // markers: true, 
        //animation: descClipMaskImg.play(),
        trigger: '.desc_img-wrap',
        start: "top 95%",
        onEnter:()=>{
            descClipMaskImg.play()
            gsap.to('.section-desc .desc_txt > div', 1, {delay: .5, y: '0%', stagger: 0.1, ease: "Quint.easeOut"})
        }
    })

    //--------------------------------------------------------------------------------------
    document.querySelector('.desc_info-txt').innerHTML += `<div id="textMasking"></div>`;
    const textMasking = lottie.loadAnimation({
        container: document.querySelector('#textMasking'),
        // path: 'https://static.msscdn.net/webflow/static/partners/section-desc_text.json',
        animationData: JSON.parse( JSON.stringify(lottiePath)),
        autoplay: false, loop: false
    })
    //------------------------------------------------------------------------------------------

    // const _before = CSSRulePlugin.getRule(".section-desc .desc_info-txt_strong::before")
    function set(){     
        // gsap.set( _before, { cssRule:{ width: '0px'}})
        gsap.set( '.section-desc .desc_info-txt_p', {y: 60, autoAlpha: 0 })
        document.querySelector('.section-desc .desc_info-txt_strong').style.color = "white";
    }
    set()  


    const showTxt_tl = gsap.timeline()
    showTxt_tl.to('.section-desc .desc_info-txt_p', 1.0, { y: 0, stagger: 0.1, ease: "Quint.easeOut"})
    showTxt_tl.to('.section-desc .desc_info-txt_p', .5, { autoAlpha: 1, stagger: 0.1 , ease: "none"}, 0)
    // showTxt.to( _before, 0.5, { cssRule:{ width: '315px'}, ease: BezierEasing(0.4,0,0.2,1) , onComletet:()=>{
    //     document.querySelector('.section-desc .desc_info-txt_strong').style.color = "#BDFF00";
    // }},  "=-0.8")
    // showTxt.to( _before, 0.3, { cssRule:{ x: 317px}, ease: BezierEasing(0.8,0,0.66,1) } )

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
        },
        // onLeaveBack:()=>{
        //     textMasking.goToAndStop(1, false)
        //     document.querySelector('.section-desc .desc_info-txt_strong').style.color = "#fff";
        // }
    })
}

/* ====================================================================================================================*/
// /* APPLAY- ScrollTrigger */

const Section_Apply = function(){

    const applyClipMaskImg = new ClipMaskImg({
        maskElem: '.apply-mask',
        imgElem: '.apply-img',
        clipPosition: 'center',
        maskTime: 1.5, maskEase: BezierEasing(0.5,0,0,1),
        imgTime: 2.3, imgEase: BezierEasing(0.6,0,0.1,1),
        wordElem: '.section-apply .apply-txt',
        charGap: 450,
    })

    function set(){
        gsap.set('.apply-wrap',{ y: 200 })
    }
    set()

    ScrollTrigger.create({
        // markers: true, 
        // animation: apply_tl,
        trigger: '.section-apply',
        start: `top 75%`, 
        onEnter:()=>{
            applyClipMaskImg.play();
            gsap.to('.apply-wrap', 2, { y: 0, ease: BezierEasing(0.4,0,0.2,1)})
        }
    })
}

/* ====================================================================================================================*/
// /* 모집대상 - 지원 방법 - 선발 절차 - 선발 혜택*/

const Section_TargetHow = function(){
    function set(){
        gsap.set('.info-txt_wrap',{ y: 150, opacity: 0 })
    }
    set()

    const target_tl = gsap.timeline();
    target_tl.to('.section-target .info-txt_wrap', 1.5, {y: 0, opacity: 1, ease: "Quart.easeOut" })
    ScrollTrigger.create({
        // markers: true, 
        animation: target_tl,
        trigger: '.section-target',
        start: `top 75%`, 
    })

    const how_tl = gsap.timeline();
    how_tl.to('.section-how .info-txt_wrap', 1.5, {y: 0, opacity: 1, ease: "Quart.easeOut" })
    ScrollTrigger.create({
        // markers: true, 
        animation: how_tl,
        trigger: '.section-how',
        start: `top 75%`, 
    })

    const step_tl = gsap.timeline();
    step_tl.to('.section-step .info-txt_wrap', 1.5, {y: 0, opacity: 1, ease: "Quart.easeOut" })
    ScrollTrigger.create({
        // markers: true, 
        animation: step_tl,
        trigger: '.section-step .container-1380',
        start: `top 75%`, 
    })

    const benefit_tl = gsap.timeline();
    benefit_tl.to('.section-benefit .info-txt_wrap', 1.5, {y: 0, opacity: 1, ease: "Quint.easeOut" })
    ScrollTrigger.create({
        // markers: true, 
        animation: benefit_tl,
        trigger: '.section-benefit .container-1380',
        start: `top bottom`, 
    })

    const winner_tl = gsap.timeline();
    winner_tl.to('.section-winner .info-txt_wrap', 1.5, {y: 0, opacity: 1, ease: "Quint.easeOut" })
    ScrollTrigger.create({
        // markers: true, 
        animation: winner_tl,
        trigger: '.section-winner .container-1380',
        start: `top bottom`, 
    })


}

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
        // animation: how_tl,
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
    // console.log(stepArr)

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
            start: `center 90%`,
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


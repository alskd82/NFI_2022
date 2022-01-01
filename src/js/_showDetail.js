import {gsap} from 'gsap';
import imagesLoaded from 'imagesloaded';


class ShowDetail{
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

    fetchPage(src){
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
        this.pageElem.querySelector('.winner_container').style.pointerEvents = 'auto'
        gsap.to( this.closeElem, .2, {opacity: 1, ease: 'quint.easeOut'} );
        gsap.to( this.panElem, .6, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: BezierEasing(0.8,0,0,1)})
    }

    close(e){
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

export default ShowDetail;
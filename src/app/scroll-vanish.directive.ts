import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[myScrollVanish]'
})
export class ScrollVanishDirective implements OnInit {

  @Input('myScrollVanish') scrollArea;

  private scrollElement;
  private scrollObservable: Observable<CustomEvent>;
  private hidden: boolean = false;
  private triggerDistance: number = 20;

  constructor(private element: ElementRef, private renderer: Renderer2, private domCtrl: DomController) { 
    
  }

  ngOnInit(){

    // Wait until 'ion-scroll' element is added to 'ion-content'
    let mutationObserver = new MutationObserver(() => {

      this.scrollElement = this.scrollArea.getScrollElement();

      if(this.scrollElement !== null){

        this.initStyles();

        this.scrollObservable = fromEvent(this.scrollElement, 'ionScroll');
  
        this.scrollObservable.subscribe((scrollEvent: CustomEvent) => {
  
          let delta = scrollEvent.detail.deltaY;

          if(scrollEvent.detail.currentY === 0 && this.hidden){
            this.show();
          }
          else if(!this.hidden && delta > this.triggerDistance){
            this.hide();
          } else if(this.hidden && delta < -this.triggerDistance) {
            this.show();
          }
  
        });

      }

    });

    mutationObserver.observe(this.scrollArea.shadowRoot, {
      childList: true
    });

  }

  initStyles(){
    
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'transition', '0.3s linear');
    });

  }

  hide(){

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'min-height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
    });

    this.hidden = true;

  }

  show(){

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'height', '44px');
      this.renderer.removeStyle(this.element.nativeElement, 'opacity');
      this.renderer.removeStyle(this.element.nativeElement, 'min-height');
      this.renderer.removeStyle(this.element.nativeElement, 'padding');
    });

    this.hidden = false;

  }

}

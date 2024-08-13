import "./ios-picker.css";
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getRandomInt } from "@/lib/common";

export const IosPickerItem = ({items, duration=50, delay=20}) => {

  const loop = true;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      axis: 'y',
      dragFree: true,
      containScroll: true,
      watchSlides: false,
      duration: duration,
      watchDrag: true
   },
   [
    Autoplay({
      playOnInit:false,
      delay: delay
    })
   ]
  )

  const CIRCLE_DEGREES = 360
  const WHEEL_ITEM_SIZE = 35
  const WHEEL_ITEM_COUNT = items.length
  const WHEEL_ITEMS_IN_VIEW = 4

  const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
  const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
  const WHEEL_RADIUS = Math.round(
    WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT)
  )

  const isInView = (wheelLocation, slidePosition) =>
    Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

  const setSlideStyles = (emblaApi, index, loop, slideCount, totalRadius) => {
    const slideNode = emblaApi.slideNodes()[index]
    const wheelLocation = emblaApi.scrollProgress() * totalRadius
    const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
    const positionLoopStart = positionDefault + totalRadius
    const positionLoopEnd = positionDefault - totalRadius

    let inView = false
    let angle = index * -WHEEL_ITEM_RADIUS

    if (isInView(wheelLocation, positionDefault)) {
      inView = true
    }

    if (loop && isInView(wheelLocation, positionLoopEnd)) {
      inView = true
      angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
    }

    if (loop && isInView(wheelLocation, positionLoopStart)) {
      inView = true
      angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
    }

    if (inView) {
      slideNode.style.opacity = '1'
      slideNode.style.transform = `translateY(-${
        index * 100
      }%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
    } else {
      slideNode.style.opacity = '0'
      slideNode.style.transform = 'none'
    }
  }

  const setContainerStyles = (emblaApi, wheelRotation) => {
    emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`
  }

  const slideCount = items.length;
  const rootNodeRef = useRef(null)
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS

  const [isPlaying, setIsPlaying]   = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const inactivateEmblaTransform = useCallback((emblaApi) => {
    if (!emblaApi) return
    const { translate, slideLooper } = emblaApi.internalEngine()
    translate.clear()
    translate.toggleActive(false)
    slideLooper.loopPoints.forEach(({ translate }) => {
      translate.clear()
      translate.toggleActive(false)
    })
  }, [])

  const rotateWheel = useCallback(
    (emblaApi) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset
      const wheelRotation = rotation * emblaApi.scrollProgress()
      setContainerStyles(emblaApi, wheelRotation)
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
      })
    },
    [slideCount, rotationOffset, totalRadius]
  )

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerUp', (emblaApi) => {
      const { scrollTo, target, location } = emblaApi.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)
    })

    emblaApi.on('scroll', rotateWheel)

    emblaApi.on('reInit', (emblaApi) => {
      inactivateEmblaTransform(emblaApi)
      rotateWheel(emblaApi)
    })

    emblaApi.on('settle', (emblaApi) => {
      setCurrentIndex(emblaApi.selectedScrollSnap())
    })

    inactivateEmblaTransform(emblaApi)
    rotateWheel(emblaApi)
  }, [emblaApi, inactivateEmblaTransform, rotateWheel])

  // Manage autoplay state
  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    setIsPlaying(autoplay.isPlaying())
    emblaApi
      .on('autoplay:play', () => setIsPlaying(true))
      .on('autoplay:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoplay.isPlaying()))
  }, [emblaApi])

  // toggles the state of the autoplay
  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    if (autoplay.isPlaying()) {
      console.log("Stopping autoplay")
      autoplay.stop()
    } else {
      console.log("Starting autoplay")
      autoplay.play()
    }
  }, [emblaApi])

  // const spinDown = (target=null) => {
  //   if (!emblaApi) return
  //   const autoplay = emblaApi?.plugins()?.autoplay
  //   if (!autoplay) return

  //   // console.log(emblaApi.selectedScrollSnap())
  //   let wasDelayed = true;
  //   if (target == null) {
  //     wasDelayed = false;
  //     target = getRandomInt(items.length);
  //   }

  //   const distance = target - emblaApi.selectedScrollSnap();

  //   if (-6 < distance && distance < 2) {
  //     console.log(`Delaying spinDown, distance: ${distance}`)
  //     setTimeout(spinDown, 5, target)
  //     return
  //   } else {
  //     if (!wasDelayed) {
  //       console.log(`Not delaying spinDown, distance: ${distance}, isplaying: ${autoplay.isPlaying()}`)
  //     }
  //     console.log(`Calling scrollTo distance: ${distance}`)
  //     emblaApi.scrollTo(target);
  //   }
  // }

  const spinUp = () => {
    if (!emblaApi) return
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    if (isPlaying) {
      // toggleAutoplay()
      autoplay.stop();
    }
    toggleAutoplay()

    // Generate a random number of ms between 1000 and 3000
    const spinMod = 100 * getRandomInt(10, 30);

    setTimeout(toggleAutoplay, spinMod)
    // setTimeout(spinDown,       spinMod+400)
  };



  return (
    <>
    <div className="flex flex-col items-center w-full h-full py-2 text-sm md:text-lg">
        <div className={`embla flex flex-col items-center text-center`}>
          <div className="embla__ios-picker__scene" ref={rootNodeRef}>
            <div className={`embla__ios-picker__viewport`} ref={emblaRef}>
              <div className="embla__ios-picker__container">
                {items.map((item, index) => (
                  <div className="embla__ios-picker__slide" key={index}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={spinUp} disabled={isPlaying} className="w-full" >Spin</Button>
      {/* <p>{items[currentIndex]}</p> */}
    </>
  )
}

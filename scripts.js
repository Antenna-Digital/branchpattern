console.log("%cscripts.js loaded", "color: lightgreen;");

// Prevent restoration of scroll position in history navigation
if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

// Register GSAP Stuff
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(CustomEase);

// GSAP Custom Eases
CustomEase.create("in-out-quad", "0.45, 0, 0.55, 1");
CustomEase.create("in-out-quart", "0.76, 0, 0.24, 1");
CustomEase.create("stat-ease", "0.5, 1, 0.89, 1");

window.Webflow = window.Webflow || [];

// Debounce Function
const debounce = (func, delay = 500) => {
  let timer;
  return function (event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(event);
    }, delay);
  };
}; // end debounce

// Throttle Function
const throttle = (func, delay = 500) => {
  let timerFlag = null; // Variable to keep track of the timer

  // Returning a throttled version
  return function (...args) {
    const context = this; // Capture the correct context
    if (timerFlag === null) {
      func.apply(context, args); // Execute the main function with the correct context
      timerFlag = setTimeout(() => {
        // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}; // end throttle

// Macy.js configuration
const macyConfig = {
  container: ".masonry-collection-list",
  trueOrder: true,
  waitForImages: true,
  // useOwnImageLoader: true,
  margin: {
    x: 20,
    y: 32,
  },
  columns: 3,
  breakAt: {
    991: 2,
    600: 1,
  },
}; // end macy config

// Reset Webflow
function resetWebflow(data) {
  // console.log("RESET WEBFLOW");
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, "text/html");
  let webflowPageId = $(dom).find("html").attr("data-wf-page");
  $("html").attr("data-wf-page", webflowPageId);
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();
  document.dispatchEvent(new Event("readystatechange"));
} // end reset webflow

// Barba Init
const initBarba = () => {
  if ($("[data-barba]").length && !$("html").hasClass("w-editor")) {
    // console.log("%c start init barba", "color: lightblue;");
    barba.init({
      preventRunning: true,
      timeout: 5000,
      debug: false,
      transitions: [
        {
          // sync: true,
          name: "shape-swipe-transition",
          before() {
            gsap.set(".transition-shape", {
              y: "-100%",
            });
          },
          leave() {
            // console.log("%c leaving", "color: lightblue;");
            return gsap.to(".transition-shape", {
              y: "100%",
              duration: 1,
              onComplete: () => {
                // console.log(
                //   "%c [DEBUG] Leave transition cleanup",
                //   "background: #ff0000; color: white"
                // );

                // Clean up Finsweet attributes
                if (window.fsAttributes && window.fsAttributes.destroy) {
                  window.fsAttributes.destroy();
                }

                // Clear sort states and classes
                const sortButton = document.querySelector(".fs_cmssort_button");
                if (sortButton) {
                  // Remove all classes except the base class
                  sortButton.className = "fs_cmssort_button";

                  // Remove all sort-related attributes
                  sortButton.removeAttribute("aria-sort");

                  // console.log(
                  //   "%c [DEBUG] Sort button cleaned",
                  //   "background: #ff0000; color: white",
                  //   {
                  //     className: sortButton.className,
                  //     attributes: [...sortButton.attributes].map(
                  //       (attr) => `${attr.name}="${attr.value}"`
                  //     ),
                  //   }
                  // );
                }
              },
            });
          },
          after(data) {
            // console.log("%c after", "color: lightblue;");
            // console.log("%c after functions", "color: lightblue;");
            return gsap.to(".transition-shape", {
              y: "200%",
              duration: 1,
              onComplete: () => {
                init();
              },
            });
          },
          afterEnter(data) {
            // console.log("%c after entering transition", "color: lightblue;");
            let transitionData = data;
            resetWebflow(transitionData);
            // imageAnimationDebounced();
            // fadeInElementsAnimationDebounced();
          },
        },
      ],
    });

    barba.hooks.leave((data) => {
      // console.log("%c leaving global", "color: lightblue;");
      // $(".menu-button.w-nav-button.w--open").click(); // close mega menu
      // $("body[style]").removeAttr("style");
    });
    barba.hooks.afterLeave((data) => {
      // console.log("%c after leaving global", "color: lightblue;");
      if (data.next.namespace === "home") {
        disableScroll();
      }
      $(".menu-button.w-nav-button.w--open").click(); // close mega menu
      $("body[style]").removeAttr("style");
      ScrollTrigger.killAll();
      // console.log("after killing all");
    });
    barba.hooks.afterEnter((data) => {
      // console.log("%c after entering global", "color: lightblue;");
      window.scrollTo(0, 0);
    });
    barba.hooks.after((data) => {
      // console.log("%c after global", "color: lightblue;");

      // Clean up existing Finsweet attributes before reinitializing
      if (window.fsAttributes && window.fsAttributes.destroy) {
        // console.log(
        //   "%c [DEBUG] Destroying previous fsAttributes instances...",
        //   "background: #ff6600; color: white"
        // );
        window.fsAttributes.destroy();
      }

      // Reset sort button state
      const sortButton = document.querySelector(".fs_cmssort_button");
      if (sortButton) {
        // console.log(
        //   "%c [DEBUG] Resetting sort button state",
        //   "background: #ff6600; color: white",
        //   {
        //     before: {
        //       className: sortButton.className,
        //       attributes: [...sortButton.attributes].map(
        //         (attr) => `${attr.name}="${attr.value}"`
        //       ),
        //     },
        //   }
        // );

        // Reset to match the working state
        sortButton.className = "fs_cmssort_button fs-cmssort_desc";
        sortButton.setAttribute("fs-cmssort-reverse", "true");
        sortButton.setAttribute("fs-cmssort-element", "trigger");
        sortButton.setAttribute("fs-cmssort-field", "Date");
        sortButton.setAttribute("role", "columnheader");
        sortButton.setAttribute("tabindex", "0");
        sortButton.setAttribute("aria-sort", "descending");

        // console.log(
        //   "%c [DEBUG] Sort button state after reset",
        //   "background: #ff6600; color: white",
        //   {
        //     after: {
        //       className: sortButton.className,
        //       attributes: [...sortButton.attributes].map(
        //         (attr) => `${attr.name}="${attr.value}"`
        //       ),
        //     },
        //   }
        // );
      }

      // Clear any existing sort states
      document.querySelectorAll("[aria-sort]").forEach((el) => {
        el.removeAttribute("aria-sort");
      });

      // Remove any lingering sort classes
      const sortClasses = ["fs_cmssort_asc", "fs_cmssort_desc"];
      document.querySelectorAll(`.${sortClasses.join(", .")}`).forEach((el) => {
        sortClasses.forEach((cls) => el.classList.remove(cls));
      });

      let scripts = data.next.container.querySelectorAll("main script");

      scripts.forEach((script) => {
        if (script.src) {
          // Handle external scripts
          let newScript = document.createElement("script");
          newScript.src = script.src;
          newScript.async = script.async;
          newScript.defer = script.defer;

          // Wait for the script to load
          newScript.onload = () => {
            // console.log(`Script loaded: ${script.src}`);
          };

          newScript.onerror = (error) => {
            console.error(`Failed to load script: ${script.src}`, error);
          };

          // Append the new script to the document body to ensure it gets executed
          document.body.appendChild(newScript);
          setTimeout(() => {
            document.dispatchEvent(new Event("readystatechange"));
          }, 500);
        } else {
          // Handle inline scripts
          if (script.innerHTML.trim() !== "") {
            eval(script.innerHTML);
          }
        }
      });
    });
  }
}; // end barba init
// setTimeout(function () {
//   initBarba();
// }, 1000); // delay init for editor view

let lenis;

// Lenis setup
function enableLenis() {
  lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
} // end lenis setup

// Page Load Hero Image animation
const homePageLoadHeroAnimation = () => {
  if ($(".hero-grid---homepage").length) {
    // console.log("home hero exists");
    gsap.set(".hero-content-container", {
      opacity: 0,
    });
    // lenis.scrollTo("top", {
    //   immediate: true,
    //   onComplete: function () {
    //     console.log("scrolled to top SUPPOSEDLY");
    //   },
    // });
    disableScroll();
    let pageLoadTL = gsap.timeline();
    let heroMediaContRect;
    setTimeout(function () {
      heroMediaContRect = $(
        ".hero-media-container .hero-media-inner-container"
      )[0].getBoundingClientRect();
      // console.log(heroMediaContRect);
      if ($(".hero-media-inner-container.animatein").length) {
        pageLoadTL.to(".hero-media-inner-container.animatein", {
          left: heroMediaContRect.left,
          right: heroMediaContRect.right,
          top: heroMediaContRect.top,
          bottom: heroMediaContRect.bottom,
          height: heroMediaContRect.height,
          width: heroMediaContRect.width,
          duration: 1.25,
          delay: 0, // was 0.25
          zIndex: -1,
          ease: "in-out-quart", // was 0.3,0,0.6,1
          onComplete: function () {
            enableScroll();
            // enableLenis();
          },
        });
        pageLoadTL.to(".hero-media-inner-container.animatein", {
          display: "none",
          delay: 0,
        });
        pageLoadTL.to(
          ".hero-content-container",
          {
            opacity: 1,
            duration: 1.25,
            delay: 0,
            ease: "in-out-quad",
            // onStart: function () {
            //   $(".hero-content-container").addClass("faded-in");
            // },
          },
          ">-0.25"
        );
      }
    }, 250); // was 500
  } else {
    enableScroll();
    // enableLenis();
  }
}; // end homepage hero load animation

// Disable Scroll
function disableScroll() {
  $("body").addClass("no-scrolling");
  lenis.stop();
  document.documentElement.style.setProperty("--scrollbar-width", "15px");
  console.log("disable scroll");
} // end disable scroll

// Enable Scroll
function enableScroll() {
  $("body").removeClass("no-scrolling");
  lenis.start();
  document.documentElement.style.setProperty("--scrollbar-width", "0rem");
  document.documentElement.style.setProperty(
    "--body-scroll-behavior",
    "smooth"
  );
  $("body").addClass("body-loaded");
  console.log("enable scroll");
  // window.onscroll = function () {};
} // end enable scroll

// Image Animation setup
const imageAnimation = (delay) => {
  // console.table("start", ScrollTrigger.getAll());
  let startVal = "bottom";
  if (delay) {
    startVal = "75%";
  }
  if (document.querySelector(".image-container:not(.dynamic)") != null) {
    if (window.innerWidth > 500) {
      // ChatGPT Solution
      let animationIndex = 0; // Initialize the animation index variable
      let resetTimeout; // Initialize a variable to hold the reset timeout

      function resetAnimationIndex() {
        clearTimeout(resetTimeout); // Clear the existing timeout
        resetTimeout = setTimeout(() => {
          animationIndex = 0; // Reset animation index after a certain period of time
        }, 500); // Adjust the timeout duration as needed
      }

      if (
        document.querySelector(
          ".image-container:not(.dynamic).animation-complete"
        )
      ) {
        gsap.set(".image-container.animation-complete", { opacity: 1 });
        gsap.set(".image-container.animation-complete .image-cover", {
          yPercent: -101,
        });
      }
      const imageContainers = gsap.utils.toArray(
        ".image-container:not(.dynamic):not(.animation-complete)"
      );
      imageContainers.forEach((imageContainer, index) => {
        // console.log($(imageContainer));
        gsap.set(imageContainer, { opacity: 0 });
        const imageCover = imageContainer.querySelector(".image-cover");

        gsap.timeline({
          scrollTrigger: {
            trigger: imageContainer,
            start: `top ${startVal}`,
            onToggle: () => {
              animationIndex++; // Increment animation index
              animateImageContainer(imageContainer);
              animateImageCover(imageCover, animationIndex, imageContainer); // Call function to animate the image
              resetAnimationIndex(); // Reset animation index timeout
            },
            id: "image-animation-trigger", // Assign an ID to identify these triggers
          },
        });
      });

      function animateImageContainer(imageContainer) {
        gsap.to(imageContainer, {
          duration: 0.25,
          opacity: 1,
        });
      }
      function animateImageCover(imageCover, index, imageContainer) {
        gsap.to(imageCover, {
          duration: 2,
          yPercent: 101,
          delay: index * 0.25,
          ease: CustomEase.create("custom", "0.22, 1, 0.36, 1"),
          onComplete: function () {
            $(imageContainer).addClass("animation-complete");
          },
        });
      }

      // when ScrollTrigger does a refresh(), it maps all the positioning data which
      // factors in transforms, but in this example we're initially setting all the ".box"
      // elements to a "y" of 100 solely for the animation in which would throw off the normal
      // positioning, so we use a "refreshInit" listener to reset the y temporarily. When we
      // return a gsap.set() in the listener, it'll automatically revert it after the refresh()!
      ScrollTrigger.addEventListener("refreshInit", () =>
        gsap.set(".image-container:not(.dynamic) .image-cover", {
          yPercent: -101,
        })
      );
    } else {
      gsap.set(".image-container:not(.dynamic)", { opacity: 1 });
      gsap.set(".image-container:not(.dynamic) .image-cover", {
        yPercent: -101,
      });
    }
  }

  // console.table("end", ScrollTrigger.getAll());
  // console.log("%c imageAnimation is done running", "color: yellow;");
}; // end image animation setup
const imageAnimationDebounced = debounce(imageAnimation, 100);
// end image animation functions

/*
// Fade in elements animation
const OLDfadeInElementsAnimation = () => {
  if (document.querySelector('[data-fade-in="true"].faded-in')) {
    gsap.set('[data-fade-in="true"].faded-in', { opacity: 1 });
  }
  const elements = gsap.utils.toArray('[data-fade-in="true"]:not(.faded-in)');
  elements.forEach((elem) => {
    let fadeDelay = 0.25;
    if (elem.dataset.fadeDelay > 0) {
      fadeDelay = elem.dataset.fadeDelay / 1000;
    }
    const anim = gsap.to(elem, {
      duration: 0.75,
      delay: fadeDelay,
      opacity: 1,
      ease: Power1.easeIn,
      onStart: function () {
        elem.classList.add("faded-in");
      },
    });

    ScrollTrigger.create({
      trigger: elem,
      start: "top bottom-=5%",
      animation: anim,
      toggleActions: "play none none none",
      once: true,
      id: "fade-in-trigger", // Assign an ID to identify these triggers
    });
  });
  console.log("fadeInElementsAnimation is done running");
}; // end fade in elements animation
*/

// Fade in elements animation
const fadeInElementsAnimation = () => {
  if (document.querySelector('[data-fade-in="true"].faded-in')) {
    gsap.set('[data-fade-in="true"].faded-in', { opacity: 1 });
  }

  // Collect elements and group them by data-fade-group
  const elements = gsap.utils.toArray('[data-fade-in="true"]:not(.faded-in)');
  const groupedElements = elements.reduce((groups, elem) => {
    const group = elem.dataset.fadeGroup || "default"; // Group by 'data-fade-group' or default
    if (!groups[group]) groups[group] = [];
    groups[group].push(elem);
    return groups;
  }, {});

  // Apply staggered animation for each group
  Object.keys(groupedElements).forEach((group) => {
    const groupElements = groupedElements[group];

    // Determine stagger delay for this group (default to 100ms for non-default groups)
    const staggerDelay =
      group !== "default" && groupElements[0].dataset.fadeStagger
        ? groupElements[0].dataset.fadeStagger / 1000
        : 0.2;

    // Create a ScrollTrigger batch to group elements that enter the viewport together
    ScrollTrigger.batch(groupElements, {
      start: "top bottom-=5%",
      onEnter: (batch) => {
        // Apply animation with stagger for each element in the batch
        batch.forEach((elem, index) => {
          let fadeDelay = 0.25; // Default delay
          if (elem.dataset.fadeDelay > 0) {
            fadeDelay = elem.dataset.fadeDelay / 1000;
          }

          // Stagger based on the index of elements within the batch
          const totalDelay = fadeDelay + index * staggerDelay;

          gsap.to(elem, {
            duration: 0.75,
            delay: totalDelay,
            opacity: 1,
            ease: Power1.easeIn,
            onStart: function () {
              elem.classList.add("faded-in");
            },
          });
        });
      },
      toggleActions: "play none none none",
      once: true, // Ensures it triggers only once
      id: "fade-in-trigger", // Assign an ID to identify these triggers
    });
  });

  // console.log("%c fadeInElementsAnimation is done running", "color: yellow;");
}; // end fade in elements animation
const fadeInElementsAnimationDebounced = debounce(fadeInElementsAnimation, 100);
// end fade in elements animation functions

// Dynamic Image Animation setup
const dynamicImageAnimation = (delay) => {
  // console.table("start", ScrollTrigger.getAll());
  let startVal = "bottom";
  if (delay) {
    startVal = "75%";
  }
  if (document.querySelector(".image-container.dynamic") != null) {
    if (window.innerWidth > 500) {
      // ChatGPT Solution
      let animationIndex = 0; // Initialize the animation index variable
      let resetTimeout; // Initialize a variable to hold the reset timeout

      function resetAnimationIndex() {
        clearTimeout(resetTimeout); // Clear the existing timeout
        resetTimeout = setTimeout(() => {
          animationIndex = 0; // Reset animation index after a certain period of time
        }, 500); // Adjust the timeout duration as needed
      }

      if (
        document.querySelector(".image-container.dynamic.animation-complete")
      ) {
        gsap.set(".image-container.dynamic.animation-complete", { opacity: 1 });
        gsap.set(".image-container.dynamic.animation-complete .image-cover", {
          yPercent: -101,
        });
      }
      const imageContainers = gsap.utils.toArray(
        ".image-container.dynamic:not(.animation-complete)"
      );
      imageContainers.forEach((imageContainer, index) => {
        // console.log($(imageContainer));
        gsap.set(imageContainer, { opacity: 0 });
        const imageCover = imageContainer.querySelector(".image-cover");

        gsap.timeline({
          scrollTrigger: {
            trigger: imageContainer,
            start: `top ${startVal}`,
            onToggle: () => {
              animationIndex++; // Increment animation index
              animateImageContainer(imageContainer);
              animateImageCover(imageCover, animationIndex, imageContainer); // Call function to animate the image
              resetAnimationIndex(); // Reset animation index timeout
            },
            id: "dyn-image-animation-trigger", // Assign an ID to identify these triggers
          },
        });
      });

      function animateImageContainer(imageContainer) {
        gsap.to(imageContainer, {
          duration: 0.25,
          opacity: 1,
        });
      }
      function animateImageCover(imageCover, index, imageContainer) {
        gsap.to(imageCover, {
          duration: 2,
          yPercent: 101,
          delay: index * 0.25,
          ease: CustomEase.create("custom", "0.22, 1, 0.36, 1"),
          onComplete: function () {
            $(imageContainer).addClass("animation-complete");
          },
        });
      }

      // when ScrollTrigger does a refresh(), it maps all the positioning data which
      // factors in transforms, but in this example we're initially setting all the ".box"
      // elements to a "y" of 100 solely for the animation in which would throw off the normal
      // positioning, so we use a "refreshInit" listener to reset the y temporarily. When we
      // return a gsap.set() in the listener, it'll automatically revert it after the refresh()!
      ScrollTrigger.addEventListener("refreshInit", () =>
        gsap.set(".image-container.dynamic .image-cover", { yPercent: -101 })
      );
    } else {
      gsap.set(".image-container.dynamic", { opacity: 1 });
      gsap.set(".image-container.dynamic .image-cover", { yPercent: -101 });
    }
  }

  // console.table("end", ScrollTrigger.getAll());
  // console.log("%c dynamicImageAnimation is done running", "color: yellow;");
}; // end dynamic image animation setup
const dynamicImageAnimationDebounced = debounce(dynamicImageAnimation, 100);
// end dynamic image animation functions

/*
// Fade in dynamic elements animation
const OLDfadeInDynamicElementsAnimation = () => {
  if (document.querySelector('[data-dyn-fade-in="true"].faded-in')) {
    gsap.set('[data-dyn-fade-in="true"].faded-in', { opacity: 1 });
  }
  const elements = gsap.utils.toArray(
    '[data-dyn-fade-in="true"]:not(.faded-in)'
  );
  elements.forEach((elem) => {
    let fadeDelay = 0.25;
    if (elem.dataset.fadeDelay > 0) {
      fadeDelay = elem.dataset.fadeDelay / 1000;
    }
    const anim = gsap.to(elem, {
      duration: 0.75,
      delay: fadeDelay,
      opacity: 1,
      ease: Power1.easeIn,
      onStart: function () {
        elem.classList.add("faded-in");
      },
    });

    ScrollTrigger.create({
      trigger: elem,
      start: "top bottom-=5%",
      animation: anim,
      toggleActions: "play none none none",
      once: true,
      id: "dyn-fade-in-trigger", // Assign an ID to identify these triggers
    });
  });
  console.log("fadeInDynamicElementsAnimation is done running");
}; // end fade in dynamic elements animation
*/

// Fade in dynamic elements animation
const fadeInDynamicElementsAnimation = () => {
  // if (document.querySelector('[data-dyn-fade-in="true"].faded-in')) {
  //   gsap.set('[data-dyn-fade-in="true"].faded-in', { opacity: 1 });
  // }

  // Collect elements and group them by data-fade-group
  const elements = gsap.utils.toArray('[data-dyn-fade-in="true"]');
  const groupedElements = elements.reduce((groups, elem) => {
    const group = elem.dataset.fadeGroup || "default"; // Group by 'data-fade-group' or default
    if (!groups[group]) groups[group] = [];
    groups[group].push(elem);
    return groups;
  }, {});

  // Apply staggered animation for each group
  Object.keys(groupedElements).forEach((group) => {
    const groupElements = groupedElements[group];

    // Determine stagger delay for this group (default to 100ms for non-default groups)
    const staggerDelay =
      group !== "default" && groupElements[0].dataset.fadeStagger
        ? groupElements[0].dataset.fadeStagger / 1000
        : 0.2;

    // Create a ScrollTrigger batch to group elements that enter the viewport together
    ScrollTrigger.batch(groupElements, {
      start: "top bottom-=5%",
      onEnter: (batch) => {
        // Apply animation with stagger for each element in the batch
        batch.forEach((elem, index) => {
          let fadeDelay = 0.25; // Default delay
          if (elem.dataset.fadeDelay > 0) {
            fadeDelay = elem.dataset.fadeDelay / 1000;
          }

          // Stagger based on the index of elements within the batch
          const totalDelay = fadeDelay + index * staggerDelay;

          gsap.to(elem, {
            duration: 0.75,
            delay: totalDelay,
            opacity: 1,
            ease: Power1.easeIn,
            onStart: function () {
              elem.classList.add("faded-in");
            },
          });
        });
      },
      toggleActions: "play none none none",
      once: true, // Ensures it triggers only once
      id: "dyn-fade-in-trigger", // Assign an ID to identify these triggers
    });
  });

  // console.log(
  //   "%c fadeInDynamicElementsAnimation is done running",
  //   "color: yellow;"
  // );
}; // end fade in dynamic elements animation
const fadeInDynamicElementsAnimationDebounced = debounce(
  fadeInDynamicElementsAnimation,
  100
);
// end fade in dynamic elements animation functions

// Google maps
const googleMapsSetup = () => {
  // Projects Map
  if (document.getElementById("projects-map") != null) {
    let projectsMap;
    async function initProjectsMap() {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );
      const { LatLngBounds } = await google.maps.importLibrary("core");
      let defaultBounds = {
        southwest: { lat: -17.942866, lng: 178.145223 },
        northeast: { lat: 69.989281, lng: 24.458502 },
      };
      let defaultZoom = 2.5;
      projectsMap = new Map(document.getElementById("projects-map"), {
        center: new google.maps.LatLngBounds(
          defaultBounds.southwest,
          defaultBounds.northeast
        ).getCenter(),
        mapId: "7a8884bad2a194eb",
        zoom: defaultZoom,
        minZoom: 2,
        maxZoom: 5,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });

      $("#projects-map").attr("data-zoom", defaultZoom); // Set Default Zoom
      $("#projects-map").attr("data-min-zoom", 2); // Set Min Zoom
      $("#projects-map").attr("data-max-zoom", 7); // Set Max Zoom

      let regions = [
        {
          label: "North America",
          latLngBounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(9.955971, -134.358901),
            new google.maps.LatLng(55.867973, -61.409686)
          ),
          zoom: 4,
        },
        {
          label: "South America",
          latLngBounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(-19.691225, -82.464173),
            new google.maps.LatLng(-3.271653, -61.821503)
          ),
          zoom: 4,
        },
        {
          label: "Europe",
          latLngBounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(31.919306, -28.622138),
            new google.maps.LatLng(62.801953, 43.549995)
          ),
          zoom: 4,
        },
      ];

      // Uncomment to see the regions highlighted using rectangles on the map
      // regions.forEach((region) => {
      //   new google.maps.Rectangle({
      //     bounds: new google.maps.LatLngBounds(region.latLngBounds),
      //     map: projectsMap,
      //     fillOpacity: 0.2,
      //     strokeOpacity: 0.5,
      //     strokeWeight: 1,
      //   });
      // });

      $(".projects-map-content-container select").on("change", function () {
        if ($(this).val() === "All Locations") {
          // Step 1: Zoom out
          projectsMap.setZoom(defaultZoom);

          // Step 2: Pan to the region
          projectsMap.panTo(
            new google.maps.LatLngBounds(
              defaultBounds.southwest,
              defaultBounds.northeast
            ).getCenter()
          );
        } else {
          regions.forEach((region) => {
            if (region.label === $(this).val()) {
              // Step 1: Zoom out
              projectsMap.setZoom(defaultZoom);

              // Step 2: Pan to the region
              setTimeout(() => {
                projectsMap.panTo(region.latLngBounds.getCenter());

                // Step 3: Zoom in to the region after panning
                setTimeout(() => {
                  projectsMap.setZoom(region.zoom);
                }, 600); // Adjust the delay as needed
              }, 600); // Adjust the delay as needed
            }
          });
        }
      });

      let locations = [];

      $(".project-areas > .w-dyn-list > .w-dyn-items > div").each(function () {
        locations.push({
          label: $(this).data("name"),
          lat: $(this).data("lat"),
          lng: $(this).data("long"),
          numberOfProjects: $(this).data("projects"),
        });
      });

      if (locations) {
        locations.forEach((location) => {
          let markerEl = document.createElement("div");
          // let sizeClass;
          // if (location.numberOfProjects <= 2) {
          //   sizeClass = "small";
          // } else if (location.numberOfProjects <= 5) {
          //   sizeClass = "medium";
          // } else if (location.numberOfProjects <= 8) {
          //   sizeClass = "large";
          // } else if (location.numberOfProjects > 10) {
          //   sizeClass = "xlarge";
          // }
          markerEl.classList.add("map-marker");
          // markerEl.classList.add(sizeClass);
          let marker = new AdvancedMarkerElement({
            map: projectsMap,
            position: { lat: location.lat, lng: location.lng },
            content: markerEl,
          });
        });
      }

      projectsMap.addListener("zoom_changed", () => {
        const zoom = projectsMap.getZoom();
        if (zoom) {
          // console.log(zoom);
          $("#projects-map").attr("data-zoom", zoom); // set data-zoom attr
        }
      });

      $("#projects-map-zoom-out").on("click", function () {
        var currentZoom = projectsMap.getZoom();
        projectsMap.setZoom(currentZoom - 0.5);
      });

      $("#projects-map-zoom-in").on("click", function () {
        var currentZoom = projectsMap.getZoom();
        projectsMap.setZoom(currentZoom + 0.5);
      });
    }

    initProjectsMap();
  }

  // Locations Map
  if (document.getElementById("locations-map") != null) {
    let locationsMap;
    let currentInfoWindow = null; // Keep track of the currently open InfoWindow
    let originalCenter; // Variable to store the original center of the map
    async function initLocationsMap() {
      const { Map, InfoWindow } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );
      const { LatLngBounds } = await google.maps.importLibrary("core");
      let defaultBounds = {
        southwest: { lat: 23.974512, lng: -125.266059 },
        northeast: { lat: 50.270732, lng: -71.441805 },
      };
      let defaultZoom = 3.25;
      locationsMap = new Map(document.getElementById("locations-map"), {
        center: new google.maps.LatLngBounds(
          defaultBounds.southwest,
          defaultBounds.northeast
        ).getCenter(),
        mapId: "7a8884bad2a194eb",
        zoom: defaultZoom,
        minZoom: defaultZoom,
        maxZoom: defaultZoom,
        draggable: false,
        scrollwheel: false,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });

      originalCenter = locationsMap.getCenter(); // Store the original center

      $("#locations-map").attr("data-zoom", defaultZoom); // Set Default Zoom

      let officeLocations = [];
      let remoteLocations = [];

      $(".office-locations > .w-dyn-list > .w-dyn-items > div").each(
        function () {
          officeLocations.push({
            label: $(this).data("name"),
            lat: $(this).data("lat"),
            lng: $(this).data("long"),
            streetAddress: $(this).data("address"),
            city: $(this).data("city"),
            stateAbbreviation: $(this).data("state-abbreviation"),
            zipCode: $(this).data("zip-code"),
          });
        }
      );

      $(".remote-locations > .w-dyn-list > .w-dyn-items > div").each(
        function () {
          remoteLocations.push({
            label: $(this).data("name"),
            lat: $(this).data("lat"),
            lng: $(this).data("long"),
            city: $(this).data("city"),
            stateAbbreviation: $(this).data("state-abbreviation"),
          });
        }
      );

      if (officeLocations) {
        // console.log(officeLocations);
        officeLocations.forEach((location) => {
          let markerEl = document.createElement("div");
          markerEl.classList.add("map-marker");
          // markerEl.classList.add("medium");

          // Store marker position
          let markerPosition = { lat: location.lat, lng: location.lng };

          let marker = new AdvancedMarkerElement({
            map: locationsMap,
            position: markerPosition,
            content: markerEl,
          });

          var markerHeight = 40;
          var typicalInfoWindowHeight = 100;

          // Create an InfoWindow for each marker
          let infoWindow = new InfoWindow({
            content: `
                <div class="map-marker-infowindow">
                    <p class="name">${location.label}</p>
                    <p>${location.streetAddress}<br>${location.city}, ${location.stateAbbreviation} ${location.zipCode}</p>
                </div>
            `,
            disableAutoPan: true,
          });

          locationsMap.addListener("click", function () {
            // console.log("locationsmap clicked");
            if (currentInfoWindow && currentInfoWindow.isOpen) {
              currentInfoWindow.close();
              // console.log(originalCenter);
              locationsMap.panTo(originalCenter);
            }
          });

          // Add a click listener to open the InfoWindow when the marker is clicked
          marker.addListener("click", () => {
            // console.log("marker clicked");

            // console.log(marker.getPosition());

            // locationsMap.panTo(marker.getPosition());

            if (currentInfoWindow && currentInfoWindow.isOpen) {
              currentInfoWindow.close();
            }

            infoWindow.open({
              anchor: marker,
              map: locationsMap,
              shouldFocus: false,
            });

            currentInfoWindow = infoWindow;

            // Create bounds that include the marker's position
            let bounds = new google.maps.LatLngBounds();
            bounds.extend(markerPosition); // Use the stored position

            // Adjust the bounds to account for pixel offset
            const offsetX = 100; // Horizontal offset in pixels
            const offsetY = 100; // Vertical offset in pixels

            // Get the current map center and zoom level
            const currentCenter = markerPosition;
            const currentZoom = locationsMap.getZoom();

            // Calculate the new center to account for the offset
            const projection = locationsMap.getProjection();
            const point = projection.fromLatLngToPoint(currentCenter);
            const offsetPoint = new google.maps.Point(
              point.x + offsetX / Math.pow(2, currentZoom),
              point.y + offsetY / Math.pow(2, currentZoom)
            );
            const newCenter = projection.fromPointToLatLng(offsetPoint);

            // Set the new center and zoom level
            locationsMap.panTo(newCenter);
            // locationsMap.setZoom(currentZoom);
          });
        });
      }

      if (remoteLocations) {
        // console.log(remoteLocations);
        remoteLocations.forEach((location) => {
          let markerEl = document.createElement("div");
          markerEl.classList.add("map-marker");
          markerEl.classList.add("remote");
          // markerEl.classList.add("medium");

          // Store marker position
          let markerPosition = { lat: location.lat, lng: location.lng };

          let marker = new AdvancedMarkerElement({
            map: locationsMap,
            position: markerPosition,
            content: markerEl,
          });
        });
      }
    }

    initLocationsMap();
  }
}; // end google maps setup

// Marquee Stuff
const initializeMarquee = () => {
  const marquee = document.querySelector('[wb-data="marquee"]');
  if (!marquee) return;

  let duration = parseFloat(marquee.getAttribute("duration-per-item")) || 2.5;
  const marqueeContent = marquee.firstChild;
  if (!marqueeContent) return;

  const itemList = marquee.querySelector(".w-dyn-items");
  if (itemList) {
    const childrenCount = itemList.children.length;
    duration *= childrenCount; // Multiply the duration by the number of direct children
  }

  const marqueeContentClone = marqueeContent.cloneNode(true);
  marquee.append(marqueeContentClone); // Ensure cloned content is appended correctly

  let tween;

  const playMarquee = () => {
    let progress = tween ? tween.progress() : 0;
    tween && tween.progress(0).kill();

    const width = parseInt(
      getComputedStyle(marqueeContent).getPropertyValue("width")
    );
    const distanceToTranslate = -1 * width;

    tween = gsap.fromTo(
      marquee.children,
      { xPercent: 0 },
      {
        xPercent: -100,
        duration,
        ease: "none",
        repeat: -1,
      }
    );
    tween.progress(progress);
  };

  playMarquee();

  window.addEventListener("resize", debounce(playMarquee));
}; // end marquee stuff

// Stats Circle animation
const statsCircleAnimation = () => {
  if ($("svg.anim-circle").length) {
    gsap.set("svg.anim-circle g#Hand", {
      transformOrigin: "bottom",
      rotation: -45,
    });
    gsap.set("svg.anim-circle circle", {
      transformOrigin: "center center",
      rotation: -135,
    });
    let circleTl = gsap.timeline({
      defaults: {
        duration: 4,
        ease: "stat-ease",
      },
      scrollTrigger: {
        trigger: ".featured-stat-container",
        start: "top center+=25%",
        end: "top top",
      },
    });
    circleTl.to(
      "svg.anim-circle circle",
      {
        strokeDashoffset: 0,
      },
      0
    );
    circleTl.to(
      "svg.anim-circle g#Hand",
      {
        rotation: 315,
      },
      0
    );
  }
}; // end stats circle animation

// Stats Circle - Smaller animation
const statsCircleSmallerAnimation = () => {
  if ($("svg.anim-circle-smaller").length) {
    let circleSmallerTl = gsap.timeline({
      defaults: {
        duration: 4,
        ease: "stat-ease",
      },
      scrollTrigger: {
        trigger: ".featured-stat-container",
        start: "top center+=25%",
        end: "top top",
      },
    });
    $("svg.anim-circle-smaller").each(function (index) {
      // console.log(this);
      gsap.set($(this).find("g#Hand"), {
        transformOrigin: "bottom",
        rotation: -105,
      });
      circleSmallerTl.to(
        $(this).find("circle"),
        {
          strokeDashoffset: 0,
        },
        index * 0.35 // Adding delay
      );
      circleSmallerTl.to(
        $(this).find("g#Hand"),
        {
          transformOrigin: "bottom",
          rotation: 255,
        },
        index * 0.35 // Adding delay
      );
    });
  }
}; // end stats circle - smaller animation

// Stats Box animation
const statsBoxAnimation = () => {
  if ($("svg.stat-section-box").length) {
    boxTL = gsap.timeline({
      defaults: {
        duration: 4,
        ease: "stat-ease",
      },
      scrollTrigger: {
        trigger: ".featured-stat-container",
        start: "top center+=25%",
        end: "top top",
      },
    });
    boxTL.to(
      "svg.stat-section-box rect.top-rect",
      {
        width: "89.5%",
      },
      0
    );
    boxTL.to(
      "svg.stat-section-box rect.bottom-rect",
      {
        width: "89.5%",
      },
      0
    );
    boxTL.to(
      "svg.stat-section-box .top-path",
      {
        transform: "translate3d(89.5%, 0, 0)",
      },
      0
    );
    boxTL.to(
      "svg.stat-section-box .bottom-path",
      {
        transform: "translate3d(89.5%, 0, 0)",
      },
      0
    );
  }
}; // end stats box animation

// Stats Bars animation
const statsBarsAnimation = () => {
  if ($("svg.featured-stat-svg.bars").length) {
    gsap.set("svg.featured-stat-svg.bars clipPath#svg-small-box rect", {
      width: "0",
    });
    gsap.set("svg.featured-stat-svg.bars clipPath#svg-large-box rect", {
      width: "0",
    });
    gsap.set("svg.featured-stat-svg.bars g.small-box rect", {
      width: "0",
    });
    gsap.set("svg.featured-stat-svg.bars g.large-box rect", {
      width: "0",
    });
    barsTL = gsap.timeline({
      defaults: {
        duration: 4,
        ease: "stat-ease",
      },
      scrollTrigger: {
        trigger: ".featured-stat-container",
        start: "top center+=25%",
        end: "top top",
      },
    });
    barsTL.to(
      "svg.featured-stat-svg.bars clipPath#svg-small-box rect",
      {
        width: "150",
      },
      0
    );
    barsTL.to(
      "svg.featured-stat-svg.bars clipPath#svg-large-box rect",
      {
        width: "372",
      },
      0
    );
    barsTL.to(
      "svg.featured-stat-svg.bars g.small-box rect",
      {
        width: "145",
      },
      0
    );
    barsTL.to(
      "svg.featured-stat-svg.bars g.large-box rect",
      {
        width: "367",
      },
      0
    );
  }
}; // end stats box animation

// Stat Numbers Count Up Animation
const statsNumbersAnimation = () => {
  const numbers = document.querySelectorAll(".stat-number");
  if (numbers.length) {
    numbers.forEach((number) => {
      const endValue = parseInt(number.innerHTML.replace(/,/g, ""), 10); // Get the final number value without commas
      gsap.fromTo(
        number,
        { textContent: 0 },
        {
          scrollTrigger: {
            trigger: ".featured-stat-container",
            start: "top center+=25%",
            end: "top top",
          },
          duration: 4,
          textContent: endValue, // Animate to the parsed final number value
          ease: "stat-ease",
          snap: { textContent: 1 },
          stagger: {
            each: 0.35,
            onUpdate: function () {
              this.targets()[0].innerHTML = numberWithCommas(
                Math.ceil(this.targets()[0].textContent)
              );
            },
          },
        }
      );
    });

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}; // end stats number count up animation

const projectsMapDropdown = () => {
  $(".dropdown-select").each(function () {
    let $dropdownSelectContainer = $(this).siblings(
      ".dropdown-select---dropdown"
    );
    $(this).select2({
      minimumResultsForSearch: Infinity,
      dropdownPosition: "below",
      dropdownParent: $dropdownSelectContainer,
      width: "100%",
    });
    $(this).on("select2:select", (e) => {
      var data = e.params.data;
      var region = data.element.dataset.regionOption;
      console.log(region);
      gsap.to(".region-content-container.active", {
        autoAlpha: 0,
        duration: 0.5,
      });
      $(".region-content-container").removeClass("active");
      $(`.region-content-container[data-region="${region}"]`).addClass(
        "active"
      );
      gsap.to(".region-content-container.active", {
        autoAlpha: 1,
        duration: 1,
      });
    });
  });
}; // end projects map dropdown

// Select2 Init
const select2Init = () => {
  $("select.resource-filter").each(function () {
    let $dropdownSelectContainer = $(this).siblings(
      ".dropdown-select---dropdown"
    );
    $(this).select2({
      minimumResultsForSearch: Infinity,
      dropdownPosition: "below",
      dropdownParent: $dropdownSelectContainer,
      width: "auto",
      dropdownAutoWidth: true,
    });
    $(this).on("select2:select", function (e) {
      this.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  $("select.select2-el").each(function () {
    $(this).select2({
      minimumResultsForSearch: Infinity,
      dropdownAutoWidth: true,
    });
  });
}; // end select2 init

// Re-run the function after loading content
const refreshAnimations = () => {
  // Clear only the fade-in and image ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => {
    if (
      trigger.vars.id === "fade-in-trigger" ||
      trigger.vars.id === "image-animation-trigger"
    ) {
      trigger.kill(false);
    }
  });

  imageAnimationDebounced();
  fadeInElementsAnimationDebounced();
  // console.log("%c Animations refreshed", "color: yellow;");
}; // end refreshAnimations
// Debounced version of refreshAnimations
const refreshAnimationsDebounced = debounce(refreshAnimations, 100);
// end refresh animations functions

// Re-run the function after loading dynamic content
const refreshDynamicAnimations = () => {
  // Clear only the fade-in and image ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => {
    if (
      trigger.vars.id === "dyn-fade-in-trigger" ||
      trigger.vars.id === "dyn-image-animation-trigger"
    ) {
      trigger.kill(false);
    }
  });

  dynamicImageAnimationDebounced();
  fadeInDynamicElementsAnimationDebounced();
  // console.log("%c Dynamic Animations refreshed", "color: yellow;");
}; // end refreshDynamicAnimations
// Debounced version of refreshDynamicAnimations
const refreshDynamicAnimationsDebounced = debounce(
  refreshDynamicAnimations,
  100
);
// end refresh dynamic animations functions

// Show team grid (used for revealing grid after dynamic loading of items)
const showTeamGrid = () => {
  console.log("show team grid");
  $(".team-filter-grid").removeClass("hide");
}; // end show team grid
const showTeamGridDebounced = debounce(showTeamGrid, 1000);
// end show team grid functions

// Show resource center (used for revealing resource center after dynamic loading of items)
const showResourceCenter = () => {
  // console.log("show resource center");
  $(".resource-center-grid").removeClass("hide");
}; // end show resource center
const showResourceCenterDebounced = debounce(showResourceCenter, 1000);
// end show resource center functions

const reinitWebflowInteractions = () => {
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();

  // trigger scroll interactions' progress (like navbar fixed to top of screen)
  window.scrollBy(0, 1);
  window.scrollBy(0, -1);
};

// Finsweet Stuff Init
const finsweetInit = () => {
  console.log(
    "%c [DEBUG] Starting finsweetInit",
    "background: #33cc33; color: white"
  );
  // console.log(
  //   "%c [DEBUG] Resource center exists?",
  //   "background: #33cc33; color: white",
  //   $(".resource-center").length
  // );

  // Clear all Finsweet instances first
  if (window.fsAttributes && window.fsAttributes.destroy) {
    console.log("Destroying previous fsAttributes instances...");
    window.fsAttributes.destroy();
  }

  // Reset fsAttributes
  window.fsAttributes = window.fsAttributes || [];

  // Resource Center specific initialization
  if ($(".resource-center").length) {
    // console.log("resource center exists");

    // Clear any existing sort states
    document.querySelectorAll("[aria-sort]").forEach((el) => {
      el.removeAttribute("aria-sort");
    });

    window.fsAttributes.cmsselect.init();
    window.fsAttributes.cmscombine.init();
    window.fsAttributes.cmssort.init();
    window.fsAttributes.cmsfilter.init();
    window.fsAttributes.cmsload.init();
    // console.table("Resource Center fsAttributes: ", window.fsAttributes);

    let macyInstance = Macy(macyConfig);

    // CMS Select
    window.fsAttributes.push([
      "cmsselect",
      (listInstances) => {
        // console.log("%c cmsSelect Successfully loaded!", "color: violet;");
      },
    ]);

    // CMS Combine
    window.fsAttributes.push([
      "cmscombine",
      (listInstances) => {
        // console.log(
        //   "%c [DEBUG] cmsCombine loaded - Before sort setup",
        //   "background: #33cc33; color: white",
        //   {
        //     button: document.querySelector(".fs_cmssort_button"),
        //     state: {
        //       className:
        //         document.querySelector(".fs_cmssort_button")?.className,
        //       attributes: [
        //         ...(document.querySelector(".fs_cmssort_button")?.attributes ||
        //           []),
        //       ].map((attr) => `${attr.name}="${attr.value}"`),
        //     },
        //   }
        // );

        // Force correct sort button state
        const sortButton = document.querySelector(".fs_cmssort_button");
        if (sortButton) {
          // Reset to match the working state from direct load
          sortButton.className = "fs_cmssort_button fs-cmssort_desc";
          sortButton.setAttribute("fs-cmssort-reverse", "true");
          sortButton.setAttribute("fs-cmssort-element", "trigger");
          sortButton.setAttribute("fs-cmssort-field", "Date");
          sortButton.setAttribute("role", "columnheader");
          sortButton.setAttribute("tabindex", "0");
          sortButton.setAttribute("aria-sort", "descending");

          // Add small delay before clicking to ensure proper initialization
          setTimeout(() => {
            // console.log(
            //   "%c [DEBUG] Triggering sort click",
            //   "background: #33cc33; color: white"
            // );
            sortButton.click();
          }, 100);
        }

        // console.log(
        //   "%c [DEBUG] cmsCombine loaded - After sort setup",
        //   "background: #33cc33; color: white",
        //   {
        //     button: document.querySelector(".fs_cmssort_button"),
        //     state: {
        //       className:
        //         document.querySelector(".fs_cmssort_button")?.className,
        //       attributes: [
        //         ...(document.querySelector(".fs_cmssort_button")?.attributes ||
        //           []),
        //       ].map((attr) => `${attr.name}="${attr.value}"`),
        //     },
        //   }
        // );
      },
    ]);

    // CMS Filter
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        // console.log("%c cmsFilter Successfully loaded!", "color: violet;");

        // Ensure filterInstances is defined and not empty
        if (filterInstances && filterInstances.length > 0) {
          // console.log(
          //   "%c CMS FILTER filterInstances is defined",
          //   "color: violet;"
          // );
          // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
          const [filterInstance] = filterInstances;
          // console.log(filterInstance);

          // Ensure filterInstance and listInstance are defined
          if (filterInstance && filterInstance.listInstance) {
            // console.log(filterInstance);
            // Store the timeout reference
            let timeoutRefFilter = setTimeout(function () {
              filterInstance.listInstance.renderItems(true, true);
            }, 500);
            // The `renderitems` event runs whenever the list renders items after filtering.
            filterInstance.listInstance.on("renderitems", (renderedItems) => {
              // console.log("%c cmsFilter rendered", "color: violet;");
              // Clear the timeout if "renderitems" event fires before the timeout interval
              clearTimeout(timeoutRefFilter);
              // Run every time an image loads
              macyInstance.runOnImageLoad(function () {
                // console.log("macy item loaded");
                macyInstance.recalculate(true);
                refreshDynamicAnimationsDebounced();
              }, true);
              // Run only when all images are loaded
              // macyInstance.runOnImageLoad(function () {
              //   // console.log("all macy items are now loaded");
              // }, false);
            });
            $('[fs-cmsselect-element*="select"]').on("change", function () {
              $(".resource-center-grid").addClass("hide");
              filterInstance.listInstance.renderItems(true, true);
              setTimeout(function () {
                macyInstance.recalculate(true);
              }, 1500);
            });
          } else {
            console.error(
              "CMS FILTER filterInstance or listInstance is UNDEFINED"
            );
          }
        } else {
          console.error("CMS FILTER filterInstances is UNDEFINED or empty");
        }
      },
    ]);

    // CMS Sort
    window.fsAttributes.push([
      "cmssort",
      (listInstances) => {
        // console.log("%c cmsSort Successfully loaded!", "color: violet;");

        // Ensure listInstances is defined and not empty
        if (listInstances && listInstances.length > 0) {
          // console.log(window.fsAttributes.cmscore.listInstances);
          // console.log(listInstances);
          // console.log("%c CMS SORT listInstances is defined", "color: violet;");
          // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
          const [listInstance] = listInstances;
          // console.log(listInstance);

          // Ensure listInstance and listInstance are defined
          if (listInstance) {
            // listInstance.renderItems(false, false);
          } else {
            console.error("CMS SORT listInstance is UNDEFINED");
          }
        } else {
          console.error("CMS SORT listInstances is UNDEFINED or empty");
        }
      },
    ]);

    // CMS Load
    window.fsAttributes.push([
      "cmsload",
      (listInstances) => {
        // console.log("%c cmsLoad Successfully loaded!", "color: violet;");

        // Ensure listInstances is defined and not empty
        if (listInstances && listInstances.length > 0) {
          // console.log("%c CMS LOAD listInstances is defined", "color: violet;");
          // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
          const [listInstance] = listInstances;

          // Ensure listInstance and listInstance are defined
          if (listInstance) {
            // console.log(listInstance);
            // Store the timeout reference
            let timeoutRefLoad = setTimeout(function () {
              listInstance.renderItems(true, true);
            }, 500);
            // The `renderitems` event runs whenever the list renders items after switching pages.
            listInstance.on("renderitems", (renderedItems) => {
              // console.log("%c cmsLoad rendered", "color: violet;");
              // console.table("cmsLoad", renderedItems);
              // Clear the timeout if "renderitems" event fires before the timeout interval
              clearTimeout(timeoutRefLoad);
              // Run every time an image loads
              macyInstance.runOnImageLoad(function () {
                // console.log("macy item loaded");
                macyInstance.recalculate(true);
                refreshDynamicAnimationsDebounced();
                showResourceCenterDebounced();
              }, true);
              // Run only when all images are loaded
              macyInstance.runOnImageLoad(function () {
                // console.log("all macy items are now loaded");
                macyInstance.recalculate(true);
              }, false);
            });
            $(".w-pagination-next").on("click", function (e) {
              e.preventDefault();
              e.stopPropagation();
              listInstance.renderItems(true, true);
              setTimeout(function () {
                macyInstance.recalculate(true);
              }, 500);
              setTimeout(function () {
                macyInstance.recalculate(true);
              }, 1500);
            });
          } else {
            console.error("CMS LOAD listInstance is UNDEFINED");
          }
        } else {
          console.error("CMS LOAD listInstances is UNDEFINED or empty");
        }
      },
    ]);
  }
  // Featured Resources
  if ($('[class*="featured-resources-wrapper"]').length) {
    // console.log("featured-resources-wrapper exists");
    // window.fsAttributes.destroy();

    window.fsAttributes.cmscombine.init();
    window.fsAttributes.cmssort.init();
    // console.table("Featured Resources fsAttributes: ", window.fsAttributes);

    // CMS Combine
    window.fsAttributes.push([
      "cmscombine",
      (listInstances) => {
        // console.log("%c cmsCombine Successfully loaded!", "color: violet;");
        // document.querySelector(".fs_cmssort_button").click();
        const buttons = document.querySelectorAll(".fs_cmssort_button");
        buttons.forEach((button) => {
          button.click();
        });
      },
    ]);

    // CMS Sort
    window.fsAttributes.push([
      "cmssort",
      (listInstances) => {
        // console.log("%c cmsSort Successfully loaded!", "color: violet;");
        // let macyInstance = Macy(macyConfig);

        // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
        const [listInstance] = listInstances;

        if (listInstance) {
          // The `renderitems` event runs whenever the list renders items after switching pages.
          listInstance.on("renderitems", (renderedItems) => {
            // console.log("%c cmsSort rendered", "color: violet;");
            // console.table("cmsSort", renderedItems);
            imageAnimationDebounced();
            fadeInElementsAnimationDebounced();
          });
          setTimeout(function () {
            listInstance.renderItems(true, true);
          }, 250);
        }
      },
    ]);
  }
  // Team Filter Grid
  if ($(".team-filter-grid").length) {
    // console.log("team filter grid exists");
    // window.fsAttributes.destroy();

    window.fsAttributes.cmsstatic.init();
    window.fsAttributes.cmsload.init();
    window.fsAttributes.cmsfilter.init();

    let macyInstance = Macy({
      container: ".masonry-collection-list",
      trueOrder: true,
      waitForImages: true,
      // useOwnImageLoader: true,
      margin: {
        x: 20,
        y: 32,
      },
      columns: 4,
      breakAt: {
        991: 3,
        700: 2,
        520: 1,
      },
    });

    // CMS Filter
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        // console.log("cmsFilter Successfully loaded!");
        // console.log(filterInstances);

        // Ensure filterInstances is defined and not empty
        if (filterInstances && filterInstances.length > 0) {
          // console.log("CMS FILTER filterInstances is defined");
          // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
          const [filterInstance] = filterInstances;

          // Ensure filterInstance and listInstance are defined
          if (filterInstance && filterInstance.listInstance) {
            // console.log(filterInstance);
            // Store the timeout reference
            let timeoutRefFilter = setTimeout(function () {
              filterInstance.listInstance.renderItems(true, true);
            }, 500);
            // The `renderitems` event runs whenever the list renders items after filtering.
            filterInstance.listInstance.on("renderitems", (renderedItems) => {
              // console.log("cmsFilter rendered");
              // Clear the timeout if "renderitems" event fires before the timeout interval
              clearTimeout(timeoutRefFilter);
              // Run every time an image loads
              macyInstance.runOnImageLoad(function () {
                // console.log("macy item loaded");
                macyInstance.recalculate(true);
                refreshDynamicAnimationsDebounced();
                showTeamGridDebounced();
              }, true);
            });
            $(".team-filter---checkbox-field, .team-filter---radio-field").on(
              "click",
              function (e) {
                var service = $(this).data("service");
                $(".team-filter-grid").addClass("hide");
                if (service) {
                  $(".team-filter-grid").attr("data-service", service);
                } else {
                  $(".team-filter-grid").attr("data-service", "");
                }
                filterInstance.listInstance.renderItems(true, true);
                setTimeout(() => {
                  reinitWebflowInteractions();
                  // console.log("webflow reset from filter selection");
                  teamGrid();
                  macyInstance.recalculate(true);
                }, 1500);
              }
            );
          } else {
            console.error(
              "CMS FILTER filterInstance or listInstance is UNDEFINED"
            );
          }
        } else {
          console.error("CMS FILTER filterInstances is UNDEFINED or empty");
        }
      },
    ]);

    // CMS Load
    window.fsAttributes.push([
      "cmsload",
      (listInstances) => {
        // console.log("cmsLoad Successfully loaded!");

        // Ensure listInstances is defined and not empty
        if (listInstances && listInstances.length > 0) {
          // console.log("CMS LOAD listInstances is defined");
          // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
          const [listInstance] = listInstances;

          // Ensure listInstance and listInstance are defined
          if (listInstance) {
            // console.log(listInstance);
            // Store the timeout reference
            let timeoutRefLoad = setTimeout(function () {
              listInstance.renderItems(true, true);
            }, 500);
            // The `renderitems` event runs whenever the list renders items after switching pages.
            listInstance.on("renderitems", (renderedItems) => {
              // console.log("cmsLoad rendered");
              // console.table("cmsLoad", renderedItems);
              // Clear the timeout if "renderitems" event fires before the timeout interval
              clearTimeout(timeoutRefLoad);
              // Run every time an image loads
              macyInstance.runOnImageLoad(function () {
                // console.log("macy item loaded");
                macyInstance.recalculate(true);
                refreshDynamicAnimationsDebounced();
              }, true);
              // Run only when all images are loaded
              // macyInstance.runOnImageLoad(function () {
              //   // console.log("all macy items are now loaded");
              // }, false);
              setTimeout(function () {
                macyInstance.recalculate(true);
              }, 1000);
            });
            $(".w-pagination-next").on("click", function (e) {
              e.preventDefault();
              e.stopPropagation();
              listInstance.renderItems(true, true);
              macyInstance.recalculate(true);
              setTimeout(function () {
                reinitWebflowInteractions();
                // console.log("webflow reset from pagination button");
                teamGrid();
                macyInstance.recalculate(true);
              }, 500);
            });
          } else {
            console.error("CMS LOAD listInstance is UNDEFINED");
          }
        } else {
          console.error("CMS LOAD listInstances is UNDEFINED or empty");
        }
      },
    ]);
  }
}; // end finsweet stuff init
const finsweetInitDebounced = debounce(finsweetInit, 500);
// end finsweet init functions

// Team Grid Functions
const teamGrid = () => {
  $(".reveal-content-container").each(function () {
    var contentContainer = $(this);
    var contentContainerDirectChild = $(contentContainer).find(".container");
    let popupLenis = new Lenis({
      wrapper: contentContainer[0],
      content: contentContainerDirectChild[0],
    });

    // Start Lenis animation
    let popupRaf = (time) => {
      popupLenis.raf(time);
      requestAnimationFrame(popupRaf);
    };
    requestAnimationFrame(popupRaf);

    $("body").on("wheel", $(this), function (e) {
      // console.log("Mousewheel event fired: ", e);

      // Determine the scroll direction and amount
      let delta = e.originalEvent.deltaY;

      // Smoothly scroll the element using Lenis
      popupLenis.scrollTo(contentContainer.scrollTop() + delta * 1.5, {
        immediate: false, // Keep smooth scrolling
      });
    });
  });

  $(".employee-image-container").on("click", function () {
    var revealContentContainer = $(this).siblings(
      ".reveal-content-container"
    )[0];
    var revealContentContainerDirectChild = $(revealContentContainer).find(
      ".container"
    )[0];
    var revealTl = gsap.timeline();
    var revealButton = $(this).find(".reveal-button-container");
    if (!$(this).hasClass("activated")) {
      $(this).addClass("activated");
      setTimeout(function () {
        // disableScrolling();
        lenis.stop();
      }, 1000);
    }
    revealTl.fromTo(
      revealButton,
      {
        rotationZ: 0,
      },
      {
        rotationZ: 45,
        duration: 1.25,
      }
    );
  });
  $(".employee-card .reveal-content---close-button").on("click", function () {
    var revealContentContainer = $(this).siblings(
      ".reveal-content-container"
    )[0];
    var revealContentContainerDirectChild = $(revealContentContainer).find(
      ".container"
    )[0];
    var hideRevealTl = gsap.timeline();
    var imageContainer = $(this)
      .parents(".reveal-content-container")
      .siblings(".employee-image-container");
    var overlay = $(this)
      .parents(".reveal-content-container")
      .siblings(".reveal-overlay");
    var openButton = $(this)
      .parents(".reveal-content-container")
      .siblings(".employee-image-container")
      .find(".reveal-button-container");
    var contentContainer = $(this).parents(".reveal-content-container");
    hideRevealTl.to(
      contentContainer,
      {
        opacity: 0,
        duration: 0.35,
      },
      0
    );
    hideRevealTl.to(
      contentContainer,
      {
        display: "none",
      },
      0.35
    );
    hideRevealTl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.75,
        ease: "in-out-quart",
      },
      0.35
    );
    hideRevealTl.to(
      overlay,
      {
        display: "none",
      },
      1.25
    );
    hideRevealTl.fromTo(
      openButton,
      {
        rotationZ: 45,
      },
      {
        rotationZ: 0,
        duration: 0.9,
      },
      0.5
    );
    if ($(imageContainer).hasClass("activated")) {
      setTimeout(function () {
        $(imageContainer).removeClass("activated");
        // enableScrolling();
        lenis.start();
      }, 350);
    }
  });
}; // end team grid

function imageSrcSetFix() {
  // Handle improperly loaded srcset size for responsive images
  var images = document.getElementsByTagName("img");

  function updateImageSizes() {
    for (var i = 0; i < images.length; i++) {
      var image = images[i];

      // Check if the image has already been sized
      if (!image.dataset.sized) {
        if (image.complete) {
          setImageSizes(image);
        } else {
          // Add a one-time load event listener
          image.addEventListener(
            "load",
            function () {
              setImageSizes(this);
            },
            { once: true }
          );
        }
      }
    }
  }

  function setImageSizes(image) {
    var imageRect = image.getBoundingClientRect();
    var imageWidth = imageRect.width;
    var imageHeight = imageRect.height;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    // Calculate width percentage
    var widthPercentage = (imageWidth / viewportWidth) * 100;

    // Calculate height percentage
    var heightPercentage = (imageHeight / viewportHeight) * 100;

    // Combine width and height considerations
    var combinedSizeValue =
      Math.round(widthPercentage * 0.7 + heightPercentage * 0.3) + "vw";

    // Optional: Add a minimum and maximum size constraint
    var minSize = 10; // Minimum 10vw
    var maxSize = 90; // Maximum 90vw
    var finalSizeValue =
      Math.min(Math.max(parseFloat(combinedSizeValue), minSize), maxSize) +
      "vw";

    // Set sizes attribute
    image.setAttribute("sizes", finalSizeValue);

    // Mark as sized to avoid redundant processing
    image.dataset.sized = "true";

    // Optional: Log for debugging
    // console.log(`Image size set to: ${finalSizeValue}`);
  }

  // Debounce function to limit function calls during resize
  function debounce(func, delay) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  }

  // Update image sizes on initial load
  updateImageSizes();

  // Update image sizes on window resize with debounce
  window.addEventListener("resize", debounce(updateImageSizes, 200));
}

// Init Function
const init = () => {
  console.log("%crun init", "color: lightgreen;");
  enableLenis();
  // Global Variables and Functions
  // window.fsAttributes = window.fsAttributes || [];
  window.Webflow = window.Webflow || [];
  Webflow.push(function () {
    const radioButton = document.querySelector(
      ".team-filter---radio-field .w-radio-input"
    );
    const radioInput = document.querySelector(
      ".team-filter---radio-field[radio-type='all'] input[type='radio']"
    );
    // const checkboxes = document.querySelectorAll(
    //   ".team-filter---checkbox-field input[type='checkbox']"
    // );
    const radios = document.querySelectorAll(
      ".team-filter---radio-field:not([radio-type='all']) input[type='radio']"
    );

    // checkboxes.forEach((checkbox) => {
    //   checkbox.addEventListener("change", function () {
    //     if (this.checked) {
    //       radioButton.classList.remove("w--redirected-checked");
    //       radioInput.checked = false;
    //     } else {
    //       // Check if any checkboxes are checked
    //       const anyChecked = Array.from(checkboxes).some(
    //         (checkbox) => checkbox.checked
    //       );
    //       if (!anyChecked) {
    //         radioButton.classList.add("w--redirected-checked");
    //         radioInput.checked = true;
    //       }
    //     }
    //   });
    // });

    radios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.checked) {
          radioButton.classList.remove("w--redirected-checked");
          radioInput.checked = false;
        } else {
          // Check if any radios are checked
          const anyChecked = Array.from(radios).some((radio) => radio.checked);
          if (!anyChecked) {
            radioButton.classList.add("w--redirected-checked");
            radioInput.checked = true;
          }
        }
      });
    });

    // Handle improperly loaded srcset size for responsive images
    /*
    var images = document.getElementsByTagName("img");

    function updateImageSizes() {
      for (var i = 0; i < images.length; i++) {
        var image = images[i];

        // Check if the image is loaded
        if (image.complete) {
          setImageSizes(image);
        } else {
          // If the image is not loaded yet, add a load event listener
          image.addEventListener("load", function () {
            setImageSizes(this);
          });
        }
      }
    }

    function setImageSizes(image) {
      var imageRect = image.getBoundingClientRect();
      var imageWidth = imageRect.width;
      var imageHeight = imageRect.height;
      var viewportWidth = window.innerWidth;
      var viewportHeight = window.innerHeight;

      // Calculate width percentage
      var widthPercentage = (imageWidth / viewportWidth) * 100;

      // Calculate height percentage
      var heightPercentage = (imageHeight / viewportHeight) * 100;

      // Combine width and height considerations
      // You can adjust the weight of width vs height based on your design
      var combinedSizeValue =
        Math.round(widthPercentage * 0.7 + heightPercentage * 0.3) + "vw";

      // Optional: Add a minimum and maximum size constraint
      var minSize = 10; // Minimum 10vw
      var maxSize = 90; // Maximum 90vw
      var finalSizeValue =
        Math.min(Math.max(parseFloat(combinedSizeValue), minSize), maxSize) +
        "vw";

      // Set sizes attribute
      image.setAttribute("sizes", finalSizeValue);

      // Optional: Log for debugging
      // console.log(`Image size set to: ${finalSizeValue}`);
    }

    // Update image sizes on initial load
    updateImageSizes();

    // Update image sizes on window resize
    window.addEventListener("resize", updateImageSizes);
    */
    // end srcset fix

    const copyUrlButton = document.querySelector(
      ".social-share-link#copy-link"
    );
    if (copyUrlButton) {
      copyUrlButton.addEventListener("click", function (e) {
        e.preventDefault();
        // Use the Clipboard API to copy the current page URL
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            // Optionally, provide feedback to the user
            alert("URL copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy URL: ", err);
          });
      });
    }
    const mailUrlButton = document.querySelector(
      ".social-share-link#email-link"
    );
    if (mailUrlButton) {
      mailUrlButton.addEventListener("click", function (e) {
        e.preventDefault();
        var url = window.location.href;
        var encodedUrl = encodeURIComponent(url);
        var mailtoLink = "mailto:?body=" + encodedUrl;
        window.open(mailtoLink);
      });
    }
  });
  imageSrcSetFix();
  homePageLoadHeroAnimation();
  document.documentElement.style.setProperty(
    "--scroll-y",
    `${window.scrollY}px`
  );

  if ($(".masonry-collection-list").length) {
    let macyInstance = Macy(macyConfig);
  }

  // Setup fixed page when opening nav menu
  $(".w-nav-button").on("click", function () {
    var clicks = $(this).data("clicks");
    if (clicks) {
      // Menu Closed
      // ScrollTrigger.getAll().forEach(trigger => trigger.enable());
      const scrollY = document.body.style.top;
      $("body").css({
        // overflow: "auto",
        position: "",
        top: "",
      });
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    } else {
      // Menu Opened
      // ScrollTrigger.getAll().forEach(trigger => trigger.disable(true));
      const scrollY =
        document.documentElement.style.getPropertyValue("--scroll-y");
      $("body").css({
        // overflow: "hidden",
        position: "fixed",
        top: `-${scrollY}`,
      });
    }
    $(this).data("clicks", !clicks);
  });
  window.addEventListener("scroll", () => {
    document.documentElement.style.setProperty(
      "--scroll-y",
      `${window.scrollY}px`
    );
  });

  // Animate Logo Color on Menu Open and Close
  let initialLogoColor = false;
  $(".menu-button.w-nav-button").on("click", function () {
    let heroLogo = $(this).siblings(".brand-logo");
    let announcementBanner = $('.announcement-bar');
    let isOpen = $(this).hasClass("w--open"); // Fixed the class name for checking the open state
    if (!isOpen) {
      let compStyles = getComputedStyle(heroLogo[0]);
      initialLogoColor = compStyles.getPropertyValue("color");
    }
    // hide the announcement bar when the menu is open because it pushes things down too far
    if (isOpen) {
      announcementBanner.addClass("hide-me");
    } else {
      announcementBanner.removeClass("hide-me");
    }

    const animateLogo = gsap.to(heroLogo, {
      color: isOpen && initialLogoColor ? initialLogoColor : "#000000",
      duration: 0.35,
      ease: "in-out-quart",
      onComplete: function () {
        if (isOpen) {
          $(heroLogo).css("color", "inherit");
        }
      },
    });
  });

  initializeMarquee();
  statsCircleAnimation();
  statsCircleSmallerAnimation();
  statsBoxAnimation();
  statsBarsAnimation();
  statsNumbersAnimation();
  googleMapsSetup();
  projectsMapDropdown();
  select2Init();
  imageAnimationDebounced();
  fadeInElementsAnimationDebounced();

  if (
    $("[fs-cmscombine-element]").length ||
    $(".resource-center").length ||
    $('[class*="featured-resources-wrapper"]').length ||
    $(".team-filter-grid").length
  ) {
    console.log("Finsweet stuff exists");
    // imageAnimationDebounced();
    // fadeInElementsAnimationDebounced();
    finsweetInit();
  } else {
    // imageAnimationDebounced();
    // fadeInElementsAnimationDebounced();
  }

  teamGrid();

  gsap.utils.toArray(".nav-link.open-menu.primary").forEach((navLink) => {
    var heading = $(navLink).find(".heading");
    var arrow = $(navLink).find(".button-arrow");
    // console.log(heading, arrow);
    let navLinkArrowTL = gsap.timeline({
      paused: true,
    });
    navLinkArrowTL.to(
      heading[0],
      {
        x: "3.5rem",
        duration: 0.5,
        ease: "in-out-quart",
      },
      0
    );
    navLinkArrowTL.to(
      arrow[0],
      {
        opacity: 1,
        duration: 0.5,
        ease: "in-out-quart",
      },
      0.15
    );
    navLink.addEventListener("mouseenter", () => navLinkArrowTL.play());
    navLink.addEventListener("mouseleave", () => navLinkArrowTL.reverse());
  });

  // Jump to top
  $(".back-to-top-button").on("click", function (e) {
    e.preventDefault();
    lenis.scrollTo("top", {
      duration: 3.5,
      // easing: (t) => 1 - Math.pow(1 - t, 4)
      easing: (x) => {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      },
    });
    return false;
  });

  // Stop barba.js transition on load more button click
  $(".w-pagination-next").on("click", function (e) {
    // console.log("next button clicked");
    e.preventDefault();
    e.stopPropagation();
  });

  // $(".reveal-overlay").click(function (e) {
  //   e.stopPropagation();
  // });
}; // end init

$(window).on("load", init);

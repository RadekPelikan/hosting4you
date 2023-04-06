const GLOBAL = {
  elements: {
    reviewsWrapper: document.querySelector(".js-reviews-wrapper"),
    reviewTemplate: document.querySelector(".js-review-template").content,
    reviewsNavWrapper: document.querySelector(".js-reviews-nav-wrapper"),
    navDotTemplate: document.querySelector(".js-reviews-nav-wrapper template")
      .content,
    firstReview: null,
  },
  data: {
    counter: 0,
    reviews: [],
  },
};

const getData = (datasetString) => datasetString?.slice(5);

const loadReviews = async () => {
  const response = await fetch("/assets/json/reviews.json");
  const data = await response.json();
  GLOBAL.data.reviews = data;
  return 1;
};

const moveAllRight = (reviewP) => {
  let review = reviewP;
  if (!review) {
    const { firstReview } = GLOBAL.elements;
    review = firstReview;
  }

  if (review.dataset.index == GLOBAL.data.reviews.length - 1) {
    return 1;
  }

  moveRight(review);
  return moveAllRight(review.next);
};

const implementRecursively = (cb, review, iterations, counter = 0) => {
  cb(review);
  if (counter === iterations || review.next.dataset.index == 0) {
    return review;
  }

  return implementRecursively(cb, review.next, iterations, counter + 1);
};

const moveLeft = (review) => {
  if (!Array.isArray(review)) {
    review.style.left = "-100vw";
  } else {
    const reviews = review;
    reviews.forEach((review) => moveLeft(review));
  }
};

const moveCenter = (review) => {
  if (!Array.isArray(review)) {
    review.style.left = "0px";
  } else {
    const reviews = review;
    reviews.forEach((review) => moveCenter(review));
  }
};

const moveRight = (review) => {
  if (!Array.isArray(review)) {
    review.style.left = "100vw";
  } else {
    const reviews = review;
    reviews.forEach((review) => moveRight(review));
  }
};

const animateEnter = async (review, fromRight = true) => {
  await review.animate(
    [{ left: fromRight ? "100vw" : "-100vw" }, { left: "0px" }],
    {
      duration: 500,
    }
  );
  review.style.left = "0px";
};

const animateLeave = async (review, toLeft = true) => {
  await review.animate(
    [{ left: "0px" }, { left: toLeft ? "-100vw" : "100vw" }],
    {
      duration: 500,
    }
  );
  review.style.left = toLeft ? "-100vw" : "100vw";
};

const animateLeft = async (review) => {
  await review.animate(
    [{ left: `calc(review.style.left + 100vw)` }, { left: review.style.left }],
    {
      duration: 500,
    }
  );
};

const animateRight = async (review) => {
  await review.animate(
    [{ left: `calc(review.style.left - 100vw)` }, { left: review.style.left }],
    {
      duration: 500,
    }
  );
};

const generateReviews = () => {
  const { reviewTemplate, reviewsWrapper } = GLOBAL.elements;
  const { reviews } = GLOBAL.data;

  let prev;
  reviews.forEach((review, index) => {
    const element = reviewTemplate.cloneNode(true).querySelector(".js-review");
    element.dataset.index = index;

    if (index === 0) {
      GLOBAL.elements.firstReview = element;
    } else if (index === reviews.length - 1) {
      element.next = GLOBAL.elements.firstReview;
      GLOBAL.elements.firstReview.prev = element;
      prev.next = element;
    } else {
      prev.next = element;
    }

    Object.keys(review).forEach((reviewKey) => {
      const dataElement = element.querySelector(
        `[data-key="review-${reviewKey}"]`
      );
      const type = getData(dataElement.dataset.type);
      switch (type) {
        case "url":
          dataElement.src = review[reviewKey];
          break;
        default:
          dataElement.innerText = review[reviewKey];
      }
    });
    if (index > 0) {
      element.style.left = "100vw";
    }

    element.addEventListener("click", () => {
      animateLeave(element);
      animateEnter(element.next);

      if (index === reviews.length - 2) {
        moveAllRight();
      }

      if (index === reviews.length - 1) {
        moveRight(element);
      }

      document.querySelectorAll(`.js-reviews-nav-item div`).forEach((dot) => {
        dot.classList.remove("bg-primary");
        dot.classList.add("bg-slate-300");
      });
      const newDot = document.querySelector(
        `.js-reviews-nav-item[data-index="${
          (index + 1) % GLOBAL.data.reviews.length
        }"] div`
      );

      newDot.classList.remove("bg-slate-300");
      newDot.classList.add("bg-primary");

      GLOBAL.data.counter = index;
    });
    reviewsWrapper.appendChild(element);

    prev = element;
  });

  return 1;
};

const generateReviewsNav = () => {
  const { reviewsNavWrapper, navDotTemplate, firstReview } = GLOBAL.elements;
  const { reviews } = GLOBAL.data;

  reviews.forEach((review, index) => {
    const element = navDotTemplate
      .cloneNode(true)
      .querySelector(".js-reviews-nav-item");
    const dot = element.querySelector("div");
    element.dataset.index = index;

    if (index === GLOBAL.data.counter) {
      dot.classList.remove("bg-slate-300");
      dot.classList.add("bg-primary");
    }

    element.addEventListener("click", () => {
      const review = implementRecursively(
        (review, animate) => (animate ? animateLeft : moveLeft(review)),
        firstReview,
        index
      );
      implementRecursively(
        (review, animate) =>
          animate ? animateRight(review) : moveRight(review),
        review
      );
      moveCenter(review);

      document.querySelectorAll(`.js-reviews-nav-item div`).forEach((dot) => {
        dot.classList.remove("bg-primary");
        dot.classList.add("bg-slate-300");
      });

      dot.classList.remove("bg-slate-300");
      dot.classList.add("bg-primary");

      GLOBAL.data.counter = index;
    });

    reviewsNavWrapper.appendChild(element);
  });

  return 1;
};

export const setupSlider = async () => {
  await loadReviews();
  generateReviews();
  generateReviewsNav();
};

'use strict';
const navbar = document.querySelector('#navbar');
const home = document.querySelector('#home');
const homeHeight = home.getBoundingClientRect().height;
const menuItem = document.querySelector('.menu__item');
const sweetMessageList_message = document.querySelector(
  '.sweetMessageList__message'
);
const modal = document.querySelector('#modal');
const modal_overlay = document.querySelector('.modal__overlay');
let startPageX = 0;
let tempPageX = 0;
let lastPageX = 0;

// 스크롤 시 navbar 변경
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 5) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
    navbar.classList.remove('navbar--sleep');
  }

  if (window.scrollY > homeHeight / 4) {
    navbar.classList.add('navbar--awake');
  } else {
    navbar.classList.remove('navbar--awake');

    if (navbar.classList.contains('scrolled')) {
      navbar.classList.add('navbar--sleep');
    }
  }
});

// Gallery 모달 이미지 외부 영역 클릭 시 닫기
modal_overlay.addEventListener('click', () => {
  modal.style.display = 'none';
});

// navbar 카테고리 선택
document.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;

  if (link == null) {
    return;
  }

  scrollIntoView(link);
});

// Sweeet Message List 가로 스크롤
sweetMessageList_message.onselectstart = new Function('return false');
sweetMessageList_message.addEventListener('mousedown', (event) => {
  startPageX = event.pageX;
  //   console.log(`mousedown : ${startPageX}`);

  event.target.closest('.sweetMessageList__message').classList.add('mousedown');
});
sweetMessageList_message.addEventListener('mouseover', (event) => {
  if (
    event.target
      .closest('.sweetMessageList__message')
      .classList.contains('mousedown')
  ) {
    if (startPageX > event.pageX) {
      tempPageX = Math.abs(startPageX - event.pageX) + lastPageX;
    } else {
      tempPageX = lastPageX - Math.abs(startPageX - event.pageX);
    }

    // console.log(
    //   `${startPageX} / ${event.pageX} / ${lastPageX} // ${tempPageX}`
    // );

    sweetMessageList_message.scrollTo({
      top: 0,
      left: tempPageX,
      behavior: 'smooth',
    });
  }
});
sweetMessageList_message.addEventListener('mouseup', (event) => {
  if (
    event.target
      .closest('.sweetMessageList__message')
      .classList.contains('mousedown')
  ) {
    lastPageX = tempPageX < 0 ? 0 : tempPageX;

    event.target
      .closest('.sweetMessageList__message')
      .classList.remove('mousedown');
  }
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
}

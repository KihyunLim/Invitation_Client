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
const openSideMenu = document.querySelector('.side__toggle-btn');
const categoryList = document.querySelector('.side__menu');
const itemImage = document.querySelectorAll('.image__item');
const modalGalleryImage = document.querySelector('#modal .gallery__image img');
const galleryArrow = document.querySelectorAll('#modal .gallery__arrow');

let currItemImage = null;
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

  categoryList.classList.remove('open');
  scrollIntoView(link);
});

// 사이드 메뉴 버튼 선택
openSideMenu.addEventListener('click', (event) => {
  categoryList.classList.toggle('open');
});

itemImage.forEach((item) => {
  item.addEventListener('click', (event) => {
    let target = event.target.closest('.image__item');

    modal.style.display = 'block';
    modalGalleryImage.src = target.children[0].src;

    currItemImage = target;
  });
});

// Gallery 이미지 선택 후 사진 넘기기 아이콘 선택
galleryArrow.forEach((item) => {
  item.addEventListener('click', (event) => {
    let target = event.target.closest('.gallery__arrow');

    if (target.classList.contains('prev')) {
      if (currItemImage.previousElementSibling != null) {
        modalGalleryImage.src = currItemImage.previousElementSibling.querySelector(
          'img'
        ).src;

        currItemImage = currItemImage.previousElementSibling;
      }
    } else if (target.classList.contains('next')) {
      if (currItemImage.nextElementSibling != null) {
        modalGalleryImage.src = currItemImage.nextElementSibling.querySelector(
          'img'
        ).src;

        currItemImage = currItemImage.nextElementSibling;
      }
    }
  });
});

// 모달에 사진 로드 될때 잡아서 전 후 체크해서 하이드 처리
const modalImg = document.querySelector('#modal img');
modalImg.addEventListener('load', () => {
  if (currItemImage != null) {
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');

    prev.style.visibility =
      currItemImage.previousElementSibling == null ? 'hidden' : 'visible';

    next.style.visibility =
      currItemImage.nextElementSibling == null ? 'hidden' : 'visible';
  }
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

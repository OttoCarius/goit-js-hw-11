//Импорт библиотеки SimpleLightBox + пользовательская функция
import 'simplelightbox/dist/simple-lightbox.min.css';
import lightboxRefresh from './js/lightbox';

//Import Debounce library
const debounce = require('lodash.debounce');

//Import custom service Pixabay
import PixabayApiService from './js/pixabayApiService';

//Import markup functional
import { appendImagesContainerEl, clearImagesContainerEl } from './js/markup';

//Import refs DOM
import refs from './js/refs';

//Import пользовательское уведомление
import {
  letMsgEnterYouQuery,
  letMsgNoImagesByQuery,
  letMsgAllImagesLoaded,
  letMsgTotalFindImages,
} from './js/message';

//Destructuring object
const { formEl, imagesContainerEl } = refs();

//Создать экземпляр класса
const pixabayApiService = new PixabayApiService();

//   TO DO   Functional с добавлением и удалением прослушивателя
const debounseScroll = debounce(infinityScroll, 100);

function addListener() {
  window.addEventListener('scroll', debounseScroll);
}

function removeListener() {
  window.removeEventListener('scroll', debounseScroll);
}

formEl.addEventListener('submit', onFormSubmit);

// Обратный вызов TODO из события отправки
async function onFormSubmit(e) {
  e.preventDefault();
  pixabayApiService.resetSetting();
  window.scrollTo(0, 0);
  clearImagesContainerEl(imagesContainerEl);
  pixabayApiService.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();
  pixabayApiService.loading = false;

  try {
    await pixabayApiService.fetchImage();
    const { searchQuery, totalHits, hits } = pixabayApiService;
    if (!searchQuery) {
      return letMsgEnterYouQuery();
    }
    if (!totalHits) {
      return letMsgNoImagesByQuery();
    }
    letMsgTotalFindImages(totalHits);
    appendImagesContainerEl(hits, imagesContainerEl);
    lightboxRefresh();
    addListener();
  } catch (error) {
    console.log(error.message);
  }
}

//Обратный вызов TODO из события прокрутки
async function infinityScroll(e) {
  console.log('listener');
  const documentRect = document.documentElement.getBoundingClientRect();
  try {
    if (documentRect.bottom < document.documentElement.clientHeight + 300) {
      if (!(pixabayApiService.hits.length < pixabayApiService.per_page)) {
        pixabayApiService.incrementPage();
        await pixabayApiService.fetchImage();
        appendImagesContainerEl(pixabayApiService.hits, imagesContainerEl);
        lightboxRefresh();
      } else {
        if (!pixabayApiService.loading) {
          removeListener();
          pixabayApiService.loading = true;
          letMsgAllImagesLoaded();
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

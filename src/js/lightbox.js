import SimpleLightbox from 'simplelightbox';

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  showCounter: false,
  captionsData: 'alt',
});

export default function lightboxRefresh() {
  lightbox.refresh();
}

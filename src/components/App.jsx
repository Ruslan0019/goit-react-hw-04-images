import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import fetchData from './api/api';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  useEffect(() => {
    if (query !== '') {
      setLoading(true);
      fetchData(query, page)
        .then(data => {
          setImages(prevImages => [...prevImages, ...data]);
        })
        .catch(error => {
          console.error('Error while receiving data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query, page]);

  const handleSubmit = newQuery => {
    const trimmedQuery = newQuery.trim();
    if (trimmedQuery !== '') {
      setQuery(trimmedQuery);
      setImages([]);
      setPage(1);
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const openModal = imageUrl => {
    setModalImageUrl(imageUrl);
  };

  const closeModal = () => {
    setModalImageUrl(null);
  };

  const allImagesLoaded = images.length === 0 && !loading;
  const noMoreImagesToLoad =
    allImagesLoaded ||
    (page > 1 && images.length % 12 !== 0) ||
    images.length < 12;

  return (
    <div>
      <SearchBar onSubmit={handleSubmit} />
      <ImageGallery images={images} onImageClick={openModal} />
      {loading && <Loader />}
      {!noMoreImagesToLoad && images.length >= 12 && (
        <Button onClick={loadMore} />
      )}
      {modalImageUrl && <Modal imageUrl={modalImageUrl} onClose={closeModal} />}
    </div>
  );
};

export default App;

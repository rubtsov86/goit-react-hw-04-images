import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import axios from 'axios';
import '../styles.css';
import Loader from './Loader';
import Modal from './Modal';

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showModal, setShowModal] = useState('');

  useEffect(() => {
    if (!inputValue) {
      return;
    }
    setLoading(true);

    const fetchImages = () => {
      if (inputValue === '') {
        return alert('nothing to show, fill input');
      }
      axios.defaults.baseURL = `https://pixabay.com/api/?q=${inputValue}&page=${page}&per_page=12&key=26229759-3aa7093be117df00e52b30f1f&image_type=photo&orientation=horizontal`;
      const response = axios.get('/search?query=react');

      return response;
    };

    const response = fetchImages();

    const updateImages = async promise => {
      const response = await promise;
      if (!response) {
        return;
      }
      if (response.data.hits.length === 0) {
        alert('no images found, try something else');
        setInputValue('');
        setLoading(false);
        return;
      }

      const newArrayOfImages = response.data.hits.map(
        ({ id, webformatURL, largeImageURL }) => {
          return { id, webformatURL, largeImageURL };
        }
      );

      const totalImages = images.length + newArrayOfImages.length;
      setImages(prevState => [...prevState, ...newArrayOfImages]);
      setLoading(false);

      if (!showLoadMore && totalImages !== response.data.totalHits) {
        setShowLoadMore(true);
      }

      if (totalImages === response.data.totalHits) {
        setShowLoadMore(false);
      }
    };

    updateImages(response);
  }, [inputValue, page, images, showLoadMore]);

  const onSubmit = inputValueData => {
    if (inputValueData === '') {
      alert('nothing to show, fill input');
    }
    if (showLoadMore) {
      setShowLoadMore(false);
    }
    formReset(inputValueData);
  };

  const formReset = value => {
    setImages([]);
    setPage(1);
    setInputValue(value);
  };

  const onClickImage = e => {
    setShowModal(
      images.find(image => image.webformatURL === e.target.src).largeImageURL
    );
  };

  const onClickModal = e => {
    setShowModal('');
  };

  const onClickLoadMore = e => {
    setPage(prevState => prevState + 1);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={onSubmit} />

      <ImageGallery images={images} onClick={onClickImage} />
      {loading && <Loader />}
      {showLoadMore && <Button onClick={onClickLoadMore} />}
      {showModal && <Modal image={showModal} onClick={onClickModal} />}
    </div>
  );
}

export { App };

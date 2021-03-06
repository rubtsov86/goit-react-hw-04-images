import React, { useEffect, useState } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import axios from 'axios';
import '../styles.css';
import Loader from './Loader';
import Modal from './Modal';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [showModal, setShowModal] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    if (!inputValue) {
      return;
    }
    setLoading(true);
    const fetchImages = () => {
      if (inputValue === '') {
        return;
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
        toast.error('no images found, try something else', {
          duration: 1500,
          position: 'top-right',
        });
        setInputValue('');
        setLoading(false);
        return;
      }

      const newArrayOfImages = response.data.hits.map(
        ({ id, webformatURL, largeImageURL }) => {
          return { id, webformatURL, largeImageURL };
        }
      );

      setImages(prevState => [...prevState, ...newArrayOfImages]);
      setLoading(false);
      setShowLoadMore(true);
      setTotalHits(response.data.totalHits);
    };

    updateImages(response);
  }, [page, inputValue]);

  const onSubmit = inputValueData => {
    if (inputValueData === '') {
      toast.error('nothing to show, fill input', {
        duration: 1500,
        position: 'top-right',
      });
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
      {showLoadMore && images.length !== totalHits && (
        <Button onClick={onClickLoadMore} />
      )}
      {showModal && <Modal image={showModal} onClick={onClickModal} />}
      <Toaster />
    </div>
  );
}

export { App };

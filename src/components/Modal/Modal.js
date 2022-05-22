import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import s from './Modal.module.css';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

function Modal({ image, onClick }) {
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return function clean() {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  const handleKeydown = e => {
    console.log(e.code);
    if (e.code === 'Escape') {
      onClick();
    }
  };

  const handleOverlay = e => {
    if (e.currentTarget === e.target) {
      onClick();
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={handleOverlay}>
      <div className={s.Modal}>
        <img src={image} alt="" />
      </div>
    </div>,
    modalRoot
  );
}

// class Modal extends React.Component {
//   componentDidMount() {
//     document.addEventListener('keydown', this.handleKeydown);
//   }

//   componentWillUnmount() {
//     document.removeEventListener('keydown', this.handleKeydown);
//   }

//   handleKeydown = e => {
//     console.log(e.code);
//     if (e.code === 'Escape') {
//       this.props.onClick();
//     }
//   };

//   handleOverlay = e => {
//     if (e.currentTarget === e.target) {
//       this.props.onClick();
//     }
//   };

//   render() {
//     return createPortal(
//       <div className={s.Overlay} onClick={this.handleOverlay}>
//         <div className={s.Modal}>
//           <img src={this.props.image} alt="" />
//         </div>
//       </div>,
//       modalRoot
//     );
//   }
// }

export default Modal;

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

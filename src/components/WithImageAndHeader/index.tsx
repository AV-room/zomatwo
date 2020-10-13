import React from 'react';
import './styles.scss';
import placeholderImage from '../../images/placeholder.jpeg';

const WithImageAndHeader = (Component: any) => {
  const handleImgLoadError = (event: any) => {
    event.target.src = placeholderImage;
  };

  return ({ title, byline, imageSrc, imageAlt, ...remainingProps }: any) => (
    <div className="image-header-container">
      <img
        className="image"
        src={imageSrc || placeholderImage}
        alt={imageAlt}
        onError={handleImgLoadError}
      ></img>
      <div className="text-content">
        <header>
          <h2 className="title">{title}</h2>
          <p className="byline">{byline}</p>
        </header>
        <Component {...remainingProps} />
      </div>
    </div>
  );
};

export default WithImageAndHeader;

import React from 'react';
import Holder from 'holderjs';
import { Media } from 'reactstrap';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import styles from './media.module.sass';

const CustomMedia = (props) => {
  const { filename, filepath, handleFiles, disabled } = props;
  return (
    <Media className="justify-content-center">
      <Media left className="position-relative">
        <Media object tag={() => (
          <img
            data-src={filepath || 'holder.js/200x200?auto=yes'}
            src={filepath}
            alt={filename}
            className="img-thumbnail"
            ref={ref => Holder.run({ images: ref })}/>
        )}/>
        <ReactFileReader
          base64={true}
          handleFiles={handleFiles}
          disabled={disabled}
        >
          <div className={`${styles.addPicture} `}>
            <FontAwesomeIcon className="mr-2" icon={faCamera}/>
            Add picture
          </div>
        </ReactFileReader>
      </Media>
    </Media>
  );
};

export default CustomMedia;

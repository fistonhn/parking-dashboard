import React, { useState, useEffect } from 'react';
import { asField } from 'informed';
import Media from './media';
import TooltipInfo from 'components/helpers/tooltip_info';

const ImageInput = asField(({ fieldState, fieldApi, events = {}, disabled }) => {
  const { value } = fieldState;
  const { setValue } = fieldApi;

  let defaultName;

  if (value) {
    const paths = value.split(/\//);
    defaultName = paths[paths.length - 1];
  }

  useEffect(() => {
    setTimeout(() => {
      setValue('');
    }, 0);
  }, []);

  const [filename, setFilename] = useState(defaultName);
  const [filepath, setFilepath] = useState(value);

  const handleFiles = data => {
    setValue(data.base64);
    setFilepath(URL.createObjectURL(data.fileList[0]));
    setFilename(data.fileList[0].name);
    events.onChange && events.onChange();
  };

  return (
    <React.Fragment>
      <Media
        filepath={filepath}
        filename={filename}
        disabled={disabled}
        handleFiles={handleFiles}
      />

      <p className="pt-1 mt-2 text-center">
        <span className="general-text-3">
          Format for image:  Jpeg, Png
        </span>
        <TooltipInfo className="ml-2" text="This is the profile picture" target="picture" />
      </p>
    </React.Fragment>
  );
});

export default ImageInput;

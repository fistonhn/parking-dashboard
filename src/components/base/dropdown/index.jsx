import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'components/base/check_box';
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import { ReactComponent as ChevronDown } from 'assets/chevron_down.svg';
import { ReactComponent as ChevronUp } from 'assets/chevron_up.svg';
import TooltipInfo from 'components/helpers/tooltip_info';
import styles from './dropdown.module.sass';

const useComponentVisible = (initialIsVisible) => {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = React.useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
};

const CustomDropdown = ({
  value,
  onChange,
  options,
  customOptions,
  multiple = false,
  width = '100%',
  size = 'md',
  className,
  selectedOptionClassName,
  error,
  disabled = false,
  coveringText
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const handleToggle = () => setDropdownOpen((prevState) => !prevState);

  const handleToggleWithMultiple = () =>
    setIsComponentVisible((prevState) => !prevState);

  const handleItemClick = (option) => {
    const selectAllChecked = option.value === 0;

    if (multiple) {
      let newValue;
      if (value.some((e) => e.value === option.value)) {
        newValue = value.filter((e) => e.value !== option.value);
      } else {
        newValue = [...value, option];
      }
      onChange(newValue, selectAllChecked);
      return;
    }
    if (option.value === value.value) {
      return;
    }
    onChange(option, selectAllChecked);
  };

  const dropdownModifiers = {
    setMaxHeight: {
      enabled: true,
      fn: (data) => ({
        ...data,
        styles: {
          ...data.styles,
          overflow: 'auto',
          maxHeight: size === 'sm' ? '216px' : '222px',
          minWidth: width,
          maxWidth: width,
          transform: `${data.styles.transform} translateX(0)`
        }
      })
    }
  };
  const tooltipModifiers = {
    setMaxHeight: {
      enabled: true,
      fn: (data) => ({
        ...data,
        styles: {
          ...data.styles,
          overflow: 'auto',
          maxHeight: size === 'sm' ? '216px' : '222px',
          transform: `${data.styles.transform} translateX(0)`
        }
      })
    }
  };

  const tooltipText = () => {
    if (!value || !value.length) return 'No selected option';
    return value.map((e, i) => {
      return (
        <div key={i} className={styles.tooltipInfo}>
          {' '}
          {e.label}{' '}
        </div>
      );
    });
  };

  if (!value) return null;
  return (
    <div>
      <Dropdown
        className={`${styles.dropdown} ${styles[`dropdown-${size}`]} ${
          className || ''
        }`}
        isOpen={multiple ? isComponentVisible : dropdownOpen}
        toggle={multiple ? handleToggleWithMultiple : handleToggle}
        disabled={disabled}
      >
        <DropdownToggle
          className={`${dropdownOpen ? styles.noneBorderBottom : ''} ${
            error ? styles.error : ''
          }
          d-flex justify-content-between align-items-center`}
          style={{ width }}
        >
          <span className="general-text-2">
            {coveringText
              ? coveringText(value)
              : multiple
                ? ''
                : value.label || ''}
          </span>
          {multiple && (
            <TooltipInfo
              white
              className="ml-2"
              tooltipModifiers={tooltipModifiers}
              styles={{ backgroundColor: '#ffffff', color: '#242E42' }}
              text={tooltipText()}
              target="dropdown"
            />
          )}
          {dropdownOpen || isComponentVisible ? (
            <ChevronUp width="12" height="12" />
          ) : (
            <ChevronDown width="12" height="12" />
          )}
        </DropdownToggle>
        <DropdownMenu right className="mt-0 py-0" modifiers={dropdownModifiers}>
          {options.map((option, i) => {
            const isSelected = multiple
              ? value.some((e) => e.value === option.value)
              : value.value === option.value;
            return (
              <DropdownItem
                toggle={!multiple}
                key={i}
                onClick={() => handleItemClick(option)}
                className={`${
                  isSelected ? selectedOptionClassName : ''
                } d-flex`}
              >
                {multiple && (
                  <CheckBox
                    className={styles.checkBox}
                    value={isSelected}
                    onChange={() => handleItemClick(option)}
                  />
                )}
                <span className="general-text-2 d-flex align-items-center">
                  {option.label}
                </span>
              </DropdownItem>
            );
          })}
          {customOptions &&
            customOptions.map(({ label, onClick, className }, i) => (
              <DropdownItem
                key={i}
                onClick={onClick}
                className={className || ''}
              >
                <span className="general-text-2 d-flex align-items-center">
                  {label}
                </span>
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

CustomDropdown.propTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string
    })
  ).isRequired,
  customOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string
    })
  ),
  multiple: PropTypes.bool,
  width: PropTypes.string, // width can be 100% or number px
  size: PropTypes.string, // we have 2 size sm and md
  className: PropTypes.string,
  selectedOptionClassName: PropTypes.string,
  error: PropTypes.array,
  disabled: PropTypes.bool,
  coveringText: PropTypes.func
};

export default CustomDropdown;

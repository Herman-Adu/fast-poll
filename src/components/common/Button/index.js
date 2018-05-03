import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'gatsby-link';

import { Button as BaseButton, baseButtonStyles } from '../styled/theme';
import Icon from '../icons/index';

const Container = styled.button`
  ${baseButtonStyles};
  padding: 0;
  position: relative;

  &:hover,
  &:focus {
    > .js-gradient {
      opacity: 1;
    }
  }

  > a {
    text-decoration: none;
  }
`;

const ButtonDiv = BaseButton.withComponent('div')

const Gradient = styled.div`
  opacity: 0;
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background-image: ${({ theme, type }) => theme.gradients[type]};
  filter: blur(6px) hue-rotate(20deg);
  padding: 4px;
  z-index: 1;
  border-radius: 20px;
  transition: opacity 200ms linear;
`;

const IconContainer = styled.i`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: ${({ size }) => typeof size === 'number' ? `${size}px` : size};
  width: ${({ size }) => typeof size === 'number' ? `${size}px` : size};
`;

const Button = ({ type, children, to, icon, iconSize, ...props }) => {
  return (
    <Container {...props}>
      {to ? (
        <Link to={to}>
          <ButtonDiv type={type} icon={!!icon} iconSize={iconSize}>
            {children}
            {icon && (
              <IconContainer  size={iconSize}>
                <Icon icon={icon} size={iconSize} />
              </IconContainer>
            )}
          </ButtonDiv>
        </Link>
      ) : (
        <ButtonDiv type={type} icon={!!icon} iconSize={iconSize}>
          {children}
          {icon && (
            <IconContainer  size={iconSize}>
              <Icon icon={icon} size={iconSize} />
            </IconContainer>
          )}
        </ButtonDiv>
      )}
      <Gradient type={type} className="js-gradient" />
    </Container>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.string,
  to: PropTypes.string,
  icon: PropTypes.string,
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Button;

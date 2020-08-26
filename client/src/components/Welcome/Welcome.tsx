import React from 'react';
import styled from 'styled-components';
import { RoomInput } from './RoomInput';
import vinyl from './vinyl.svg';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div`
  height: 100vh;
  overflow-y: hidden;
  display: grid;
  grid-template-rows: 400px 1fr;
  align-content: space-between;
  background: #9dff98ad;
  position: relative;
`;

const Content = styled.div`
  display: grid;
  align-self: flex-end;
  font-size: 1.1rem;
  text-align: center;
  padding: 0 5px;
`;

const Wave = styled.div`
  width: 100%;
  vertical-align: middle;
  transform: scaleY(-1);
  overflow: hidden;
  z-index: 1;
`;

const Vinyl = styled.img`
  justify-self: center;
  width: 100px;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  padding: 5px;
  font-family: 13px;

  a {
    color: #751d3e;
    margin-right: 5px;
  }
`;

export const Welcome = ({ history }) => {
  const onJoinRoomClick = (roomName: string) => {
    if (roomName) {
      history.push(`/${roomName}`);
    }
  };

  return (
    <Container>
      <Content className="serif">
        <Vinyl src={vinyl} alt="logo-vinyl" title="Room is live" />
        <h2>Greetings !</h2>
        <p>
          Room is live let you and your friends enjoy videos and share music{' '}
          <strong>simultaneously</strong>.
        </p>
        <p>Simple, Free, No ads.</p>
        <RoomInput onJoinRoomClick={onJoinRoomClick} />
      </Content>
      <Wave>
        <svg viewBox="0 60 500 500" preserveAspectRatio="xMinYMin meet">
          <path
            d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"
            style={{ stroke: 'none', fill: '#D95284' }}
          ></path>
        </svg>
      </Wave>
      <Footer>
        <a
          href="https://en.wikipedia.org/wiki/Software_release_life_cycle#Alpha"
          target="_blank"
          rel="noopener noreferrer"
        >
          alpha
        </a>
        <a href="https://github.com/Leyka/roomis.live">
          <FontAwesomeIcon icon={faGithub} title="Github" />
        </a>
      </Footer>
    </Container>
  );
};

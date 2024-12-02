import styled from 'styled-components';

export const Indent = styled.div<{ $s: number; $m: number; $l: number }>`
  height: ${(props) => props.$s}px;

  @media (min-width: 768px) {
    height: ${(props) => props.$m}px;
  }

  @media (min-width: 1024px) {
    height: ${(props) => props.$l}px;
  }
`;

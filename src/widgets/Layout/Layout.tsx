import { Footer } from '@/widgets/Layout/Footer';
import { Header } from '@/widgets/Layout/Header';
import { ReactNode } from 'react';
import { Indent } from '@/shared/ui/Indent';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

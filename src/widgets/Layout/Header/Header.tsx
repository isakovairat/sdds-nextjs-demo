import { Button, ButtonGroup, Divider, IconButton, TabItem, Tabs, Toolbar } from '@salutejs/sdds-serv';
import s from './Header.module.scss';
import { Logo } from '@/shared/ui/Icon/Logo';
import React from 'react';
import clsx from 'clsx';
import { useToggle } from 'usehooks-ts';
import { Menu24 } from '@/shared/ui/Icon/icons/24/menu';
import { Close24 } from '@/shared/ui/Icon/icons/24/close';

const TABS = ['Продукты', 'Аналитика', 'Публикации', 'Практикум'];

export const Header = () => {
  const [isOpen, toggleHeader] = useToggle(false);

  return (
    <header className={s.header}>
      <Toolbar orientation="horizontal">
        <div className={s.root}>
          <Logo />
          <ButtonGroup view="clear">
            {TABS.map((el) => (
              <Button key={el} onClick={() => toggleHeader()} contentRight={<Menu24 />}>
                {el}
              </Button>
            ))}
          </ButtonGroup>
          <div>
            <IconButton view="clear" contentLeft={<Close24 />} />
            <IconButton view="clear" contentLeft={<Close24 />} />
          </div>
          <div>
            <Button contentLeft={<Close24 />} view="accent">
              Написать
            </Button>
          </div>
        </div>
      </Toolbar>
      <div className={clsx(s.dropdown, isOpen && s.dropdownOpen)}>
        <div className={s.dropdownContainer}></div>
        <Tabs view="divider" stretch>
          {TABS.map((_, i) => (
            <TabItem
              view="divider"
              key={`item:${i}`}
              size="xs"
              selected={i === i}
              tabIndex={0}
              // contentLeft={<IconClock size="xs" color="inherit" />}
              // onClick={() => setIndex(i)}
            >
              {_}
            </TabItem>
          ))}
        </Tabs>
      </div>

      {/*<div className={s.root}>*/}
      {/*  <Logo />*/}
      {/*  <div className={s.tabs}>*/}
      {/*    <Tabs size="m" view="clear">*/}
      {/*      {TABS.map((tab) => (*/}
      {/*        <TabItem key={tab}>{tab}</TabItem>*/}
      {/*      ))}*/}
      {/*    </Tabs>*/}
      {/*  </div>*/}
      {/*  <div className={s.buttons}>*/}
      {/*    <Button view="dark" size="s">*/}
      {/*      Get consultation*/}
      {/*    </Button>*/}
      {/*    <IconButton view="clear" onClick={toggleHeader}>*/}
      {/*      {isOpen ? <Close24 /> : <Menu24 />}*/}
      {/*    </IconButton>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </header>
  );
};

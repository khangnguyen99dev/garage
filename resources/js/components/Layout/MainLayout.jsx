import { Content, Footer, Header, Sidebar } from '@/components/Layout';
import React from 'react';
// import {
//   MdImportantDevices,
//   // MdCardGiftcard,
//   MdLoyalty,
// } from 'react-icons/md';
// import NotificationSystem from 'react-notification-system';
// import { NOTIFICATION_SYSTEM_STYLE } from '@/utils/constants';

function MainLayout(props) {
  // const  isSidebarOpen() {
  //   return document
  //     .querySelector('.cr-sidebar')
  //     .classList.contains('cr-sidebar--open');
  // }

  // componentWillReceiveProps({ breakpoint }) {
  //   if (breakpoint !== this.props.breakpoint) {
  //     this.checkBreakpoint(breakpoint);
  //   }
  // }

  // componentDidMount() {
  //   this.checkBreakpoint(this.props.breakpoint);

  // setTimeout(() => {
  //   if (!this.notificationSystem) {
  //     return;
  //   }

  //   this.notificationSystem.addNotification({
  //     title: <MdImportantDevices />,
  //     message: 'Welome to Reduction Admin!',
  //     level: 'info',
  //   });
  // }, 1500);

  // setTimeout(() => {
  //   if (!this.notificationSystem) {
  //     return;
  //   }

  // this.notificationSystem.addNotification({
  //   title: <MdLoyalty />,
  //   message:
  //     'Reduction is carefully designed template powered by React and Bootstrap4!',
  //   level: 'info',
  // });
  // }, 2500);
  // }

  // close sidebar when
  // const handleContentClick = event => {
  //   // close sidebar if sidebar is open and screen size is less than `md`
  //   if (
  //     MainLayout.isSidebarOpen() &&
  //     (props.breakpoint === 'xs' ||
  //       props.breakpoint === 'sm' ||
  //       props.breakpoint === 'md')
  //   ) {
  //     openSidebar('close');
  //   }
  // };

  // checkBreakpoint(breakpoint) {
  //   switch (breakpoint) {
  //     case 'xs':
  //     case 'sm':
  //     case 'md':
  //       return this.openSidebar('close');

  //     case 'lg':
  //     case 'xl':
  //     default:
  //       return this.openSidebar('open');
  //   }
  // }

  // openSidebar(openOrClose) {
  //   if (openOrClose === 'open') {
  //     return document
  //       .querySelector('.cr-sidebar')
  //       .classList.add('cr-sidebar--open');
  //   }
  //   document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  // }

  // render() {
  // onClick={handleContentClick}
  const { children } = props;
  return (
    <main className="cr-app bg-light">
      <Sidebar />
      <Content fluid >
        <Header />
        {children}
        <Footer />
      </Content>

      {/* <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        /> */}
    </main>
  );
  // }
}

export default MainLayout;

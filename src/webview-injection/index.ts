import './index.less';

const eleList = document.querySelectorAll('body *');

eleList.forEach((ele: HTMLElement) => {
  ele.setAttribute('data-bg', ele.style.background)
  ele.addEventListener('mouseenter', mouseEnterHandle)
  ele.addEventListener('mouseleave', mouseLeaveHandle)
})

function mouseEnterHandle(ev: MouseEvent) {
  ev.preventDefault();
  ev.stopPropagation();
  const target = ev.target as HTMLElement;
  target.style.background = '#ff0';
}

function mouseLeaveHandle(ev: MouseEvent) {
  ev.preventDefault();
  ev.stopPropagation();
  const target = ev.target as HTMLElement;
  const rawBg = target.getAttribute('data-bg')
  target.style.background = rawBg;
}


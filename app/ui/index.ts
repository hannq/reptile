(async function() {
  const buttonEle = document.createElement('button');
  buttonEle.innerText = '点我+1';
  buttonEle.addEventListener('click', async function() {
    console.log('aaaaaaa')
    const msg = await import('./utils/index');
    console.log('msg -->', msg);
  });
  document.body.append(buttonEle);
})()


// if (module.hot) {
//   module.hot.accept('./utils/index.ts', function() {
//     console.log('Accepting the updated printMe module!');
//   })
// }

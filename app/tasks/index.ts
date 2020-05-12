import https from 'https';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function downloadImage(dist: string, fileName: string) {
  const res = https.get('https://thispersondoesnotexist.com/image.jpg', function(res) {
    const ws = fs.createWriteStream(path.join(dist, `${fileName}.${mime.getExtension(res.headers['content-type'])}`));
    res.pipe(ws);
  });
  await new Promise((resolve) => res.on('close', () => {
    resolve();
  }))
}


// var http = require(''http')
// fs = require('fs');
// http.get(path,function(req,res){  //path为网络图片地址
//   var imgData = '';
//   req.setEncoding('binary');
//   req.on('data',function(chunk){
//     imgData += chunk
//   })
//   req.on('end',function(){
//     fs.writeFile(path,imgData,'binary',function(err){  //path为本地路径例如public/logo.png
//       if(err){console.log('保存出错！')}else{
//         console.log('保存成功!')
//       }
//     })
//   })
// })

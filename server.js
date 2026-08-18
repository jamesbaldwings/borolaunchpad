const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};

http.createServer((req,res)=>{
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'POST' && url.pathname === '/api/inquiry') {
    let body='';
    req.on('data', chunk => { body += chunk; if(body.length > 1e6) req.destroy(); });
    req.on('end',()=>{
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ok:true,message:'Thanks! Your request has been received. We’ll follow up to confirm availability and details.'}));
    });
    return;
  }
  let filePath = url.pathname === '/' ? path.join(publicDir,'index.html') : path.join(publicDir, url.pathname.replace(/^\//,''));
  if (!filePath.startsWith(publicDir)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(filePath,(err,stat)=>{
    if(err || !stat.isFile()) filePath = path.join(publicDir,'index.html');
    fs.readFile(filePath,(readErr,data)=>{
      if(readErr){res.writeHead(500);return res.end('Server error');}
      res.writeHead(200,{'Content-Type':mime[path.extname(filePath)] || 'application/octet-stream'});
      res.end(data);
    });
  });
}).listen(port,()=>console.log(`Boro Launch Pad listening on ${port}`));

function _ls(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('লাইব্রেরি লোড হয়নি, ইন্টারনেট দেখুন'));document.head.appendChild(s);});}
async function _h2c(){if(!window.html2canvas)await _ls('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');}
async function savePdf(el,name,w){await _h2c();if(!window.jspdf)await _ls('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
 const cv=await html2canvas(el,{scale:2,backgroundColor:'#ffffff',useCORS:true,windowWidth:w||794});
 const doc=new window.jspdf.jsPDF('p','pt','a4');const pw=doc.internal.pageSize.getWidth(),ph=doc.internal.pageSize.getHeight(),mg=18;
 const iw=pw-2*mg,pageH=(ph-2*mg)*cv.width/iw;let y=0,first=true;
 while(y<cv.height){const sh=Math.min(pageH,cv.height-y);const c=document.createElement('canvas');c.width=cv.width;c.height=sh;c.getContext('2d').drawImage(cv,0,y,cv.width,sh,0,0,cv.width,sh);
  if(!first)doc.addPage();doc.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',mg,mg,iw,sh*iw/cv.width);y+=sh;first=false;}
 doc.save(name);}
async function savePng(el,name){await _h2c();const cv=await html2canvas(el,{scale:3,backgroundColor:null,useCORS:true});const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download=name;a.click();}

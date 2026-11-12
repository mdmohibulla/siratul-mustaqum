(function(){
 var U='https://dgsxzwutsstfsezvlkmh.supabase.co',K='sb_publishable_27L6UJCzRDDD9xEZ4733OQ_dLsY0oDE';
 function refresh(){try{
  var rt=localStorage.getItem('tk_rt');if(!rt)return false;
  var x=new XMLHttpRequest();x.open('POST',U+'/auth/v1/token?grant_type=refresh_token',false);
  x.setRequestHeader('apikey',K);x.setRequestHeader('Content-Type','application/json');x.send(JSON.stringify({refresh_token:rt}));
  if(x.status===200){var j=JSON.parse(x.responseText);sessionStorage.setItem('tk',j.access_token);localStorage.setItem('tk_rt',j.refresh_token);localStorage.setItem('tk_exp',String(Date.now()+(j.expires_in||3600)*1000));return true;}
  localStorage.removeItem('tk_rt');localStorage.removeItem('tk_exp');sessionStorage.removeItem('tk');return false;
 }catch(e){return false;}}
 window.adminRefresh=refresh;
 try{
  var s=sessionStorage.getItem('tk'),exp=Number(localStorage.getItem('tk_exp')||0);
  if(!(s&&exp&&Date.now()<exp-60000)&&localStorage.getItem('tk_rt'))refresh();
  var l=document.createElement('link');l.rel='icon';l.href='favicon.png';document.head.appendChild(l);
  var si=document.createElement('script');si.src='icons.js';document.head.appendChild(si);
 }catch(e){}
})();

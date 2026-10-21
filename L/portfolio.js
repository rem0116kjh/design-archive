(() => {
  'use strict';
  const dialog=document.querySelector('#portfolio-dialog');
  const body=dialog.querySelector('.portfolio-dialog-body');
  const notes=JSON.parse(document.querySelector('#portfolio-notes').textContent);
  let trigger;
  function open(link,content){
    trigger=link;body.replaceChildren(content);dialog.showModal();dialog.scrollTop=0;window.lenis?.stop();
  }
  document.querySelectorAll('[data-portfolio-project]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();const template=document.querySelector('#portfolio-'+link.dataset.portfolioProject);
    if(template)open(link,template.content.cloneNode(true));
  }));
  document.querySelectorAll('[data-portfolio-note]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();const data=notes[Number(link.dataset.portfolioNote)];if(!data)return;
    const article=document.createElement('article');article.className='portfolio-note';
    const heading=document.createElement('h2');heading.id='portfolio-dialog-title';heading.textContent=data[0];
    const paragraph=document.createElement('p');paragraph.textContent=data[1];article.append(heading,paragraph);open(link,article);
  }));
  dialog.querySelector('[data-portfolio-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{body.replaceChildren();window.lenis?.start();trigger?.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
  // The same design and renderer remain usable when optional storage is blocked.
  addEventListener('pagehide',()=>window.lenis?.stop());
})();

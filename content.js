$(function(){  
  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.task=='apply'){
      var css = document.createElement('style');
      css.type = 'text/css';
      css.appendChild(document.createTextNode(request.payload));
      $('head')[0].append(css);
      console.log(css);
    }
  })

})


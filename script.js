$(function(){

    function populate(ctr, active) {
        var div = `
        <li class='elems_container row'>
            <div class="switch">
                <label>
                    <input class='chkSwitch' type="checkbox">
                    <span class="lever"></span>
                </label>
            </div>
            <div class="input-field col s6">
                <input id="input_text" type="text" class="elems">
                <label for="input_text">Page</label>
            </div>
            <div class="input-field col s6">
                <textarea id="textarea2" class="materialize-textarea stylr_style"></textarea>
                <label for="textarea2">Styles</label>
            </div>
            <i class="material-icons btn_del">delete</i>
      </li>
      `

      if(active) {
          div = `
            <li class='elems_container row'>
                <div class="switch">
                    <label>
                        <input class='chkSwitch' type="checkbox">
                        <span class="lever"></span>
                    </label>
                </div>
                <div class="input-field col s6">
                    <input id="input_text" type="text" class="elems">
                    <label class='active' for="input_text">Page</label>
                </div>
                <div class="input-field col s6">
                    <textarea id="textarea2" class="materialize-textarea stylr_style"></textarea>
                    <label class='active' for="textarea2">Styles</label>
                </div>
                <i class="material-icons btn_del">delete</i>
            </li>
        `
      }
      var parent =$('#stylr_styles .stylr_container #btn_add');
      
      for(let i=0;i<ctr;i++) {
          $(parent).before(div)
      }

      $('#stylr_styles .stylr_container .elems_container .btn_del').click(function(){
            var del=$(this).parent().remove();
            var h=$('#stylr_styles').height();
            $('html').css('height',h);
            $('body').css('height',h);
        })
    }

    chrome.storage.sync.get('store', function(result){
        console.log(result.store);
        
        populate(result.store.length, true);

        var h=$('#stylr_styles').height();
        $('html').css('height',h);
        $('body').css('height',h);

        var ar = $('#stylr_styles .stylr_container .elems_container');
        for (let i=0;i<result.store.length;i++) {
            var el=ar[i];
            
            var chk = $(el).find('.chkSwitch');
            var sel = $(el).find('.elems');
            var st = $(el).find('.stylr_style')
            // console.log(result.store[i].sel);
            $(chk).prop('checked',result.store[i].chk);
            $(sel).val(result.store[i].sel);
            $(st).text(result.store[i].stl);
        }

        apply();
    })

    $('#btn_add').click(function(){
        populate(1, false)
    })

    function apply() {
        var storeArr = [];

        var ar = $('#stylr_styles .stylr_container .elems_container');
        for (let el of ar) {
            var check = $(el).find('.chkSwitch').prop('checked');
            var sel = $(el).find('.elems').val();
            var st = $(el).find('.stylr_style').val()
            
            var store = {
                'chk': check,
                'sel': sel,
                'stl': st
            };

            storeArr.push(store);
        }

        if(storeArr) {
            chrome.storage.sync.set({'store':storeArr},function(){
                console.log('saved');
            });
        }

        chrome.tabs.query({active: true, currentWindow: true},function(tabs){
            var currURL=tabs[0].url;
            for(let pg of storeArr) {
                var url=pg.sel;
                if(pg.chk &&  currURL.indexOf(url)==0)
                    chrome.tabs.sendMessage(tabs[0].id, {task: 'apply', payload: pg.stl});
            }
        })
    }

    $('#btn_apply').click(function(){
        apply();
    });
})
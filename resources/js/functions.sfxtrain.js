function Copy2Clipboard(input) {
  var el = document.getElementsByName(input);
  el[0].select();
  document.execCommand("copy");
}

function Link2Category(category_id,plan_id=null){
  if(plan_id==null){plan_id=$('body').data('id');}
  $('#CategoriesList .exr_categ_current').removeClass('exr_categ_current');
  $('#CategoriesList a[data-category-id='+category_id+']').addClass('exr_categ_current');
  $.get(`/ex/${category_id}/${plan_id}`,function(data){$('#ExersicesList').html(data);});
  $.get(`/modals/${plan_id}/${category_id}/`,function(data){$('aside#ModalsBlock').html(data);});
}

function Config2Base(){
    var body_prepare = document.getElementsByTagName('body');
    var postdata = 'plan_id='+body_prepare[0].getAttribute('data-id')+'&plan_date_planned='+document.getElementById('ConfigTrainDate').value;
    var url = '/update/conf';
    var request = $.post(
        url,
        postdata,
        conf_updated,
        "json"
    );    
    function conf_updated(){}
}

function Plan2Base(){
    var plan_prepared = {};
    var comments_prepared = {};
    var plan_data = document.getElementsByTagName('section');
    for (var a = 0; a < plan_data.length; a++) {
        plan_prepared[a] = {};
        comments_prepared[a] = $('main').find('section[data-section='+a+']').find('.comment-block:visible').find('p').text();
        var cards = plan_data[a].getElementsByClassName('card_planned'); 
        for (var b = 0; b <= cards.length; b++) {            
            if (b === cards.length){delete plan_prepared[a][b];}
            else{plan_prepared[a][b] = cards[b].getAttribute('id');}
        }        
    }
    console.log(JSON.stringify(comments_prepared));
    var postdata = 'plan_id='+$('body').data('id')+'&plan_data='+JSON.stringify(plan_prepared)+'&comments_data='+JSON.stringify(comments_prepared);
    var url = '/update/plan';
    var request = $.post(
        url,
        postdata,
        updpln_req_completed,
        "application/json"
    );
    function updpln_req_completed(){}
};

function TimerView(el){
    var El2Run = document.getElementById('MainTimer');
    if($(El2Run).css("display") == 'none'){
        $(El2Run).slideDown();
        $(el).addClass('active').blur();
    } else {
        $(El2Run).slideUp();
        $(el).removeClass('active').blur();
    }
}

function TimerPlus(el){
    var c = $(el).closest('.timer').find('a').text();
    timerInstance.stop();    
    let d = new Date();
    let TimerValue = c.split(':');
    d.setHours(+TimerValue[0]);
    d.setMinutes(TimerValue[1]);
    d.setSeconds(TimerValue[2]);

    d.setSeconds(d.getSeconds() + 30 );
    $('#MainTimer a').text(`${d.getHours()}`.padStart(2,'0')+':'+`${d.getMinutes()}`.padStart(2,'0')+':'+`${d.getSeconds()}`.padStart(2,'0'));
    $('#MainTimer a').addClass('stop');
    $('#MainTimer button:first-of-type').removeAttr('disabled');
}

function TimerMinus(el){
    var TimerValue = $(el).closest('.timer').find('a').text().split(':');
    timerInstance.stop();      
    $('#MainTimer a').addClass('stop');
     
    var TimerSeconds = (+TimerValue[0]) * 60 * 60 + (+TimerValue[1]) * 60 + (+TimerValue[2]);
    
    if(TimerSeconds <= 30){
        $('#MainTimer a').text('00:00:30');
    }else{
        let d = new Date(); 
        d.setHours(+TimerValue[0]);
        d.setMinutes(TimerValue[1]);
        d.setSeconds(TimerValue[2]);
        d.setSeconds(d.getSeconds() - 30 );
        $('#MainTimer a').text(`${d.getHours()}`.padStart(2,'0')+':'+`${d.getMinutes()}`.padStart(2,'0')+':'+`${d.getSeconds()}`.padStart(2,'0'));
    }
}

function CommentSwithcer(el) {
    var ElParent = $(el).closest('section');
    if($(ElParent).find("div.comment-textarea").is(":hidden")){
        $(ElParent).find("div.comment-block").hide();
        $(ElParent).find("div.comment-textarea").show();
        $(ElParent).find("div.comment-textarea").find("textarea").focus().select();
    } else {    
        let SaveTextRaw =  $(ElParent).find("div.comment-textarea>textarea").val();  
        let SaveTextShow=SaveTextRaw.replace(/\n/g,"<br>");
        $(ElParent).find("div.comment-textarea").hide();
        if (SaveTextRaw.length > 0){
            /* Need better solution */
            $(ElParent).find("div.comment-block").html('<p>'+SaveTextRaw+'</p>').show();
            Plan2Base();
            $(ElParent).find("div.comment-block").html('<p>'+SaveTextShow+'</p>');
        }
    }   
}
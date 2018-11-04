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
    var plan_data = document.getElementsByTagName('section');
    for (var a = 0; a < plan_data.length; a++) {
        plan_prepared[a] = {};
        var cards = plan_data[a].getElementsByClassName('card_planned'); 
        for (var b = 0; b <= cards.length; b++) {            
            if (b === cards.length){delete plan_prepared[a][b];}
            else{plan_prepared[a][b] = cards[b].getAttribute('id');}
        }
    }
    var postdata = 'plan_id='+$('body').data('id')+'&plan_data='+JSON.stringify(plan_prepared);
    var url = '/update/plan';
    var request = $.post(
        url,
        postdata,
        updpln_req_completed,
        "application/json"
    );
    function updpln_req_completed(){}
};

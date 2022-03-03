$(document).ready(function(){
    $.get(`/ca/1/`,function(min_id){      
        $.get(`/ca/${min_id}/`,function(data){$('#CategoriesList').html(data);});        
        Link2Category(min_id);
    });
});

$(document).on("click", 'main button.close', function() {
    var ElId = $(this).data("cardRemove");
    var El2Rem = document.getElementById(ElId);
    El2Rem.classList.remove('card_planned');
    var ElemCount = $(this).closest('section').find('div.card').length;
    if (ElemCount < 2){
        $(El2Rem).closest('section').find('.dropzone').remove();
        $(El2Rem).closest('section').addClass('section_dropzone');
    } 
    $(El2Rem).next('.dropzone').remove();
    $(El2Rem).remove();
    Plan2Base();
    var cur_cat = $('#CategoriesList a.exr_categ_current').data('categoryId');
    Link2Category(cur_cat);
});

$(document).on('shown.bs.modal', '.modal', function() {
    $(this).find('[autofocus]').focus();
});

$(document).on("submit", "form[name=FormAddCategory]", function(event) {
    event.preventDefault();
    var url = '/add/category';
    var postdata = $(this).serialize(); 
    $('#ModalAddCat').modal('hide');
    $('button').blur();    
    var request = $.post(
        url,
        postdata,
        addcat_req_completed,
        "json"
    ); 
    function addcat_req_completed(data, status){
        if(status == "success"){
            var new_cat_id = data;
            $.get(`/ca/${new_cat_id}/`,function(data){$('#CategoriesList').html(data);});
            Link2Category(category_id=new_cat_id);
            $('#ModalAddExrBtn').removeAttr("disabled");
        }
    }
});

$(document).on("submit", "form[name=FormAddExercise]", function(event) {
    event.preventDefault();
    var url = '/add/exercise';
    var postdata = $(this).serialize();
    var form_cat = $('form[name=FormAddExercise] select[name=category_id]').val();
    $('#ModalAddExr').modal('hide');    
    $('button').blur();
    var request = $.post(
        url,
        postdata,
        addex_req_completed,
        "json"
    );    
    function addex_req_completed(data, status){
        if(status == "success"){
            if($('#CategoriesList a[data-category-id='+data+']').hasClass('exr_categ_current')){
                Link2Category(category_id=data);
            }
        }
    }
});

/*
 * Prepared for v.1.5.
 *
 * $('header .btn-group .dropdown-item').click(function(){
 *    var selValue = $(this).data("select");
 *    var selText = $(this).text();
 *    $(this).closest('.btn-group').find('button').attr("data-value",selValue);
 *    $(this).closest('.btn-group').find('button').text(selText + ' ');
 * });
*/

/* Timer */
const timerInstance = new easytimer.Timer();

$(document).on("click","#MainTimer a", function(event) {
    event.preventDefault();
    let TimerState = timerInstance.isRunning();
    let TimerValue = $(this).text().split(':');;
    let TimerSeconds = (+TimerValue[0]) * 60 * 60 + (+TimerValue[1]) * 60 + (+TimerValue[2]); 

    if(TimerState === false){
        console.log('Timer run!');
        $(this).removeClass('stop');
        timerInstance.start({countdown: true, startValues: {seconds: TimerSeconds}});
    }else{
        console.log('Timer stop!');
        timerInstance.stop();
        $(this).addClass('stop');
        $(this).text('00:00:30');
    }
});

timerInstance.addEventListener('secondsUpdated', function (e) {
    $('#MainTimer a').text(timerInstance.getTimeValues().toString());
});
timerInstance.addEventListener('started', function (e) {
    $('#MainTimer a').text(timerInstance.getTimeValues().toString());
});
timerInstance.addEventListener('reset', function (e) {
    $('#MainTimer a').text(timerInstance.getTimeValues().toString());
});
timerInstance.addEventListener('targetAchieved', function (e) {
    $('#MainTimer a').addClass('stop');
    $('#MainTimer a').html('00:00:30');
    new Audio('/resources/mp3/t_stop.mp3').play();
});



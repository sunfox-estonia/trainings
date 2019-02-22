<?php 
// composer autoloader for required packages and dependencies
require_once('lib/autoload.php');
require_once('config.php');
/** @var \Base $f3 */
$f3 = \Base::instance();
//$f3->set('CACHE','folder=tmp/');
$f3->set('CACHE',TRUE);
$f3->set('DEBUG',3);
$f3->set('AUTOLOAD', 'app/controllers/');
$f3->set('UI','app/templates/');
// Connect MySQL here
$f3->set('DB',new DB\SQL('mysql:host='.$dbhost.';port='.$dbpost.';dbname='.$dbname,$dbuser,$dbpassword));

$f3->set('ONERROR',function($f3){
    //echo $f3->get('ERROR.code') . '<br>';
    //echo $f3->get('ERROR.text') . '<br>';
    //echo $f3->get('ERROR.trace') . '<br>';
    echo Template::instance()->render('error.htm');
});

/**
 * Generate plan ID and redirect to plan page
 * Generate plan page at Homepage template
 */
$f3->route('GET /', function($f3) {
    $uniq = false;
    $chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    $pln = new DB\SQL\Mapper($f3->get('DB'),'plans');
    while (!$uniq==true) {
        $rstr = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyz'),0,6);
        $count = $pln->count(array('quicklink=?',$rstr));
        $uniq = $count > 0 ? false : true;
    }
    $pln->quicklink=$rstr;
    $pln->save();
    $f3->reroute('/plan/'.$rstr);
});
$f3->route('GET /plan/@pql', function($f3,$params) {
    $plan_ql = strtolower($params['pql']);
    $pln = new DB\SQL\Mapper($f3->get('DB'),'plans');
    $count = $pln->count(array('quicklink=?',$plan_ql));
    if($count==1){
        $pln->load(array('quicklink=?',$plan_ql));   
    }elseif($count==0){
        $pln->quicklink=$plan_ql;
        $pln->save();
        $pln->load(array('quicklink=?',$plan_ql));
    }else{
        echo Template::instance()->render('error.htm');
        exit();
    }
    $cat = new DB\SQL\Mapper($f3->get('DB'),'ex_categories');
    $cat_count = $cat->count(array('id'));
    $has_cats = $cat_count > 0 ? true : false;   
    $v=0;
    if($pln->content){
        foreach(json_decode($pln->content) as $block){
            $r=0;
            $plan_content_prepared = null;
            foreach($block as $item){            
                $exr = new DB\SQL\Mapper($f3->get('DB'),'ex_exercises');
                $exr->load(array('id=?',$item));
                $plan_content_prepared[$r]['id']=$exr->id;
                $plan_content_prepared[$r]['title']=$exr->title;
                $plan_content_prepared[$r]['description']=$exr->description;                
                $r++;
            }
            $f3->set('pln_content_'.$v,$plan_content_prepared);
            $v++;
        }
        $f3->set('has_plan','TRUE');
    }else{
        $f3->set('has_plan','FALSE');
    }
    $f3->set('pln_conf_id',$pln->id);
    $f3->set('pln_conf_quicklink',$pln->quicklink);
    $f3->set('pln_conf_planned',$pln->date_planned);
    $f3->set('has_cats',$has_cats);
    echo Template::instance()->render('homepage.htm');
});
/**
 * Add cetegories and exercises
 */
$f3->route('POST /add/category', function($f3){
    $new_cat = rtrim(trim($f3->get('POST.category_title')),".");
    $rec = new DB\SQL\Mapper($f3->get('DB'),'ex_categories');
    $rec->title = $new_cat;
    $rec->save();
    echo $rec->id;
});
$f3->route('POST /add/exercise', function($f3){
    $md = \Markdown::instance();
    $rec = new DB\SQL\Mapper($f3->get('DB'),'ex_exercises');
    $rec->title = rtrim(trim($f3->get('POST.exercise_title')),".");
    $rec->description = trim($f3->get('POST.exercise_description'));
    $rec->category_id = $f3->get('POST.category_id');
    $rec->save();
    echo $rec->category_id;
});

/**
 * Update plan settings in a PLANS table.
 */
$f3->route('POST /update/conf', function($f3){
    $plan_id = $f3->get('POST.plan_id');    
    $plan_date_planned = $f3->get('POST.plan_date_planned');
    $pln = new DB\SQL\Mapper($f3->get('DB'),'plans');
    $pln->load(array('id=?',$plan_id));
    $pln->date_planned=$plan_date_planned;
    $pln->save();
    echo "success";
});
/**
 * Update plan data in a PLANS table.
 */
$f3->route('POST /update/plan', function($f3){
    $plan_id = $f3->get('POST.plan_id');    
    $plan_data = $f3->get('POST.plan_data');
    $pln = new DB\SQL\Mapper($f3->get('DB'),'plans');
    $pln->load(array('id=?',$plan_id));
    $pln->content=$plan_data;
    $pln->save();
    echo "success";
});
/**
 * Exercises cards generator
 */
$f3->route('GET /ex/@cid/@pid', function ($f3,$params){
    // Get current plan
    $pln = new DB\SQL\Mapper($f3->get('DB'),'plans');
    $plan = $pln->load(array('id=?',$params['pid']));
    $re = '/:\"([0-9]{1,3})\"/';
    preg_match_all($re, $plan->content, $matches, PREG_SET_ORDER, 0);           
    foreach($matches as $val){$excl_array[] = $val[1];}
    if(empty($excl_array)){
        $excl_req_prep = "";
    }else{
        $excl_array = array_unique($excl_array);
        $excl_string = implode(",",$excl_array); 
        $excl_req_prep = " AND `id` NOT IN (".$excl_string.")";
    }
    $exr = new DB\SQL\Mapper($f3->get('DB'),'ex_exercises');
    $counter = $exr->count(array('category_id=?',$params['cid']));
    $cpc = ceil($counter / 3); 
    $ex_list_1 = $f3->get('DB')->exec('SELECT `id`,`category_id`,`title`,`description` FROM `ex_exercises` WHERE `category_id`='.$params['cid'] . $excl_req_prep .' ORDER BY `id` DESC LIMIT '.$cpc);
    $f3->set('colOne',$ex_list_1);
    if($counter>1){
    $ex_list_2 = $f3->get('DB')->exec('SELECT `id`,`category_id`,`title`,`description` FROM `ex_exercises` WHERE `category_id`='.$params['cid'] . $excl_req_prep .' ORDER BY `id` DESC LIMIT '.$cpc.' OFFSET '.$cpc);
    $f3->set('colTwo',$ex_list_2);
    }
    if($counter>2){
    $ex_list_3 = $f3->get('DB')->exec('SELECT `id`,`category_id`,`title`,`description` FROM `ex_exercises` WHERE `category_id`='.$params['cid'] . $excl_req_prep .' ORDER BY `id` DESC LIMIT '.$cpc.' OFFSET '.$cpc*2);
    $f3->set('colThree',$ex_list_3);
    }
    echo Template::instance()->render('exr.htm');
});
/**
 * Categories list generator
 */
$f3->route('GET /ca/@cid', function ($f3,$params){
    if($params['cid']==1){
        $rec = new DB\SQL\Mapper($f3->get('DB'),'ex_categories');
        $rec->min_id='MIN(id)';
        $rec->load();
        echo $rec->min_id;        
    }else{
        $f3->set('req_cat_id', $params['cid']);   
        $result = $f3->get('DB')->exec('SELECT * FROM ex_categories ORDER BY id ASC');
        $f3->set('categories',$result);
        echo Template::instance()->render('cat.htm');
    }
});

/**
 * Modals block generator
 */
$f3->route('GET /modals/@pid/@cid', function ($f3,$params){
    // Get current category
    $result = $f3->get('DB')->exec('SELECT * FROM ex_categories ORDER BY id ASC');
    $f3->set('modal_req_cat_id', $params['cid']);
    $f3->set('modal_categories',$result);

    // Get Quicklink
    $pln = new DB\SQL\Mapper($f3->get('DB'),'plans');
    $pln->load(array('id=?',$params['pid']));
    
    $pln_url = ($_SERVER['HTTPS'] ? "https://" : "http://").$_SERVER['HTTP_HOST'] . '/plan/' . $pln->quicklink;
    $pln_url_img_prep = shell_exec('qrencode --output=- -m=1 '.escapeshellarg($pln_url));
    $pln_url_img = "data:image/png;base64,".base64_encode($pln_url_img_prep);
    
    //$f3->set('modal_quicklink',$pln->quicklink);
    $f3->set('modal_url_txt',$pln_url);
    $f3->set('modal_url_img',$pln_url_img);   
    
    echo Template::instance()->render('blocks/modals.htm');
});

$f3->run();
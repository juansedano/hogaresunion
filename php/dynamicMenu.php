<?php
ob_start();
$baseFile = basename($_SERVER['REQUEST_URI'], '?'.$_SERVER['QUERY_STRING']);

$menu = '<ul class="nav nav-pills nav-stacked">';
if ($baseFile == 'wainbox.php') {  
    $menu .= '<li class="active"><a href="wainbox.php"><i class="fa fa-whatsapp"></i><span>Whatsapp</span></a></li>';
    $menu .= '<li><a href="contacts.php"><i class="fa fa-user-circle-o"></i><span>Contactos</span></a></li>'; 
} elseif ($baseFile == 'contacts.php') {  
    $menu .= '<li><a href="wainbox.php"><i class="fa fa-whatsapp"></i><span>Whatsapp</span></a></li>';
    $menu .= '<li class="active"><a href="contacts.php"><i class="fa fa-user-circle-o"></i><span>Contactos</span></a></li>';         
} else {
    echo "<script> location.href='./login.html'; </script>";
    exit;
}    
$menu .= '</ul>';
echo $menu;
?>
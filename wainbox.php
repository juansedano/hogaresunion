<?php
include_once 'bat/sessionData.php';
if ((!$userInfo) || (!$userData)) {
    header("Location: ./index.html");
    die();
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Hogares Unión</title>

        <link href="./css/style.default.css" rel="stylesheet">
        <link href="./css/select2.css" rel="stylesheet" />
        <link href="./css/jquery.gritter.css" rel="stylesheet">
        <link rel="icon" href="./ico/favicon.ico">
        <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">
        <link rel="stylesheet" href="./css/font-awesome-new.css">
        <link href="./css/font-awesome.min.css" rel="stylesheet">
        <link href="./css/bootstrap-timepicker.min.css" rel="stylesheet" />
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="js/html5shiv.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
        <link href="css/wainbox.css?v=0.0.0" rel="stylesheet" />
        <style>

        </style>
    </head>
    <body>

        <header>
            <div class="headerwrapper">
                <div class="header-left">
                    <a href="index.html" class="logo">
                        <img src="images/logo/hogares-union-logo.png" style="width:52px;" alt="" />
                    </a>
                    <div class="pull-right">
                        <a href="" class="menu-collapse">
                            <i class="fa fa-bars"></i>
                        </a>
                    </div>
                </div>

                <div class="header-right">
                  <div class="pull-right">
                    <div class="btn-group btn-group-option">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                          <i class="fa fa-caret-down"></i>
                        </button>
                        <ul class="dropdown-menu pull-right" role="menu">
                          <li><a href="logout.php"><i class="glyphicon glyphicon-log-out"></i>Salir</a></li>
                        </ul>
                    </div>
                  </div>
                </div>

            </div>
        </header>

        <section>
            <div class="mainwrapper">
                <div class="leftpanel">
                    <div class="media profile-left">
                        <div class="media-body">
                            <!--<div class="media-body">
                                <div class="whatsapp-icon">
                                    <i style="color:#ffffff !important;font-size:16px" class="fa fa-whatsapp"></i>
                                </div>  
                                <div style="display:inline">WhatsApp <span style="font-size:10px">(v 0.0.0)</span></div>
                            </div>-->
                            <h4 class="media-heading session-name" style="margin-top:10px;"><?php echo $userData['name']; ?></h4>
                            <small class="text-muted"><?php echo $userData['email']; ?></small>
                        </div>          
                    </div>
                    <?php
                        include './php/dynamicMenu.php';
                        if (isset($_GET['contact'])) {
                            echo '<input type="hidden" id="hasUrlData" data-contactid="'.$_GET['contact'].'" value="3">';
                        }
                    ?>
                </div>

                <div class="mainpanel">
                    <div class="contentpanel">                  
                        <div class="row">
                            <div class="col-md-3" style="padding:0px 2px;" id="contactPanelContainer"> 
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="col-xs-6" style="padding:0px">
                                            <!--<input type="range" min="0" max="1" value="0" class="slider isPanelActive" style="display:inline;width:26px;display:inline;background:#ccc;cursor:pointer;">-->
                                            <h4 class="panel-title" style="display:inline;">Contactos</h4>
                                        </div> 
                                        <div class="col-xs-6" style="padding:0px;text-align:right;">
                                            <span class="filter-messages-container icon-start-conversation" data-toggle="tooltip" title="Iniciar Conversación"> 
                                                <img src="./images/icons/pencil-square.svg" class="icon-messages">
                                            </span>                                         
                                            <span class="filter-messages-container icon-contacts-advanced-search" data-toggle="tooltip" title="Búsqueda avanzada">
                                                <img src="./images/icons/advanced-search-svgrepo-com.svg" class="icon-messages">
                                            </span>                                          
                                            <span class="filter-messages-container icon-contacts-filters" data-toggle="tooltip" title="Filtros">
                                                <img src="./images/icons/filter-svgrepo-com.svg" class="icon-messages">
                                            </span>      
                                            <span class="filter-messages-container" data-toggle="tooltip" title="Encender/Apagar">
                                                <img src="./images/icons/power-off-svgrepo-com.svg" class="icon-messages-power-off isPanelActive">
                                            </span>                                                                              
                                        </div>
                                    </div>
                                    <div class="panel-body" style="padding:0px 10px;">
                                        <div class="row messages-full-container" style="background-color: #f5f8fa;"> 
                                            <!--<div class="col-md-12" style="text-align:right;">    
                                            </div>-->
                                            <div id="filtersContainer" class="col-md-12 collapse">
                                                <div class="card-body">
                                                    <div class="col-md-12 filters-container">
                                                        <select class="form-control input-sm border-radius" id="filterSize" >
                                                            <option value="0">Últimas 24 horas</option> 
                                                            <option value="1">Últimos 3 días</option> 
                                                            <option value="2">De 4 a 7 días</option> 
                                                            <option value="3">De 8 a 15 días</option> 
                                                            <option value="4">De 16 a 30 días</option> 
                                                            <option value="5">De 31 a 45 días</option> 
                                                            <option value="6">De 46 a 60 días</option> 
                                                            <option value="7">De 61 a 75 días</option> 
                                                            <option value="8">De 76 a 90 días</option> 
                                                            <option value="9">De 91 a 105 días</option> 
                                                            <option value="10">De 106 a 120 días</option> 
                                                        </select>
                                                    </div>       
                                                    <div class="col-md-12 filters-container">
                                                        <select class="form-control input-sm border-radius activate-filters" id="filterConversationType">
                                                            <option value="all">Todas las Conversaciones</option> 
                                                            <option value="no-answer">Sin respuesta</option> 
                                                            <option value="favorite">Favoritos</option> 
                                                        </select>
                                                    </div>                                                                                                                                                            
                                                </div>
                                            </div>
                                            <div id="advancedSearchContainer" class="col-md-12 collapse">
                                                <div class="card-body">
                                                    <div class="col-md-12" style="padding:6px 6px 0px 6px;margin:0px;font-size:12px;">
                                                        Búsqueda avanzada
                                                    </div>                                                    
                                                    <div class="col-md-12 filters-container">
                                                        <span class="glyphicon glyphicon-search search-advanced-contacts"></span>
                                                        <input type="text" class="form-control input-sm border-radius" id="searchAdvancedContactInput" style="padding-right:32px;" placeholder="Ingresa el texto a buscar">
                                                    </div>    
                                                    <div class="col-xs-12 filters-container">
                                                        <select class="form-control input-sm border-radius" id="searchAdvancedContactSelect">
                                                            <option value="none">Selecciona...</option>
                                                            <optgroup label="Búsqueda de Contacto">
                                                                <option value="contactId">Id</option>
                                                                <option value="contactName">Nombre</option>
                                                                <option value="contactPhone">Teléfono</option>
                                                            </optgroup>                                                             
                                                        </select>
                                                    </div>    
                                                    <div class="col-xs-12 filters-container-button" style="text-align: right !important;">
                                                    <button class="btn btn-success btn-sm" id="searchAdvancedContactButton" style="padding: 5px 16px;">Buscar <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                                                    </div>                                                                                                                                                            
                                                </div>
                                            </div>                                                                                                                                    
                                            <div class="col-md-12 contactOptionsContainer">
                                                <div class="col-md-12 filterOptionsContainer">
                                                    <span class="fa fa-sort-desc search-filters"></span>
                                                    <select class="border-radius basic-select2" id="filterInstances" disabled>
                                                    </select>
                                                </div>                                                 
                                                <div class="input-group input-sm">
                                                    <span class="glyphicon glyphicon-search search-contacts"></span>
                                                    <input type="text" class="form-control" id="searchContactInput" placeholder="Búsqueda de Contacto" autocomplete="off" disabled>
                                                    <span id="searchClear" class="fa fa-times" style="display:none"></span>
                                                </div>                                            
                                            </div>
                                            <div class="col-md-12" id="contactsContainer">
                                                <img src="./images/loader.gif" class="contacts-container-loader-style">
                                            </div>
                                            <div class="col-md-12" id="advancedSearchResultContainer">
                                                &nbsp;
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6" style="padding:0px 2px;" id="messagingPanelContainer">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="col-xs-12" style="padding:0px"> 
                                            <span class="fa fa-chevron-left" id="showContactPanelContainer" style="display:inline;padding-right:8px;cursor:pointer;"></span><h4 class="panel-title" id="messageContainertitle" style="display:inline">Mensajes</h4> 
                                        </div>
                                        <!--<div class="col-xs-4" style="padding:0px;text-align:right;">
                                            <span class="filter-messages-container" data-toggle="tooltip" title="Seguimiento"> 
                                                <img src="./images/icons/clipboard-data.svg" class="icon-messages">
                                            </span> 
                                            <span class="filter-messages-container" data-toggle="tooltip" title="Enviar mensaje">
                                                <img src="./images/icons/whatsapp.svg" class="icon-messages">
                                            </span>      
                                            <span class="filter-messages-container" data-toggle="tooltip" title="Bloquear contacto">
                                                <img src="./images/icons/x-circle.svg" class="icon-messages">
                                            </span>                                                                              
                                        </div>-->
                                    </div>
                                    <div class="panel-body" style="padding:0px 10px">
                                        <div class="row" id="messageFullContainer">
                                            <div class="col-md-12" id="messagesContainer">
                                                <img src="./images/loader.gif" class="messages-container-loader-style"> 
                                            </div>
                                            <div class="col-md-12" id="messageActions">
                                                <div class="row" style="position: relative;">
                                                    <div class="col-xs-12 text-container">
                                                        <div id="message" data-text="Escribe un mensaje" readonly></div>
                                                        <span id="messageLoader"><img src="./images/loader.gif" style="width:24px;"></span>
                                                        <div class="more-options-container">
                                                            <label class="btn-block attachment-type-container" id="showScheduleMessageContainer"><span class="fa fa-calendar"></span>&nbsp;&nbsp;&nbsp;Mensaje programado</label>
                                                            <label class="btn-block attachment-type-container" id="showContactTaskContainer"><span class="fa fa-tasks"></span>&nbsp;&nbsp;&nbsp;Tareas</label>
                                                            <label class="btn-block attachment-type-container" id="showContactFavoriteContainer"><span class="fa fa-heart-o"></span>&nbsp;&nbsp;&nbsp;Añadir a Favoritos</label>
                                                        </div>                                                         
                                                        <div class="attachment-menu-container">
                                                            <input type="file" class="image-btn-go attachment-file" id="image-btn" style="display:none;" accept="image/*,video/*"/>
                                                            <label for="image-btn" class="btn-block attachment-type-container"><span class="fa fa-file-image-o"></span>&nbsp;&nbsp;&nbsp;Foto</label>
                                                            <input type="file" class="image-btn-go attachment-file" id="file-btn" style="display:none;" accept="application/pdf,application/vnd.ms-excel,officedocument/*"/>
                                                            <label for="file-btn" class="btn-block attachment-type-container"><span class="fa fa-file-text-o"></span>&nbsp;&nbsp;&nbsp;Documento</label>                                                       
                                                        </div>   
                                                        <div class="icons-container">
                                                            <div> <!--https://gist.github.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb-->
                                                                <div style="padding:4px;">
                                                                    <span class="whatsapp-emoticon">&#128077;&#127996;</span>
                                                                    <span class="whatsapp-emoticon">&#128075;&#127996;</span>
                                                                    <span class="whatsapp-emoticon">&#129310;&#127996;</span>  
                                                                    <span class="whatsapp-emoticon">&#128591;&#127996;</span> 
                                                                    <span class="whatsapp-emoticon">&#129318;&#127995;</span> 
                                                                    <span class="whatsapp-emoticon">&#128515;</span> 
                                                                </div>
                                                                <div style="padding:4px;">
                                                                    <span class="whatsapp-emoticon">&#128521;</span>
                                                                    <span class="whatsapp-emoticon">&#128522;</span>
                                                                    <span class="whatsapp-emoticon">&#128514;</span>  
                                                                    <span class="whatsapp-emoticon">&#129395;</span> 
                                                                    <span class="whatsapp-emoticon">&#128564;</span>
                                                                    <span class="whatsapp-emoticon">&#129302;</span>
                                                                </div>
                                                                <div style="padding:4px;">
                                                                    <span class="whatsapp-emoticon">&#127968;</span>
                                                                    <span class="whatsapp-emoticon">&#128222;</span>
                                                                    <span class="whatsapp-emoticon">&#128561;</span>
                                                                    <span class="whatsapp-emoticon">&#128532;</span>
                                                                    <span class="whatsapp-emoticon">&#128525;</span>
                                                                    <span class="whatsapp-emoticon">&#128151;</span>
                                                                </div> 
                                                            </div>                                                            
                                                        </div>                                                      
                                                    </div>
                                                </div>
                                                <div class="col-xs-6 message-options-left">  
                                                    <span class="fa fa-plus icons-message-options show-options-container" style="-webkit-text-stroke: 2px #f5f8fa;" data-toggle="tooltip" title="Más opciones"></span>
                                                    <!--<span class="fa fa-heart-o icons-message-options show-favorite-container" data-toggle="tooltip" title="Favorito"></span>-->
                                                    <span class="fa fa-paperclip icons-message-options show-attachment-container" data-toggle="tooltip" title="Enviar archivo"></span>
                                                    <span class="fa fa-smile-o icons-message-options show-icons-container" data-toggle="tooltip" title="Emojis"></span>                                                                                          
                                                </div>  
                                                <div class="col-xs-6 message-options-right">  
                                                    <span id="internalMessage" class="fa fa-commenting-o icons-message-options-right internal-message-mode" data-toggle="tooltip" title="Mensaje interno"></span>
                                                </div>                                                                                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3" style="padding:0px 2px;">
                                <div class="panel-group" id="accordion2">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <div class="col-xs-9" style="padding:0px">
                                                <h4 class="panel-title">
                                                    <a data-toggle="collapse" id="contactDataContainerDisplay"  data-parent="#accordion2" href="#collapseContactData" class="data-collapse-header collapsed">
                                                        Datos del Contacto
                                                    </a>
                                                </h4>
                                            </div>
                                            <div class="col-xs-3" style="padding:0px">
                                                <span style="float:right"><img src="./images/loader_white.gif" class="contacts-data-loader-style"></span>
                                            </div>
                                        </div>
                                        <div id="collapseContactData" class="data-collapse-container panel-collapse collapse" style="height: 0px;">
                                            <div class="panel-body" style="padding:0px 10px 0px 10px;">
                                                <div class="row" style="min-height:120px; overflow-y: scroll;">
                                                    <div class="col-md-12" id="contacDataContainer" style="padding-top:10px;">
                                                        <form class="sync-data-container">
                                                            <div class="form-group">
                                                                <label>Id de Contacto</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" data-value="" id="sync_id" readonly>
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Id Interno</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" data-value="" id="sync_external_Id" readonly>
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Propietario del Contacto</label>
                                                                <select class="form-control input-sm hubspot-input sync_owner" id="sync_collaborator_OwnerId">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Tipo de Contacto</label>
                                                                <select class="form-control input-sm hubspot-input sync_contactType" id="sync_contactType_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Origen del Contacto</label>
                                                                <select class="form-control input-sm hubspot-input sync_origin" id="sync_contactOrigin_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Status de la Conversión</label>
                                                                <select class="form-control input-sm hubspot-input sync_conversationStatus" id="sync_conversionStatus_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div> 
                                                            <div class="form-group">
                                                                <label>Perfil</label>
                                                                <select class="form-control input-sm hubspot-input sync_profile" id="sync_contactProfile_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                
                                                            </div>                                                             
                                                            <!-------------------------------------Personal Information------------------------------------>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Nombre corto</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_shortName">
                                                            </div>                                                                                                                     
                                                            <div class="form-group contact-bg-1">
                                                                <label>Nombre(s)</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_name">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Apellido(s)</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_lastName">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Sexo</label>
                                                                <select class="form-control input-sm hubspot-input sync_gender" id="sync_gender_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>                                                                
                                                            <div class="form-group contact-bg-1">
                                                                <label>Perfil de Facebook</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_facebookProfile"> 
                                                            </div>     
                                                            <div class="form-group contact-bg-1">
                                                                <label>Perfil de Instagram</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_instagramProfile"> 
                                                            </div>   
                                                            <div class="form-group contact-bg-1">
                                                                <label>Perfil de Linkedin</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_linkedinProfile"> 
                                                            </div>                                                             
                                                            <div class="form-group contact-bg-1">
                                                                <label>Correo</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_email"> 
                                                            </div>   
                                                            <div class="form-group contact-bg-1">
                                                                <label>Teléfono</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_phone" readonly>
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Teléfono fijo</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_otherPhone">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>URL visitada</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_visitedUrl">
                                                            </div> 
                                                            <div class="form-group contact-bg-1">
                                                                <label>Estado de interés</label>
                                                                <select class="form-control input-sm hubspot-input sync_state" id="sync_interestState_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>  
                                                            <div class="form-group contact-bg-1">
                                                                <label>Muicipio de interés</label>
                                                                <select class="form-control input-sm hubspot-input sync_locality" id="sync_interestLocality_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>                                                                                                                                                                                                                                                                                                                                                                                                                             
                                                            <!-----------------------------------Accredited 1 infomation-----------------------------------> 
                                                            <div class="form-group">
                                                                <label>Nombre | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Name">
                                                            </div>  
                                                            <div class="form-group">
                                                                <label>Apellido Paterno | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1LastName">
                                                            </div>  
                                                            <div class="form-group">
                                                                <label>Apellido Materno | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1SecondLastName">
                                                            </div>    
                                                            <div class="form-group">
                                                                <label>Correo | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Email">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Teléfono | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Phone">
                                                            </div>          
                                                            <div class="form-group">
                                                                <label>Sexo | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input sync_gender" id="sync_accredited1Gender_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>    
                                                            <div class="form-group">
                                                                <label>CURP | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Curp">
                                                            </div>  
                                                            <div class="form-group">
                                                                <label>NSS | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Nss">
                                                            </div>  
                                                            <div class="form-group">
                                                                <label>RFC | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Rfc">
                                                            </div>  
                                                            
                                                            <div class="form-group">
                                                                <label>Tipo de Identificación | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input sync_identificationType" id="sync_accredited1IdentificationType_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>  
                                                            
                                                            <div class="form-group">
                                                                <label>Id de Identificación | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1IdentificationId">
                                                            </div>                                                            
                                                            
                                                            <div class="form-group">
                                                                <label>Empresa | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Company">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Fecha de nacimiento | Acreditado 1</label>
                                                                <input type="text" class="form-control datepicker input-sm hubspot-input" id="sync_accredited1dateOfBirth" readonly>
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Lugar de nacimiento | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input sync_state" id="sync_accredited1PlaceOfBirth">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                
                                                            </div> 
                                                            <div class="form-group">
                                                                <label>Estado Civil | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input  sync_maritalStatus" id="sync_accredited1MaritalStatus_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                  
                                                            </div> 
                                                            <div class="form-group">
                                                                <label>Dirección | Calle y No. | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Street">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Dirección | Colonia | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1Neighborhood">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Dirección | Código Postal | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1PostalCode">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Dirección | Estado | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input sync_state" id="sync_accredited1State_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                 
                                                            </div>                                                                
                                                            <div class="form-group">
                                                                <label>Dirección | Municipio | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input sync_locality" id="sync_accredited1Locality_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                 
                                                            </div>     
                                                            <div class="form-group">
                                                                <label>Producto | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input sync_product" id="sync_accredited1BuyingProduct_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                 
                                                            </div>    
                                                            <div class="form-group">
                                                                <label>Especificar otro producto | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1BuyingProductOther">
                                                            </div>   
                                                            <div class="form-group">
                                                                <label>Ingresos Mensuales | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1MonthlyIncome">
                                                            </div>   
                                                            <div class="form-group">
                                                                <label>Mensualidad Máxima | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1MonthlyPay">
                                                            </div>           
                                                            <div class="form-group">
                                                                <label>Crédito de Auto? | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input" id="sync_accredited1CarCredit">
                                                                    <option value="">&nbsp;</option>
                                                                    <option value="0">No</option>
                                                                    <option value="1">Si</option>
                                                                </select>  
                                                            </div> 
                                                            <div class="form-group">
                                                                <label>Crédito Vigente? | Acreditado 1</label>
                                                                <select class="form-control input-sm hubspot-input" id="sync_accredited1CurrentCredit">
                                                                    <option value="">&nbsp;</option>
                                                                    <option value="0">No</option>
                                                                    <option value="1">Si</option>
                                                                </select>  
                                                            </div> 
                                                            <div class="form-group">
                                                                <label>No. Crédito | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited1CreditNumber">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Monto de crédito | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1CreditAmount">
                                                            </div>    
                                                            <div class="form-group">
                                                                <label>Saldo Subcuenta Vivienda | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1SubAccountAmount">
                                                            </div>
                                                            <div class="form-group">
                                                                <label>Gastos de Titulación | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1TitlingExpenses">
                                                            </div>         
                                                            <div class="form-group">
                                                                <label>Ahorro disponible | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1AvailableSavings">
                                                            </div>         
                                                            <div class="form-group">
                                                                <label>Presupuesto Vivienda | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1HouseBudget">
                                                            </div>      
                                                            <div class="form-group">
                                                                <label>Impuestos | Acreditado 1</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited1Taxes">
                                                            </div> 
                                                            <!-----------------------------------Accredited 2 infomation----------------------------------->
                                                            <div class="form-group contact-bg-1">
                                                                <label>Nombre | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Name">
                                                            </div>  
                                                            <div class="form-group contact-bg-1">
                                                                <label>Apellido Paterno | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2LastName">
                                                            </div>  
                                                            <div class="form-group contact-bg-1">
                                                                <label>Apellido Materno | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2SecondLastName">
                                                            </div>    
                                                            <div class="form-group contact-bg-1">
                                                                <label>Correo | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Email">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Teléfono | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Phone">
                                                            </div>          
                                                            <div class="form-group contact-bg-1">
                                                                <label>Sexo | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input sync_gender" id="sync_accredited2Gender_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>    
                                                            <div class="form-group contact-bg-1">
                                                                <label>CURP | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Curp">
                                                            </div>  
                                                            <div class="form-group contact-bg-1">
                                                                <label>NSS | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Nss">
                                                            </div>  
                                                            <div class="form-group contact-bg-1">
                                                                <label>RFC | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Rfc">
                                                            </div>  
                                                            
                                                            <div class="form-group contact-bg-1">
                                                                <label>Tipo de Identificación | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input sync_identificationType" id="sync_accredited2IdentificationType_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>
                                                            </div>  
                                                            
                                                            <div class="form-group contact-bg-1">
                                                                <label>Id de Identificación | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2IdentificationId">
                                                            </div>                                                            
                                                            
                                                            <div class="form-group contact-bg-1">
                                                                <label>Empresa | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Company">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Fecha de nacimiento | Acreditado 2</label>
                                                                <input type="text" class="form-control datepicker input-sm hubspot-input" id="sync_accredited2dateOfBirth" readonly>
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Lugar de nacimiento | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input sync_state" id="sync_accredited2PlaceOfBirth">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                
                                                            </div> 
                                                            <div class="form-group contact-bg-1">
                                                                <label>Estado Civil | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input  sync_maritalStatus" id="sync_accredited2MaritalStatus_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                  
                                                            </div> 
                                                            <div class="form-group contact-bg-1">
                                                                <label>Dirección | Calle y No. | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Street">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Dirección | Colonia | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2Neighborhood">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Dirección | Código Postal | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2PostalCode">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Dirección | Estado | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input sync_state" id="sync_accredited2State_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                 
                                                            </div>                                                                
                                                            <div class="form-group contact-bg-1">
                                                                <label>Dirección | Municipio | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input sync_locality" id="sync_accredited2Locality_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                 
                                                            </div>     
                                                            <div class="form-group contact-bg-1">
                                                                <label>Producto | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input sync_product" id="sync_accredited2BuyingProduct_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                 
                                                            </div>    
                                                            <div class="form-group contact-bg-1">
                                                                <label>Especificar otro producto | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2BuyingProductOther">
                                                            </div>   
                                                            <div class="form-group contact-bg-1">
                                                                <label>Ingresos Mensuales | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2MonthlyIncome">
                                                            </div>   
                                                            <div class="form-group contact-bg-1">
                                                                <label>Mensualidad Máxima | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2MonthlyPay">
                                                            </div>           
                                                            <div class="form-group contact-bg-1">
                                                                <label>Crédito de Auto? | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input" id="sync_accredited2CarCredit">
                                                                    <option value="">&nbsp;</option>
                                                                    <option value="0">No</option>
                                                                    <option value="1">Si</option>
                                                                </select>  
                                                            </div> 
                                                            <div class="form-group contact-bg-1">
                                                                <label>Crédito Vigente? | Acreditado 2</label>
                                                                <select class="form-control input-sm hubspot-input" id="sync_accredited2CurrentCredit">
                                                                    <option value="">&nbsp;</option>
                                                                    <option value="0">No</option>
                                                                    <option value="1">Si</option>
                                                                </select>  
                                                            </div> 
                                                            <div class="form-group contact-bg-1">
                                                                <label>No. Crédito | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm hubspot-input" id="sync_accredited2CreditNumber">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Monto de crédito | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2CreditAmount">
                                                            </div>    
                                                            <div class="form-group contact-bg-1">
                                                                <label>Saldo Subcuenta Vivienda | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2SubAccountAmount">
                                                            </div>
                                                            <div class="form-group contact-bg-1">
                                                                <label>Gastos de Titulación | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2TitlingExpenses">
                                                            </div>         
                                                            <div class="form-group contact-bg-1">
                                                                <label>Ahorro disponible | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2AvailableSavings">
                                                            </div>         
                                                            <div class="form-group contact-bg-1">
                                                                <label>Presupuesto Vivienda | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2HouseBudget">
                                                            </div>      
                                                            <div class="form-group contact-bg-1">
                                                                <label>Impuestos | Acreditado 2</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_accredited2Taxes">
                                                            </div> 
                                                            <!---------------------------------------------------------------------------------------------------------->                                                            
                                                            <div class="form-group">
                                                                <label>Producto Coacreditados</label>
                                                                <select class="form-control input-sm hubspot-input sync_productCoaccredited" id="sync_coacreditedBuyingProduct_Id">
                                                                    <option value="">&nbsp;</option>
                                                                </select>                                                                
                                                            </div> 
                                                            <div class="form-group">
                                                                <label>Presupuesto Coacreditados</label>
                                                                <input type="text" class="form-control input-sm input-money-data hubspot-input" id="sync_coacreditedBudget">
                                                            </div>                                                                                                                 
                                                        </form>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12 contact-data-action-button">
                                                        <span class="property-changes"></span>
                                                        <button type="button" class="btn btn-sm btn-success" id="syncContact" style="padding: 5px 12px;" disabled>Guardar <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <h4 class="panel-title">
                                                <a data-toggle="collapse" id="contactFilesContainerDisplay" data-parent="#accordion2" href="#collapseFiles" class="data-collapse-header collapsed">
                                                    Biblioteca
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseFiles" class="data-collapse-container panel-collapse collapse" style="height: 0px;">
                                            <div class="panel-body" style="padding:0px 10px 0px 10px;">
                                                <div class="row" style="min-height:70px; overflow-y: scroll;">
                                                    <div class="col-md-12" id="contactFilesContainer" style="padding-top:10px;">
                                                        <div style="text-align:center;"><img src="./images/loader.gif" style="width:48px;"></div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12 contact-data-action-button">
                                                        <input type="file" class="image-btn-go" id="fileContact-btn" style="display:none;"/>
                                                        <label for="fileContact-btn" class="btn btn-sm btn-success" id="addFile2Contact" style="padding: 5px 12px;">Agregar <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></label>
                                                    </div>
                                                </div>                                                        
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <?php
            include './php/wainboxModals.php';
        ?>

        <script src="./js/jquery-1.11.1.min.js"></script>
        <script src="./js/bootstrap.min.js"></script>
        <script src="./js/modernizr.min.js"></script>
        <script src="./js/moment.min.js"></script>
        <script src="./js/pace.min.js"></script>
        <script src="./js/retina.min.js"></script>
        <script src="./js/jquery.cookies.js"></script>
        <script src="./js/jquery-ui-1.10.3.min.js"></script>
        <script src="./js/select2.min.js"></script>
        <script src="./js/jquery.dataTables.min.js"></script>
        <script src="./js/jquery.gritter.min.js"></script>
        <script src="./js/custom.js"></script>
        <script src="./js/jquery.maskedinput.min.js"></script>
        <script src="./js/bootstrap-timepicker.min.js"></script>
        <script src="js/wainbox.script.js?v=0.0.0"></script>
        <script src="js/wainboxModals.script.js?v=0.0.0"></script>
        <script src="js/task.script.js?v=0.0.0"></script>
        <script>
            $(document).ready(function() { 
                jQuery('#startConversationInstance').select2();
                jQuery('#startConversationAdviser').select2();
                jQuery('#filterInstances').select2();
                jQuery('#scheduleMsgTime').timepicker({showMeridian: false});
                jQuery('#contactTaskTime').timepicker({showMeridian: false});
            });
        </script>
    </body>
</html>

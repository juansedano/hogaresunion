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
        <link href="css/contacts.css?v=0.0.0" rel="stylesheet" /> 
        <link href="css/modalLeftRight.css?v=0.0.0" rel="stylesheet" />
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
                            <h4 class="media-heading session-name" style="margin-top:10px;"><?php echo $userData['name']; ?></h4>
                            <small class="text-muted"><?php echo $userData['email']; ?></small>
                        </div>          
                    </div>
                    <?php
                        include './php/dynamicMenu.php';
                    ?>
                </div>

                <div class="mainpanel">
                    <div class="contentpanel">                  
                        <div class="row">
                            <div class="col-md-12" style="padding:0px 2px;" id="contactPanelContainer"> 
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="col-xs-6" style="padding:0px">
                                            <h4 class="panel-title" style="display:inline;">Contactos</h4>
                                        </div> 
                                    </div>
                                    <div class="panel-body" style="padding:10px;min-height:200px;">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <span id="contactsResultSize">Se encontraron 00 registros</span><br>
                                                <span>
                                                    <span class="show-records-per-page-container">25 registros por página</span>
                                                    <div class="records-per-page">
                                                        <label class="btn-block records-per-page-container" data-size="25">25 registros por página</label>
                                                        <label class="btn-block records-per-page-container" data-size="50">50 registros por página</label>
                                                        <label class="btn-block records-per-page-container" data-size="100">100 registros por página</label>
                                                    </div>        
                                                </span>                                          
                                            </div>  
                                            <div class="col-md-6" style="text-align:right">
                                                <button class="btn btn-success btn-bordered btn-sm" style="height:31px;">Importar</button>
                                                <button class="btn btn-success btn-sm" id="addContact">Crear Contacto</button>
                                            </div>  
                                        </div> 
                                        <div class="row">
                                            <div class="col-xs-12" style="padding:10px 10px 0px 10px;">
                                                <div  style="padding-right:8px;display:inline;float:inline-start;padding-top: 12px;">
                                                    <span class="contacts-filters conversion-status-filter">Estatus de la conversión<span class="fa fa-angle-down conversion-status-filter"></span><span class="fa fa-times remove-conversion-status-filter" style="color:red;cursor:pointer;display:none" data-toggle="tooltip" title="Eliminar selección"></span></span>
                                                    <div class="conversion-status-filter-container">
                                                        <span class="glyphicon glyphicon-search search-icon"></span>
                                                        <input class="form-control input-sm mb15 search-conversion-status-filter" type="text" placeholder="Buscar">
                                                    </div>        
                                                </div>    
                                                <div style="padding-right:8px;display:inline;float:inline-start;padding-top: 12px;">
                                                    <span class="contacts-filters contact-owner-filter">Propietario del contacto<span class="fa fa-angle-down contact-owner-filter"></span><span class="fa fa-times remove-contact-owner-filter" style="color:red;cursor:pointer;display:none" data-toggle="tooltip" title="Eliminar selección"></span></span>
                                                    <div class="contact-owner-filter-container">
                                                        <span class="glyphicon glyphicon-search search-icon"></span>
                                                        <input class="form-control input-sm mb15 search-contact-owner-filter" type="text" placeholder="Buscar">
                                                    </div>        
                                                </div>    
                                                <div style="padding-right:8px;display:inline;float:inline-start;padding-top: 12px;">
                                                    <span class="contacts-filters state-filter">Estado de interés<span class="fa fa-angle-down state-filter"></span><span class="fa fa-times remove-state-filter" style="color:red;cursor:pointer;display:none" data-toggle="tooltip" title="Eliminar selección"></span></span>
                                                    <div class="state-filter-container">
                                                        <span class="glyphicon glyphicon-search search-icon"></span>
                                                        <input class="form-control input-sm mb15 search-state-filter" type="text" placeholder="Buscar">
                                                    </div>        
                                                </div>        
                                                <div style="padding-right:8px;display:inline;float:inline-start;padding-top: 12px;">
                                                    <span class="contacts-filters locality-filter">Municipio de interés<span class="fa fa-angle-down locality-filter"></span><span class="fa fa-times remove-locality-filter" style="color:red;cursor:pointer;display:none" data-toggle="tooltip" title="Eliminar selección"></span></span>
                                                    <div class="locality-filter-container">
                                                        <span class="glyphicon glyphicon-search search-icon"></span>
                                                        <input class="form-control input-sm mb15 search-locality-filter" type="text" placeholder="Buscar">
                                                    </div>        
                                                </div>  
                                                <div style="padding-right:8px;display:inline;float:inline-start;padding-top: 12px;">
                                                    <span class="contacts-filters other-options-filter">Otros Filtros<span class="fa fa-angle-down other-options-filter"></span><span class="fa fa-times remove-other-options-filter" style="color:red;cursor:pointer;display:none" data-toggle="tooltip" title="Eliminar selección"></span></span>
                                                    <div class="other-options-filter-container">
                                                        <div class="checkbox block other-options-checkbox-container" name="favorite"><label class="other-options-checkbox-label"><input type="checkbox" class="other-options-checkbox" data-value="favorite"> Favoritos</label></div>
                                                    </div>        
                                                </div>                                                  
                                                <div style="display:inline;float:right;">
                                                    
                                                    <div class="form-group has-feedback" style="margin-bottom:0px;">
                                                        <input class="form-control input-sm" id="searchStringInput" type="text" style="width:200px;height:28px" placeholder="Nombre/Teléfono">
                                                        <span class="glyphicon glyphicon-search search-icon-txt"></span>
                                                    </div>


                                                </div>                                                                                                                                                                                                                                
                                            </div>  
                                        </div>                                                                 
                                        <div class="row" style="padding-top:10px;">           
                                            <div class="col-md-12">                
                                                <div class="col-md-12" style="overflow: auto;min-height:54px;padding: 0px;" id="contactsContainer">                                    
                                                    <table class="table table-striped table-bordered" style="margin-bottom: 0px;" id="affiliatesTable">
                                                        <thead>
                                                            <tr>                                                              
                                                                <th style="text-align:center;padding:6px;width:150px;min-width:36px;">...</th>  
                                                                <th style="text-align:center;padding:6px;width:290px;min-width:290px;">Nombre
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="2-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="2-desc"></span>                                                                        
                                                                    </span>                                                            
                                                                </th>                                                                                                                           
                                                                <th style="text-align:center;padding:6px;width:150px;min-width:120px;">Id Externo  
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="1-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="1-desc"></span>                                                                        
                                                                    </span>
                                                                </th>
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:150px;">Teléfono
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="3-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="3-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:250px;">Correo
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="4-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="4-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:200px;">Estatus de la conversión
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="5-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="5-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>    
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:200px;">Propietario del contacto
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="6-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="6-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>  
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:200px;">Estado de interés
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="7-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="7-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>    
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:200px;">Municipio de interés
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="8-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="8-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:130px;">F. Creación
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="9-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="9-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>  
                                                                <th style="text-align:center;padding:6px;width:250px;min-width:140px;">F. Modificación
                                                                    <span style="float: right;">
                                                                        <span class="fa fa-long-arrow-down sort-arrow" data-field="10-asc"></span>
                                                                        <span class="fa fa-long-arrow-up sort-arrow" data-field="10-desc"></span>                                                                        
                                                                    </span>                                                                   
                                                                </th>                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                                            </tr>
                                                        </thead>
                                                        <tbody id="affiliatesResult">
                                                            <tr>
                                                                <td colspan="11"><br><br></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="row">
                                            <div class="col-md-12" style="margin-top: 10px;" id="affiliatesResultPages">&nbsp;</div>
                                        </div>                                                                              
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="modal right fade" id="myModal2" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <!--<div style="background-color: #28292b !important;height: 62px !important; ">&nbsp;</div>-->
                    <!--<div style="background-color: #595959 !important;height: 5px !important; ">&nbsp;</div>-->
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color:#fff;"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Datos del Contacto</h4>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12" id="contacDataContainer" style="padding-top:10px;overflow:auto;">
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
                </div><!-- modal-content -->
            </div><!-- modal-dialog -->
        </div><!-- modal -->

        <input type="hidden" class="btn btn-info btn-lg" data-toggle="modal" data-target="#newContactModal" id="openNewContactModal" />
        <div class="modal fade" id="newContactModal" tabindex="-1" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header panel-heading">
                        <h4 class="panel-title">Alta de Contacto</h4>
                    </div>
                    <div class="modal-body" style="padding:0px !important;background-color:#f5f8fa">
                        <div id="startConversationContainer" style="padding:20px 20px;font-size:11px;">                    
                            <div class="row row-border-bottom">
                                <div class="col-md-6 col-modal-input">
                                    <input type="text" id="startConversationName" class="form-control input-sm input-modal-style" placeholder="Nombre(s) *">
                                </div>
                                <div class="col-md-6 col-modal-input">
                                    <input type="text" id="startConversationLastName" class="form-control input-sm input-modal-style" placeholder="Apellido[s) *">
                                </div>                            
                            </div>                                                                           
                            <div class="row row-border-bottom">
                                <div class="col-md-5 col-modal-input">
                                    <input type="text" id="startConversationPhone" class="form-control input-sm input-modal-style" placeholder="Teléfono *">
                                </div>  
                                <div class="col-md-7 col-modal-input">
                                    <input type="text" id="startConversationMail" class="form-control input-sm input-modal-style" placeholder="Correo">
                                </div>                                                    
                            </div>   
                            <div class="row row-border-bottom">
                                <div class="col-md-6 col-modal-input">
                                    <select class="mySelect2 width100p basic-select2" id="startConversationInstance">
                                        <option value="0">Selecciona una Instancia *</option>
                                    </select>
                                </div>                          
                                <div class="col-md-6 col-modal-input">
                                    <select class="mySelect2 width100p basic-select2" id="startConversationAdviser">
                                        <option value="0">Selecciona un Asesor *</option>
                                    </select>
                                </div>                                                    
                            </div>                                                          
                            <div class="row" style="padding:0px 20px;">
                                <div class="col-md-12" style="text-align:right;padding: 16px 6px 0px 6px;">
                                    <span class="new-contact-container-loader"><img src="./images/loader.gif" style="width:26px;"></span>
                                    <button data-dismiss="modal" id="startConversationCancel" class="btn btn-danger btn-sm" style="padding: 5px 8px;">Cerrar</button>
                                    <button class="btn btn-success btn-sm" id="startConversationGo" style="padding: 5px 8px;">Guardar <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                                </div>
                            </div>                                              
                        </div>                        
                    </div>
                </div>
            </div>
        </div>     
        
	        

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
        <script src="js/contacts.script.js?v=0.0.0"></script>
        <!--<script src="js/wainboxModals.script.js?v=0.0.0"></script>
        <script src="js/task.script.js?v=0.0.0"></script>-->
        <script>
            $(document).ready(function() {
                jQuery('#startConversationInstance').select2();
                jQuery('#startConversationAdviser').select2();
            });
        </script>
    </body>
</html>

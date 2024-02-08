<input type="hidden" class="btn btn-info btn-lg" data-toggle="modal" data-target="#startConversationModal" id="openStartConversationModal" />
<input type="hidden" class="btn btn-info btn-lg" data-toggle="modal" data-target="#imageModal" id="openImageModal" />
<input type="hidden" class="btn btn-info btn-lg" data-toggle="modal" data-target="#scheduleMessageModal" id="openScheduleMessageModal" />
<input type="hidden" class="btn btn-info btn-lg" data-toggle="modal" data-target="#contactTaskModal" id="openContactTaskModel" />
<input type="hidden" class="btn btn-info btn-lg" data-toggle="modal" data-target="#contactFavoriteModal" id="openContactFavoriteModal" />

<div class="modal fade" id="startConversationModal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header panel-heading">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                    <h4 class="panel-title" id="startConversationModalTittle">Registro de Contacto</h4>
                </div>
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
                    <div class="row row-border-bottom">
                        <div class="col-md-12" style="font-weight:bold;padding:6px 6px 0px 6px;">Mensaje al contacto:</div>
                        <div class="col-md-12" style="text-align:left;padding:0px 6px 0px 6px">
                            <textarea class="form-control textarea-modal-style" id="startConversationMessage" rows="3" placeholder="Escribe un mensaje inicial al contacto"></textarea>
                        </div>
                        <div class="col-md-12" style="text-align:right;font-weight:bold;padding:4px 6px 0px 6px;">
                            <input type="checkbox" id="startConversationMessageFlag" style="margin:0px 0px;" checked>   
                            <label class="checkbox-inline" style="padding:0px !important;padding:0px !important">Enviar mensaje</label>
                        </div>                            
                    </div>                            
                    <div class="row row-border-bottom">
                        <div class="col-md-12" style="font-weight:bold;padding:6px 6px 0px 6px;">Mensaje interno:</div>
                        <div class="col-md-12" style="text-align:left;padding:0px 6px 6px 6px">
                            <textarea class="form-control textarea-modal-style" id="startConversationInternalMsg" style="background-color:#d9edf7;" rows="3" placeholder="Escribe un mensaje interno"></textarea>
                        </div>
                    </div>      
                    <div class="row" style="padding:0px 20px;">
                        <div class="col-md-12" style="text-align:right;padding:6px">
                            <span class="new-contact-container-loader"><img src="./images/loader.gif" style="width:26px;"></span>
                            <button data-dismiss="modal" id="startConversationCancel" class="btn btn-danger btn-sm" style="padding: 5px 8px;">Cerrar</button>
                            <button class="btn btn-success btn-sm" id="startConversationGo" style="padding: 5px 8px;">Registrar <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                        </div>
                    </div>                                              
                </div>                        
            </div>
        </div>
    </div>
</div>     

<div class="modal fade" id="imageModal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header panel-heading">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                <h4 class="modal-title" id="sendImageTitle">&nbsp;</h4>
            </div>
            <div class="modal-body image-container">
                <div>
                    <img class="img-responsive img-responsive-height center-block" id="image2Send" src="#" data-source="#" data-type="#" data-name="#" alt="File to Send"/>
                </div>
                <div class="container-send-image" style="padding:8px 0px 0px 0px;width:100%">
                    <input type="text" id="imgAddionalComment" class="form-control input-sm" style="border-radius: 8px;" placeholder="Comentario (opcional)">
                </div>
                <div class="container-send-image" style="padding:8px 0px 0px 0px;width:100%;text-align:right;">
                    <span class="image-container-loader"><img src="./images/loader.gif" style="width:30px;"></span>
                    <button class="btn btn-success" id="sendImage" style="padding: 6px 14px 6px 12px;border-radius: 8px;" data-toggle="tooltip" title="Enviar"><img src="./images/icons/send.svg" class="send-button"></button>
                </div>
                <div class="container-save-image" style="padding:8px 0px 0px 0px;width:100%;text-align:center;">
                    <span class="image-container-loader"><img src="./images/loader.gif" style="width:30px;"></span>
                    <button class="btn btn-success" id="saveImage" style="padding: 6px 14px 6px 12px;border-radius: 4px;" data-toggle="tooltip" title="Enviar">Guardar Archivo <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                </div>                
            </div>
        </div>
    </div>
</div> 

<div class="modal fade" id="scheduleMessageModal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header panel-heading">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                <h4 class="modal-title">Mensajes Programados</h4>
            </div>
            <div class="modal-body" style="padding:0px !important;background-color:#f5f8fa">
                <div id="scheduleMessageContainer" style="padding:20px 20px;font-size:11px;">
                    <div style="padding:0px;font-size:12px;">
                        <div class="row row-border-bottom">
                            <div class="col-md-12" style="padding-bottom:12px;">
                                <span class="schedule-msg-name">{{name}}</span> <span class="schedule-msg-phone">{{phone&instance}}<span>
                            </div>
                        </div>
                        <div class="row row-border-bottom">
                            <div class="col-md-6" style="padding:6px;margin:0px !important;">
                                <select id="scheduleMsgTemplate" class="form-control input-sm basic-select">
                                    <option value="0">Selecciona un template...</option>
                                    <option value="comentario">Comentario</option> 
                                    <option value="pregunta">Pregunta</option>
                                </select>  
                            </div>
                        </div>   
                        <div class="row row-border-bottom">
                            <div class="col-md-12" style="font-weight:bold;padding:6px 6px 0px 8px;">Texto personalizado</div>
                            <div class="col-md-12" style="padding:6px;margin:0px !important;">
                                <textarea class="form-control textarea-modal-style" id="scheduleMsgCustomTxt" rows="3" placeholder="Ingresa un texto personalizado"></textarea>
                            </div>
                        </div>     
                        <div class="row row-border-bottom">
                            <div class="col-md-12" style="font-weight:bold;padding:6px 6px 0px 8px;">Mensaje al Cliente</div>
                            <div class="col-md-12" style="padding:6px;margin:0px !important;">
                                <textarea class="form-control textarea-modal-style" id="scheduleMsgOutput" rows="3" placeholder="Ingresa un texto personalizado" readonly>Este mensaje está previamente definido</textarea>
                            </div>
                        </div>      
                        <div class="row row-border-bottom">
                            <div class="col-md-12" style="font-weight:bold;padding:6px 6px 0px 8px;">Día y Hora</div>
                            <div class="col-xs-6 col-sm-4" style="padding:6px;margin:0px !important;">
                                <input type="text" class="form-control input-sm datepicker date-time-style" id="scheduleMsgDate" placeholder="dd/mm/aaaa" value="dd/mm/aaaa" autocomplete="off">
                            </div>
                            <div class="col-xs-6 col-sm-4" style="padding:6px;margin:0px !important;">
                                <div class="input-group">
                                    <div class="bootstrap-timepicker" style="margin:0px;">
                                        <input type="text" class="form-control input-sm  date-time-style" id="scheduleMsgTime" placeholder="hh:mm" autocomplete="off" onkeypress="return false;">
                                    </div>     
                                </div> 
                            </div>                        
                        </div>   
                        <div class="row" style="padding:0px 20px">
                            <div class="col-md-12" style="padding:6px;text-align:right;">
                                <span class="schedule-msg-container-loader"><img src="./images/loader.gif" style="width:26px;"></span>
                                <button data-dismiss="modal" class="btn btn-danger btn-sm" id="scheduleMsgClose" style="padding: 5px 8px;" data-toggle="tooltip" title="Cerrar">Cerrar</button>
                                <button class="btn btn-danger btn-sm" id="scheduleMsgCancel" style="padding: 5px 8px;" data-toggle="tooltip" title="Cancelar Mensaje">Cancelar</span> <span class="fa fa-angle-right" style="padding-left:4px;font-weight: 900;"></span></button>
                                <button class="btn btn-success btn-sm" id="scheduleMsgSave" style="padding: 5px 8px;" data-toggle="tooltip" title="Guardar"><span class="schedule-button-type">Programar</span> <span class="fa fa-angle-right" style="padding-left:4px;font-weight: 900;"></span></button>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>    

<div class="modal fade" id="contactTaskModal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header panel-heading">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                <h4 class="modal-title">Tareas</h4>
            </div>
            <div class="modal-body" style="padding:0px !important;background-color:#f5f8fa">
                <div class="row row-border-bottom-task" style="padding:20px 20px;font-size:11px;">
                    <div class="col-md-12" style="padding-bottom:12px;">
                        <span class="contact-task-name">{{name}}</span> <span class="contact-task-phone">{{phone&instance}}<span>
                    </div>
                </div>      

                <ul class="nav nav-tabs nav-justified">
                    <li><a href="#contactTaskContainer" data-toggle="tab" id="linkNewTask"><strong>Nueva</strong></a></li>
                    <li class="active"><a href="#contactTaskListContainer" data-toggle="tab" id="linkListTask"><strong>Actuales</strong></a></li>
                    <li><a href="#contactTaskDetailContainer" data-toggle="tab" id="linkDetailTask"><strong>Detalle</strong></a></li>
                </ul>

                <div class="tab-content mb30">
                    <div id="contactTaskContainer" class="tab-pane">
                        <div style="padding:0px;font-size:12px;">                                                   
                            <div class="row row-border-bottom">                       
                                <div class="col-md-12" style="padding:6px;margin:0px !important;">
                                    <select id="contactTaskType" class="form-control input-sm basic-select">
                                        <option value="0">Selecciona el tipo de tarea</option>
                                    </select>  
                                </div>                           
                            </div>   
                            <div class="row row-border-bottom">
                                <div class="col-md-12" style="padding:6px;margin:0px !important;">
                                    <textarea class="form-control textarea-modal-style" id="contactTaskDescription"  rows="3" placeholder="Descripción/Motivo de la tarea"></textarea>
                                </div>
                            </div>                             
                            <div class="row row-border-bottom">
                                <div class="col-md-12" style="font-weight:bold;padding:6px 6px 0px 8px;">Fecha de vencimiento:</div>
                                <div class="col-xs-6 col-sm-4" style="padding:6px;margin:0px !important;">
                                    <input type="text" class="form-control input-sm datepicker date-time-style" id="contactTaskDate" placeholder="dd/mm/aaaa" value="dd/mm/aaaa" autocomplete="off" readonly>
                                </div>
                                <div class="col-xs-6 col-sm-4" style="padding:6px;margin:0px !important;">
                                    <div class="input-group">
                                        <div class="bootstrap-timepicker" style="margin:0px;">
                                            <input type="text" class="form-control input-sm  date-time-style" id="contactTaskTime" placeholder="hh:mm" autocomplete="off" readonly>
                                        </div>     
                                    </div> 
                                </div>                                             
                            </div>  
                            <div class="row" style="padding:0px 20px">
                                <div class="col-md-12" style="text-align:right;padding:6px">
                                    <span class="contact-task-container-loader"><img src="./images/loader.gif" style="width:26px;"></span>
                                    <button data-dismiss="modal" id="contactTaskClose" class="btn btn-danger btn-sm" style="padding: 5px 8px;">Cerrar</button>
                                    <button class="btn btn-success btn-sm" id="contactTaskSave" style="padding: 5px 8px;">Agregar <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="contactTaskListContainer" class="tab-pane active">
                        <table class="table mb30">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tipo de tarea</th>
                                    <th>Expira</th>
                                    <th>Ultima actividad</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="taskList" class="table-hover"></tbody>
                        </table>
                    </div>

                    <div id="contactTaskDetailContainer" class="tab-pane">
                        <div id="taskLoader" class="text-center" style="display: none;"><img src="./images/loader.gif" style="width: 48px;"></div>

                        <div id="noTaskSelected" class="text-center"><h4>Selecciona una tarea</h4></div>

                        <div id="taskSelected" style="padding:0px;font-size:12px;display: none;">
                            <div class="row row-border-bottom" style="padding-top: 10px;padding-bottom: 5px;">
                                <div class="col-sm-3">
                                    <b>Tipo de tarea: </b><p id="taskType">Contactar</p>
                                </div>
                                <div class="col-sm-9">
                                    <b>Descripcion: </b><p id="taskDescription">Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque officiis necessitatibus culpa inventore id cum, soluta cupiditate quae quod! Necessitatibus quis est rem iste ab sint libero quibusdam nemo blanditiis?</p>
                                </div>
                            </div>

                            <div class="row row-border-bottom" style="padding-top: 10px;padding-bottom: 5px;">
                                <div class="col-md-12"><b>Fecha de vencimiento:</b></div>
                                <div class="col-xs-6 col-sm-4">
                                    <input type="text" class="form-control input-sm datepicker date-time-style" id="taskDate" placeholder="dd/mm/aaaa" value="dd/mm/aaaa" autocomplete="off" disabled>
                                </div>
                                <div class="col-xs-6 col-sm-4">
                                    <div class="input-group">
                                        <div class="bootstrap-timepicker">
                                            <input type="text" class="form-control input-sm date-time-style" id="taskTime" placeholder="hh:mm" autocomplete="off" disabled>
                                        </div>     
                                    </div> 
                                </div>
                                <div class="col-xs-12 col-sm-4">
                                    <button class="btn btn-xs btn-success btn-block" id="updateTaskDate" style="display: none;" disabled>Actualizar</button>
                                    <button class="btn btn-xs btn-info btn-block" id="rescheduleTask">Reprogramar</button>
                                </div>                                        
                            </div>

                            <div class="row row-border-bottom" style="padding-top: 10px;padding-bottom: 5px;" id="notesContainer">
                                <b>Notas</b>
                                <div class="col-md-12" style="padding: 10px;border: 1px solid #ccc;border-radius: 8px;margin-bottom: 10px;background-color: #e9e9e9;overflow-y: scroll;height: 225px;" id="taskNotes">
                                </div>
                                <div class="col-md-12">
                                    <textarea name="noteText" id="noteText" style="resize: none;padding: 10px;width: 100%;height: 75px;border-radius: 8px;border: 1px solid #ccc;overflow-y: auto;" placeholder="Puesdes arrastrar o pegar un archivo aqui para agregarlo"></textarea>
                                </div>
                            </div>

                            <div class="row row-border-bottom" style="padding-top: 10px;padding-bottom: 5px;display: none;" id="taskUploaderContainer">
                                <div class="col-xs-12" style="padding: 10px;border: 1px solid #ccc;border-radius: 8px;margin-bottom: 10px;height: 250px;text-align: center;" id="uploaderTask"></div>
                                <div class="col-sm-2"></div>
                                <div class="col-sm-4"><button class="btn btn-success btn-block" id="addTaskUploader">Agregar</button></div>
                                <div class="col-sm-4"><button class="btn btn-danger btn-block" id="cancelTaskUploader">Cancelar</button></div>
                            </div>

                            <div class="row" style="padding-top: 10px;">
                                <div class="col-xs-3"></div>
                                <div class="col-xs-6"><button class="btn btn-success btn-block" id="finishTask" disabled>Concluir tarea</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="contactFavoriteModal" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header panel-heading">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button">&times;</button>
                <h4 class="modal-title">Favoritos</h4>
            </div>
            <div class="modal-body" style="padding:0px !important;background-color:#f5f8fa">
                <div id="contactFavoriteContainer" style="padding:20px 20px;font-size:11px;">
                    <div style="padding:0px;font-size:12px;">
                        <div class="row row-border-bottom">
                            <div class="col-md-12" style="padding-bottom:12px;">
                                <span class="contact-favorite-name">{{name}}</span> <span class="contact-favorite-phone">{{phone&instance}}<span>
                            </div>
                        </div>  
                        <div class="row row-border-bottom">
                            <div class="col-md-12" style="padding:6px;margin:0px !important;">
                                <textarea class="form-control textarea-modal-style" id="contactFavoriteComment"  rows="3" placeholder="Comentario"></textarea>
                            </div>
                        </div>                                                    
                        <div class="row" style="padding:0px 20px">
                            <div class="col-md-12" style="text-align:right;padding:6px">
                                <span class="contact-favorite-container-loader"><img src="./images/loader.gif" style="width:26px;"></span>
                                <button data-dismiss="modal" id="contactFavoriteClose" class="btn btn-danger btn-sm" style="padding: 5px 8px;">Cerrar</button>
                                <button class="btn btn-success btn-sm" id="contactFavoriteSave" style="padding: 5px 8px;">Añadir a favoritos <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>  
/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    config.uiColor = '#dddddd';

    // Define the size of the editor
    // config.height = 550; // altura 
    config.width = '100%'; // ancho

    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
    ];

    // Remove some buttons, provided by the standard plugins, which we don't
    // need to have in the Standard(s) toolbar.
    // config.removeButtons = 'Underline,Subscript,Superscript';
    // config.removeButtons = 'Source,Flash,Iframe,About';
    config.removeButtons = 'Source,Save,NewPage,Preview,Templates,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Flash,ShowBlocks,About';

    // Se the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

    // Make dialogs simpler.
    config.removeDialogTabs = 'image:advanced;link:advanced';

    // Custom Skin
    config.skin = 'moono-lisa';
    config.extraPlugins = 'uploadimage,uploadfile,openlink,uploadwidget,widget,clipboard,notification,tableresize,uicolor,emojione,contextmenu,tabletools,menu,floatpanel,panel,dialogadvtab,tabletoolstoolbar,youtube';

    // config.skin = 'icy_orange';

    // config.extraPlugins = 'print,format,font,colorbutton,justify,uploadimage';'easyimage,autocomplete,textmatch,ajax,panelbutton,floatpanel,emoji'
    // config.uploadUrl = '../upload.php?CKEditorFuncNum=0';

    // Configure your file manager integration. This example uses CKFinder 3 for PHP.
    config.filebrowserBrowseUrl = 'https://localhost/smarto/tratodirecto/dev/tratodirecto.com-desarrolladores/taskManagement.php';
    // config.filebrowserImageBrowseUrl = 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images';
    // config.filebrowserUploadUrl = 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files';
    config.filebrowserUploadUrl = 'php/uploadImage.php?';
    // config.filebrowserUploadUrl = '../upload.php?';
    config.filebrowserUploadMethod  = "form";
    // config.filebrowserImageUploadUrl = 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images';

    config.dialog_backgroundCoverColor = '#000';
    config.dialog_backgroundCoverOpacity = 0.65;
    config.resize_enabled = false;
};
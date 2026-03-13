const _title = "Sandbox Tools";
const _formid = "Sandbox-Tools";
import { SystemSettingsForm } from "./system-settings-form.js";
//import { DropDownMenu } from "./dropdownmenu.js";
import { auxMeth } from "./auxmeth.js";
import {SandboxSearchForm} from "./sb-search-form.js";
import { sb_custom_dialog_confirm} from "./sb-custom-dialogs.js";


export class SandboxToolsForm extends FormApplication {

  static initialize() {

    console.log('Initialized ' + _title);
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;
    const overrides = {
      classes: ["sandbox", "sandboxtools"],
      height: 'auto',
      width: 'auto',
      id: _formid,
      template: `systems/sandbox/templates/sb-tools-form.hbs`,
      title: _title,
      userId: game.userId,
      closeOnSubmit: false, // do not close when submitted
      submitOnChange: false, // submit when any input changes 
      resizable: true
    };
    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
    return mergedOptions;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('#sb-btn-show-sandbox-settings').click(this._onDisplay_Sandbox_Settings.bind(this));
    html.find('#sb-tools-btn-show-json-export').click(this._onDisplay_Sandbox_JSON_Export.bind(this));
    html.find('#sb-tools-btn-show-json-import').click(this._onDisplay_Sandbox_JSON_Import.bind(this));   
    html.find('#sb-tools-btn-show-build-actor-templates').click(this._onDisplay_Sandbox_BuildTemplates.bind(this)); 
    html.find('#sb-tools-btn-show-reload-actors').click(this._onDisplay_Sandbox_ReloadActors.bind(this)); 
    html.find('#sb-tools-btn-show-replace-all-missing-images').click(this._onDisplay_Sandbox_ReplaceMissingImages.bind(this)); 
    html.find('#sb-tools-btn-show-delete-all').click(this._onDisplay_Sandbox_DeleteAll.bind(this));
    html.find('#sb-tools-btn-show-search').click(this._onDisplay_Sandbox_Search.bind(this));
    html.find('#sb-tools-btn-show-check-consistency').click(this._onDisplay_Sandbox_CheckConsistency.bind(this));                  
  }


  getData(options) {
    let data;
    data = {
      submenus: {
        BUILD_ACTOR_TEMPLATES: {
          id: 'sb-tools-btn-show-build-actor-templates',
          name: 'SANDBOX.SystemMenu.BuildActorTemplates.Caption',
          hint: 'SANDBOX.SystemMenu.BuildActorTemplates.Tooltip',
          icon: 'fas fa-rotate',  
          display: true,
          indevelopment: false
        },
        RELOAD_ACTORS: {
          id: 'sb-tools-btn-show-reload-actors',
          name: 'SANDBOX.SystemMenu.ReloadActors.Caption',
          hint: 'SANDBOX.SystemMenu.ReloadActors.Tooltip',
          icon: 'fas fa-arrow-alt-circle-down',  
          display: true,
          indevelopment: false
        },
        CHECK_CONSISTENCY: {
          id: 'sb-tools-btn-show-check-consistency',
          name: 'SANDBOX.SystemMenu.CheckConsistency.Caption',
          hint: 'SANDBOX.SystemMenu.CheckConsistency.Tooltip',
          icon: 'fas fa-spell-check',  
          display: true,
          indevelopment: false
        },
        JSON_EXPORT: {
          id: 'sb-tools-btn-show-json-export',
          name: 'JSON Export',
          hint: 'Run JSON Export tool',
          icon: 'fas fa-file-export',
          display: true,
          indevelopment: false
        },
        JSON_IMPORT: {
          id: 'sb-tools-btn-show-json-import',
          name: 'JSON Import',
          hint: 'Run JSON Import tool',
          icon: 'fas fa-file-import',
          display: true,
          indevelopment: false
        },
        SEARCH: {
          id: 'sb-tools-btn-show-search',
          name: 'Sandbox Search',
          hint: 'Run Search tool',
          icon: 'fas fa-magnifying-glass',
          display: true,
          indevelopment: false
        },
        REPLACE_ALL_MISSING_IMAGES: {
          id: 'sb-tools-btn-show-replace-all-missing-images',
          name: 'SANDBOX.SystemMenu.ReplaceMissingImages.Caption',
          hint: 'SANDBOX.SystemMenu.ReplaceMissingImages.Tooltip',
          icon: 'fas fa-solid fa-image-slash',  
          display: true,
          indevelopment: false
        },
        DELETE_ALL: {
          id: 'sb-tools-btn-show-delete-all',
          name: 'Delete All',
          hint: 'Deletes all game actors and items and their respective folders not in compendiums',
          icon: 'fas fa-dumpster',
          display: true,
          indevelopment: false
        }

      }
    };
    return data;
  }
  

  _onDisplay_Sandbox_Search(event) {
    event.preventDefault();
    let f = new SandboxSearchForm();
    f.render(true,{focus:true});
  }
  
  _onDisplay_Sandbox_Settings(event) {
    event.preventDefault();
    let f = new SystemSettingsForm();
    f.render(true,{focus:true});
  }

  _onDisplay_Sandbox_JSON_Export(event) {
    event.preventDefault();
    auxMeth.exportBrowser();
  }

  _onDisplay_Sandbox_JSON_Import(event) {
    event.preventDefault();
    auxMeth.getImportFile();
  }

  async _onDisplay_Sandbox_BuildTemplates(){
    // get user confirmation to proceed
    let prompttitle = game.i18n.localize("SANDBOX.SystemMenu.BuildActorTemplates.Caption") + "?";
    let promptbody = game.i18n.localize("SANDBOX.SystemMenu.BuildActorTemplates.Tooltip") + "?";    
    let answer = await sb_custom_dialog_confirm(prompttitle, promptbody, game.i18n.localize("Yes"), game.i18n.localize("No")); 
    if (answer){
      let api=game.system.api;
      api.BuildActorTemplates();  
    }
  }
  
  async _onDisplay_Sandbox_CheckConsistency(){
    // get user confirmation to proceed
    let prompttitle = game.i18n.localize("SANDBOX.SystemMenu.CheckConsistency.Caption") + "?";
    let promptbody = game.i18n.localize("SANDBOX.SystemMenu.CheckConsistency.Tooltip") + "?";    
    let answer = await sb_custom_dialog_confirm(prompttitle, promptbody, game.i18n.localize("Yes"), game.i18n.localize("No")); 
    if (answer){
      let api=game.system.api;
      api.CheckcItemConsistency();
    }
  }
  
  async _onDisplay_Sandbox_ReplaceMissingImages(){
    // get user confirmation to proceed
    let prompttitle = game.i18n.localize("SANDBOX.SystemMenu.ReplaceMissingImages.Caption") + "?";
    let promptbody = game.i18n.localize("SANDBOX.SystemMenu.ReplaceMissingImages.Tooltip") + "?";
    let answer = await sb_custom_dialog_confirm(prompttitle, promptbody, game.i18n.localize("Yes"), game.i18n.localize("No"));
    if (answer){
      let api = game.system.api;
      await api.replaceAllMissingImages();
    }
  }
  
  async _onDisplay_Sandbox_ReloadActors(){
    // get user confirmation to proceed
    let prompttitle = game.i18n.localize("SANDBOX.SystemMenu.ReloadActors.Caption") + "?";
    let promptbody = game.i18n.localize("SANDBOX.SystemMenu.ReloadActors.Tooltip") + "?";
    let answer = await sb_custom_dialog_confirm(prompttitle, promptbody, game.i18n.localize("Yes"), game.i18n.localize("No"));
    if (answer){
      let api = game.system.api;
      await api.ReloadActorsFromTemplate();
    }
  }
  
  _onDisplay_Sandbox_DeleteAll(){
    let api=game.system.api;
    api._deleteAll();    
  }
  
  

}
;




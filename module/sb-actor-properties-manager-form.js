import { auxMeth } from "./auxmeth.js";
import  { getSandboxItemIconFile } from "./sb-itemsheet-helpers.js";
import { sb_add_icon_to_dialog,sb_custom_dialog_confirm
       } from "./sb-custom-dialogs.js";
export class SandboxActorPropertiesManagerForm extends FormApplication {
  data={
    actor:{
      id:null,
      name:null
    },
    token:{
      id:null,
      name:null
    },
    compendium:{
      type:null,
      name:null
    }
  }
  
  constructor(options) { 
    if(options.token.id){
      super(options, { title: `Token Actor Properties Manager` });
    } else if(options.compendium.type){
      super(options, { title: `Compendium Actor Properties Manager` });
    } else{
      super(options);
    }
    
    
    this.data.actor.id=options.actor.id || null; 
    this.data.actor.name=options.actor.name || null;
    this.data.token.id=options.token.id || null; 
    this.data.token.name=options.token.name || null;
    this.data.compendium.type=options.compendium.type || null;
    this.data.compendium.name=options.compendium.name || null;
    
  }
  static initialize() {

  }   

  static get defaultOptions() { 
    
    const defaults = super.defaultOptions; 
    const overrides = {
      
      classes: ["sb-actor-properties-manager-form","sandbox"],
      height:0,
      id: 'sb-actor-properties-manager-form',
      template: `systems/sandbox/templates/sb-actor-properties-manager-form.hbs`,
      title: `Actor Properties Manager`,
      userId: game.userId,
      closeOnSubmit: false, // do not close when submitted
      submitOnChange: false, // submit when any input changes 
      resizable: true,
      width: 800,
      editable:false
    };
    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
    return mergedOptions;
  } 
  
  activateListeners(html) {
    super.activateListeners(html);
    html.find('.sb-actor-properties-manager-delete-property').click(this._deleteProperty.bind(this));

  }
  
  async getData(options) {    
    let data;
    let actor;
    
    let isTokenActor=false;
    let isCompendiumActor=false;
    if(this.data.compendium.type==null && this.data.compendium.name==null){
      if(this.data.token.name ==null && this.data.token.id==null){
        // normal actor
        actor=game.actors.get(this.data.actor.id);
      } else {        
        let token = canvas.tokens.placeables.find(y=>y.id==this.data.token.id); 
        actor=token.actor;
        isTokenActor=true;
        
      }
    } else {
      const pack=game.packs.get(this.data.compendium.type + "." + this.data.compendium.name);
      actor = await pack.getDocument(this.data.actor.id);
      isCompendiumActor=true;
    }
    let rows=``;
    let property;
    let sortedKeys = await Object.keys(actor.system.attributes).sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
      });
    let propertyKey;  
    let attribute;
    let created;
    let createdBycItem='';
    let tblIcon='';
    let tblKey='';
    let tblName='';
    let tblDatatype='';
    let tblCreatedByName='';
    let tblCreatedByIcon='';
    let tblRemarks='';
    let tblManipulator='';
    let tblMarkRowRed='';
    let tblValue='';
    let tblAttributes='';
    let templateActor=await game.actors.find(y => y.system.istemplate && y.system.gtemplate == actor.system.gtemplate);
    for (let i = 0; i < sortedKeys.length; i++) {
      propertyKey=await sortedKeys[i];
      attribute=actor.system.attributes[propertyKey];
      property=await auxMeth.getTElement(attribute.id, 'property', propertyKey);
      tblIcon='';
      
      tblName='';
      tblDatatype='';
      tblCreatedByName='';
      tblCreatedByIcon='';
      tblRemarks='';
      tblManipulator='';
      tblKey=propertyKey;
      tblMarkRowRed='';
      tblValue='';
      tblAttributes='';
      if(property!=null){
        tblIcon=`<img class="sb-item-list-icon" src="${property.img}"/>`;        
        tblName=property.name;
        tblDatatype=property.system.datatype;
        tblCreatedByName=actor.system.gtemplate;
        if(property.system.auto!=''){
          let sErr='';
          switch(tblDatatype){
            case 'table':
            case 'textarea': 
            case 'label':
            case 'button':
            case 'list':
              sErr='<i class="fas fa-triangle-exclamation" data-tooltip="This datatype should not have a Auto"></i>';
              break;
            default:
              break;
          }
          tblAttributes +=`<i class="fas fa-code " data-tooltip="Auto Attribute:<br>${property.system.auto}"></i>${sErr} `;
        }
        if(property.system.automax!=''){ //<i class="fa-sharp fa-regular fa-arrow-up-to-line"></i>
          tblAttributes +=`<i class="fas fa-arrow-up-to-line " data-tooltip="Max Attribute:<br>${property.system.automax}"></i>`;
        }
        
        if(property.system.listoptions!=''){
          tblAttributes +=`<i class="fas fa-list" data-tooltip="List Attribute:<br>${property.system.listoptions}"></i> `;
        }
        
        if(templateActor!=null){
          tblCreatedByIcon= `<img class="sb-item-list-icon" src="${templateActor.img}"/>`; 
        } else {
          let iconfile = getSandboxItemIconFile('mystery-man');              
          tblCreatedByIcon= `<img class="sb-item-list-icon" src="${iconfile}"/>`;
          
        }
        tblManipulator=`<i data-tooltip="Remove property from actor" class="sb-btn sb-actor-properties-manager-delete-property fas fa-trash"></i>`;
      } else{
        // not found
        // check if created
        created=false;
        if(attribute.hasOwnProperty('created')){
          if(attribute.created){
            created=true;
            tblCreatedByName='Unknown cItem';
          }
        }
        
        if(attribute.hasOwnProperty('id')){
          if(attribute.id.match(/_\d+/g) != null){
            created=true;
            // try to get the citem created
            let id=attribute.id.slice(0, attribute.id.lastIndexOf('_'));
            let cItem=game.items.get(id);
            
            
            if(cItem!=null){
              tblCreatedByName=cItem.name;
              tblCreatedByIcon= `<img class="sb-item-list-icon" src="${cItem.img}"/>`;                     
            } else {
              tblCreatedByName='Unknown cItem';
              let iconfile = getSandboxItemIconFile('unknown');              
              tblCreatedByIcon= `<img class="sb-item-list-icon" src="${iconfile}"/>`;  
            }
          }
        }
                                        
        if(created ){         
          let iconfile = getSandboxItemIconFile('property','created');
          tblIcon=`<img class="sb-item-list-icon" src="${iconfile}"/>`;
          tblDatatype=`created`;
        } else {
          // abandoned
          let iconfile = getSandboxItemIconFile('missing');
          tblIcon=`<img class="sb-item-list-icon" src="${iconfile}"/>`;
          tblMarkRowRed=`class="sb-table-scrollable-table-tbody-tr-error"`;
          tblRemarks=`Property not found in game database`;          
        }
        
        
        tblManipulator=`<i data-tooltip="Remove property from actor" class="sb-btn sb-actor-properties-manager-delete-property fas fa-trash"></i>`;
      }
      if(attribute.hasOwnProperty('value')){
          tblValue=attribute.value;
      }
      rows +=`<tr ${tblMarkRowRed} data-propertykey="${tblKey}"><td class="sb-table-scrollable-table-tbody-td-icon">${tblIcon}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text sb-table-scrollable-table-tbody-td-key">${tblKey}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text">${tblName}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text">${tblDatatype}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text sb-table-scrollable-table-tbody-td-attributes">${tblAttributes}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text sb-table-scrollable-table-tbody-td-value">${tblValue}</td>      
                  <td class="sb-table-scrollable-table-tbody-td-icon">${tblCreatedByIcon}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text">${tblCreatedByName}</td>
                  <td class="sb-table-scrollable-table-tbody-td-text">${tblRemarks}</td>
                  <td class="sb-table-scrollable-table-tbody-td-manipulator">${tblManipulator}</td>
                </tr>`;
    }   
          
    data={
      actor:this.data.actor,
      token:this.data.token,      
      compendium:this.data.compendium,
      iscompendiumactor:isCompendiumActor,
      istokenactor:isTokenActor,
      rows:rows
    };
    return data;
  }  
  
  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);
    console.log(expandedData);

  }
  
  async _deleteProperty(event) {
    let thisRow = event.target.parentNode.parentNode;
    let propertyKey = thisRow.getAttribute("data-propertykey");
    let actorId = document.getElementById("sb-actor-properties-manager-actor-id")?.value;
    let tokenId = document.getElementById("sb-actor-properties-manager-token-id")?.value;
    let compendiumType = document.getElementById("sb-actor-properties-manager-compendium-type")?.value;
    let compendiumName = document.getElementById("sb-actor-properties-manager-compendium-name")?.value;
    let api = game.system.api;
    let selectedActor;
    let actortype = '';
    if (compendiumType != null && compendiumName != null) {
      // a compendium
      const pack = game.packs.get(compendiumType + "." + compendiumName);
      selectedActor = await pack.getDocument(actorId);
      actortype = 'compendium ';
    } else {
      // not a compendium
      if (tokenId == null) {
        // normal actor
        selectedActor = game.actors.get(actorId);
      } else {
        // token actor
        let token = canvas.tokens.placeables.find(y => y.id == tokenId);
        if (token != null) {
          selectedActor = token.actor;
          actortype = 'token ';
        }
      }
    }
    if (selectedActor != null) {
      let prompttitle = game.i18n.format("SANDBOX.ConfirmRemoveActorProperty_Title", {actortype: actortype});
      let promptbody = game.i18n.format("SANDBOX.ConfirmRemoveActorProperty_Body", {propertykey: propertyKey, actorname: selectedActor.name, actortype: actortype});
      let answer = await this._confirmDeleteProperty(prompttitle, promptbody, game.i18n.localize("Yes"), game.i18n.localize("No"));      
      switch (answer) {
        case 0:
          break;
        case 1:
          await api.ActorProperty_RemoveProperty(selectedActor, propertyKey);
          this.render();
          break;
        case 2:          
          // ask user again
          prompttitle= game.i18n.localize("SANDBOX.RemovePropertyFromAllActorsLabel") + "?";
          promptbody = game.i18n.localize("SANDBOX.RemovePropertyFromAllActorsTooltip") + "?";
          answer=await sb_custom_dialog_confirm(prompttitle,promptbody,game.i18n.localize("Yes"),game.i18n.localize("No"));  
          if (answer){                      
            console.log(`Actor Properties manager | Removing property ${propertyKey} from all actors`);
            let allActors=game.actors;
            for(let actor of allActors){
              await api.ActorProperty_RemoveProperty(actor, propertyKey);
            }            
          } else{
            await api.ActorProperty_RemoveProperty(selectedActor, propertyKey);
          }
          this.render();
         break;
        default:
          
          break;
      }
      if (answer) {
        
      }
    }
  }
  
  async _confirmDeleteProperty(sTitle,sQuestion,answerOneCaption='Ok',answerTwoCaption='Cancel'){
  let dialogid='sb-custom-dialog-confirm-' + foundry.utils.randomID();
  let allCheckbox=`<br><p><span class="sb-align-vertical"><input type="checkbox" id="${dialogid}-remove-for-all" data-tooltip="${game.i18n.localize("SANDBOX.RemovePropertyFromAllActorsTooltip")}">
<label for="${dialogid}-remove-for-all"> ${game.i18n.localize("SANDBOX.RemovePropertyFromAllActorsLabel")}</label></span></p>`;
  let dialog=new Promise((resolve,reject)=>{
    new Dialog({
      title: sTitle,
      content: `<span id="${dialogid}"></span>` + sQuestion + allCheckbox ,
      buttons: {
        ok: {
          icon:'<i class ="fas fa-check"></i>',
          label: answerOneCaption,           
          callback: () => {
            // get checkbox
            let chk = document.getElementById(`${dialogid}-remove-for-all`);
            if(chk!=null){
              if (chk.checked) resolve(2);
            }
            resolve(1);
          }
        },        
        cancel: { 
          icon:'<i class ="fas fa-times"></i>',
          label: answerTwoCaption,            
          callback: () => {resolve(0);}
        }
      },
      default: "ok",
      render:()=>{
        // set icon in dialog title
        sb_add_icon_to_dialog(dialogid,'far fa-circle-question');
      },      
      close:  () => {resolve(false); }   
    }).render(true);             
  }); 
  let answer=await dialog;
  return answer;    
 }
  
}


import { SBOX } from "./config.js";
import { auxMeth } from "./auxmeth.js";

export class gItem extends Item {
  
  
    prepareData() {
      //console.log("Sandbox.gItem.prepareData | id:" + this.id);
      if(this.type == "cItem"){
        //console.log("Sandbox | prepareData | ciKey:" + this.system.ciKey + " id:" + this.id);
      }
        super.prepareData();

        // Get the Actor's data object
        const itemData = this;
        const data = itemData.system;
        const flags = itemData.flags;

        if (!foundry.utils.hasProperty(data.attributes, "name") && itemData.type == "cItem") {
            foundry.utils.setProperty(data.attributes, "name", itemData.name);
        }
        if (!foundry.utils.hasProperty(flags, "scrolls")) {
            foundry.utils.setProperty(flags, "scrolls", {});
        }

    }

    //Overrides update method
    async update(data, options = {}) {
      
      //console.log("Sandbox.gItem.update | id:" + this.id,data,options);
      if(this.type == "cItem"){
        //console.log("Sandbox | update | ciKey:" + this.system.ciKey);
      }
        //console.log(data);
        //console.log(options);
        // Get the Actor's data object
        return super.update(data, options);

    }

    async _preUpdate(updateData, options, userId) {
      
      //console.log("Sandbox.gItem._preUpdate | id:" + this.id,updateData,options);
        if(this.type == "cItem"){
          //console.log("Sandbox | _preUpdate | ciKey:" + this.system.ciKey );
        }
        
        if (updateData.name) {
            //foundry.utils.setProperty(updateData, "system", {});
            foundry.utils.setProperty(updateData.system, "attributes", {});
            foundry.utils.setProperty(updateData.system.attributes, "name", updateData.name);
            //console.log(updateData);
        }
    }

  async _preCreate(createData, options, userId) {
    //console.log("Sandbox.gItem._preCreate | id:" + this.id,createData,options);
    await super._preCreate(createData, options, userId);
    let image = "";        
    if (this.img == 'icons/svg/item-bag.svg') {
      if (this.type == "cItem") {
        image = "systems/sandbox/styles/icons/itemtypes/sb_item_citem.svg";
      }
      if (this.type == "sheettab") {
        image = "systems/sandbox/styles/icons/itemtypes/sb_item_sheettab.svg";
      }
      if (this.type == "group") {
        image = "systems/sandbox/styles/icons/itemtypes/sb_item_group.svg";
      }
      if (this.type == "panel") {
        image = "systems/sandbox/styles/icons/itemtypes/sb_item_panel.svg";
      }
      if (this.type == "multipanel") {
        image = "systems/sandbox/styles/icons/itemtypes/sb_item_multipanel.svg";
      }
      if (this.type == "lookup") {
        image = "systems/sandbox/styles/icons/itemtypes/sb_item_lookup.svg";
      }
      if (this.type == "property") {
        //image = "systems/sandbox/styles/icons/itemtypes/sb_item_property.svg";
        // since simpletext is deafult use that icon
        image="systems/sandbox/styles/icons/propertytypes/sb_property_simpletext.svg";
      }
      if (image != ""){
        this.updateSource({ "img": image });
      }
    }

    if (createData.type == "cItem")
      if (createData.system != null)
        if (createData.system.ciKey != null)
          if (createData.system.ciKey != "") {
            let is_here = game.items.filter(y => Boolean(y.system.ciKey)).find(y => y.system.ciKey == createData.system.ciKey && y.name != createData.name);
            if (is_here) {
              console.log("Sandbox | _preCreate | reset ciKey:" + createData.system.ciKey );
              await this.updateSource({ "system.ciKey": "" });              
            }
          } else{
            //console.log(createData);
          }
  }



}
import fs from "node:fs";
const p="data/catalog.json";
const data=JSON.parse(fs.readFileSync(p,"utf8"));
const errors=[];
if(data.schemaVersion!==1)errors.push("schemaVersion must be 1");
for(const group of ["resources","skills","patterns"]){if(!Array.isArray(data[group]))errors.push(group+" must be an array")}
const ids=new Set();
for(const item of [...data.resources,...data.skills,...data.patterns]){
  if(!item.id)errors.push("missing id");
  if(ids.has(item.id))errors.push("duplicate id: "+item.id);
  ids.add(item.id);
  if(item.kind==="resource"||data.resources.includes(item)){
    if(!item.url?.startsWith("https://github.com/"))errors.push("invalid upstream URL: "+item.id);
    if(!item.license)errors.push("missing license: "+item.id);
  }
}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`OK: ${data.resources.length} resources, ${data.skills.length} skills, ${data.patterns.length} patterns`);

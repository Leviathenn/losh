/**
 * @author Leviathan
 */
const { ChildProcess, exec, spawn } = require('child_process');
const fs = require('fs');
const axios = require("axios").default;
const { userInfo } = require('os');
const path = require('path');
const { exit } = require('process');
function isRoot() {
    return process.getuid() == 0; // UID 0 is always root
}
if(fs.existsSync(userInfo().homedir+'/'+'.losh/packages')){
        
}else{
    fs.mkdirSync(userInfo().homedir+'/'+'.losh')
    fs.mkdirSync(userInfo().homedir+'/'+'.losh/packages')
    fs.mkdirSync(userInfo().homedir+'/'+'.losh/logs')
    fs.mkdirSync(userInfo().homedir+'/'+'.losh/cache')
    
}

if(process.argv.length <= 2){
    console.log("Not enough args")
}else if(process.argv.length >= 3){
   // console.log("okk")
    if(process.argv[2] == "install"){
     //   console.log("t := ok")
        if(process.argv[3]){
            let packageName = process.argv[3];
            //Fetch lists
            fetchPackages(packageName)
        }
    }
}
var index = 1;
var godit = false
function fetchPackages(packageName){
    let packageLists = JSON.parse(fs.readFileSync('packages.json'));
    let packages = userInfo().homedir+'/.losh/packages'
    let cacheDir = userInfo().homedir+'/.losh/cache'
    let url = packageLists["url"]
     
    packageLists["packageDirs"].forEach(pkgdir => {
      
        let pkgdd = pkgdir["dir"]
        let pkglist = pkgdir["pkgList"]
      //  console.log(pkgdd)
        console.log(`\x1b[90mSearching for ${packageName} in package list ${pkglist}...`)
      
        let checkIndexCount = packageLists["packageCount"];
        
        
               
                console.log(`🔄 ${url}/${pkgdd}/${packageName}/manifest.json`)
                  axios({
                    method: "get",
                    url: `${url}/${pkgdd}/${packageName}/manifest.json`,
                  }).then(function (response) {
                    godit = true
                    //console.log(response.data);
                    console.log(`\x1b[32m ✔ \x1b[90m${packageName} has been located in package list ${pkglist}. Processding install`)
                    let requiresMoudle = response.data["requires"];
                    let latestVersion = response.data["latest"];
                    requiresMoudle.forEach(mod => {
                        let modName = mod["name"];

                        if(modName.startsWith("@")){
                            //Installing that package.
                            fetchPackages(modName.split("@")[1]);
                        }else{
                            exec(`which ${modName}`, (err, stdout)=>{
                                if(stdout == ""){
                                    if(pkglist == "root"){
                                        if(isRoot() == false){
                                            console.log(`\x1b[31m ❌ \x1b[90m${packageName} did not install correctly. Root is needed.`);
                                            exit(1)
                                        }else{
                                            //were good
                                        }
                                    }
                                    exec(`apt-get install ${modName}`, (lrr, stdout)=>{
                                        if(lrr){
                                            console.log(`\x1b[31m ❌ \x1b[90m${packageName} did not install correctly. The log file has been writin.`);
                                            fs.writeFileSync("losherr.log",lrr.message);
                                        }else{
                                   
                                           
                                            console.log(`\x1b[32m ✔ \x1b[90m${modName} has been Installed Sucessfully!`)
                                        }
                                       
       
                                    })
                                }else{
                                    console.log(`${modName} has already been installed.`)
                                    console.log(`\x1b[32m ✔ \x1b[90m${packageName} has been Installed Successfully!`)
                                }
                            })
                        }
                        
                    });
                    axios.get({
                        method: "get",
                        url: `${url}/manifests/v1/${latestVersion}.json`
                    }).then(function (res){
                        console.log("f")
                        var packageManif = res.data
                        //get the file
                        packageLists["pkgFiles"].forEach((pkg)=>{
                            console.log(pkg)
                            let pkgFileName = pkg["tmpPath"];
                            axios.get({
                                method: "get",
                                url: `${url}/${pkg["path"]}`
                            }).then( function(mse){
                                fs.mkdirSync(`${cacheDir}/${pkgFileName}`)
                                console.log(`${cacheDir}/${pkgFileName}`)
                                fs.writeFileSync(`${cacheDir}/${pkgFileName}/package.tar.gz`,mse);
                            }).catch( function (sads) { 

                             })
                        })
                    }).catch( function (brr){
                        
                    })
                }).catch(function (err){
                    if(godit){

                    }else{
                        console.log(`\x1b[31m ❌ \x1b[90m${packageName} not found in package list ${pkglist}.`)
                        if(index >= checkIndexCount){
                        
                            console.log(`\x1b[31m \x1b[1m❌ \x1b[90m${packageName} is not a vaild package.`)    
            
                        }else{
                            index++;
                         
            
                        }
                    }
                 
                 
                  });
                  
                  
        
    });
     
}

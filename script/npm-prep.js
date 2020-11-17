
const fs = require('fs')
const path = require('path')

function getConfig() {
  const fn = path.join('.', 'npm-prep.json')
  if(fs.existsSync(fn)) {
    try {
      const content = fs.readFileSync(fn).toString()
      const config = JSON.parse(content)
      return config
    } catch(e) {
      console.error(e)
    }
  } else {
    console.error('configuration does not exist at '+fn)
  }
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];

  // Check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
    fs.mkdirSync( targetFolder );
  }

  // Copy
  if ( fs.lstatSync( source ).isDirectory() ) {
    files = fs.readdirSync( source );
    files.forEach( function ( file ) {
      var curSource = path.join( source, file );
      if ( fs.lstatSync( curSource ).isDirectory() ) {
        copyFolderRecursiveSync( curSource, targetFolder );
      } else {
        copyFileSync( curSource, targetFolder );
      }
    } );
  }
}

function removeDir(dir) {
  if(fs.existsSync(dir)) {
    if (fs.lstatSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir)
      files.forEach(file => {
        let fp = path.join(dir, file)
        if (fs.lstatSync(fp).isDirectory()) {
          removeDir(fp)
        } else {
          console.log('remove file ' + fp)
          fs.unlinkSync(fp)
        }
      })
      console.log('remove dir '+dir)
      fs.rmdirSync(dir)
    }
  }
}

function recurseCopy(src, dest, recurse) {
  if(!fs.existsSync(dest)) {
    fs.mkdirSync(dest, {recursive:true})
  }
  if(fs.lstatSync(dest).isDirectory()) {
    if(fs.lstatSync(src).isDirectory()) {
      const files = fs.readdirSync(src)
      files.forEach(file => {
        let fp = path.join(src, file)
        let tp = path.join(dest, file)
        if(fs.lstatSync(fp).isDirectory()) {
          if(recurse) recurseCopy(fp, tp, recurse)
        } else {
          fileCopy(fp, tp)
          console.log('copy '+fp+' to '+tp)
        }

      })
    }
  }
}

function fileCopy(from, to) {
  console.log('copy '+ from + ' to '+ to)
  let leadPath = to.substring(0, to.lastIndexOf('/'))
  if(!fs.existsSync(leadPath)) {
    fs.mkdirSync(leadPath, {recursive:true})
  }
  fs.copyFileSync(from, to)
}


function copyFile(f, src, dest) {
  let from = path.join(src, f.name)
  let to = path.join(dest, f.rename || f.name)
  fileCopy(from, to)
}

function copyDir(name, recursive, src, dest) {
  let from = path.join(src, name)
  let to = path.join(dest, name)
  recurseCopy(from, to, recursive)
}

function copyActions(config) {
  const copyActions = config.copy;
  copyActions.forEach(action => {
    if(action.clean) {
      removeDir(action.to)
    }
    const files = action.files || []
    files.forEach(f => {
      copyFile(f, action.from, action.to)
    })
    const dirs = action.dirs || []
    dirs.forEach(d => {
      copyDir(d.name, d.recursive, action.from, action.to)
    })

  })
}

let config = getConfig()
console.log(config)
copyActions(config)